#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the model picker's vendor lockups from Lobe Icons.

Manual tool, not part of `npm run build`: it is the repo's networked step (like
`fetch-lobe-icons.mjs` was), and the zero-dependency Node build must stay offline.
It replaces that script, because the skin no longer draws a vendor mark beside a
text label — it draws one lockup per vendor, the way Lobe's React `Combine` does.

    pip install fonttools
    python scripts/fetch-lobe-combines.py

Where the pieces come from (all pinned to one upstream version):

- `@lobehub/icons-static-svg` ships the artwork: `<id>.svg` (mono mark),
  `<id>-color.svg` (colour mark), `<id>-text.svg` (wordmark), and for a few
  vendors `<id>-brand.svg` / `<id>-brand-color.svg` (a ready-made lockup). There
  is no `-combine` file: Combine is a React composition, not an asset.
- `@lobehub/icons` ships the rules: `es/toc.js` has the brand colour and which
  variants exist, and each `es/<Icon>/style.js` has the composition ratios
  (`TEXT_MULTIPLE`, `SPACE_MULTIPLE`, `COLOR_PRIMARY`).

Each vendor becomes one SVG under `src/assets/icons/combine/`:

    <svg viewBox="0 0 <width> <cap band>">
      <g class="dsh-combine-color">…</g>   colour canvas: the colour art
      <g class="dsh-combine-mono">…</g>    dark canvas: mono art in currentColor
    </svg>

The viewBox is the *wordmark's capital band*, not the artwork's box, so the
stylesheet can size every lockup with one `height: 1cap` rule and let the mark
(which is taller) paint outside it — the same trick the hand-vendored wordmarks
used. The stylesheet shows one layer per canvas.
"""
import json
import os
import re
import sys
import urllib.request

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.svgLib.path import parse_path

STATIC = 'https://unpkg.com/@lobehub/icons-static-svg@1.95.0/icons'
REACT = 'https://unpkg.com/@lobehub/icons@1.95.0'
VERSION = '1.95.0'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COPY = os.path.join(ROOT, 'src', 'model-descriptions.json')
OUT_DIR = os.path.join(ROOT, 'src', 'assets', 'icons', 'combine')

# Canvas colours the contrast check is run against (src/styles/tokens.css).
LIGHT_CANVAS = '#fcfcfb'
DARK_CANVAS = '#141413'
# WCAG contrast below this and the brand colour is not legible on that canvas, so
# the mono layer (currentColor) is used there instead of a tint.
MIN_CONTRAST = 3.0

TEXT_TAG = re.compile(r'<(path|g|defs|circle|rect|ellipse|polygon|polyline)\b')
SVG_OPEN = re.compile(r'<svg\b[^>]*>', re.I)
VIEW_BOX = re.compile(r'viewBox="([^"]+)"')


def fetch(url):
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf8')


def inner(svg):
    """The markup inside the root <svg>, plus its viewBox."""
    match = SVG_OPEN.search(svg)
    if match is None:
        raise ValueError('not an svg document')
    box = VIEW_BOX.search(svg[:match.end()])
    if box is None:
        raise ValueError('no viewBox')
    body = svg[match.end():svg.rindex('</svg>')]
    # Upstream puts the paint on the *root* (`fill="currentColor"`,
    # `fill-rule="evenodd"`) and the paths inside inherit it, so taking only the
    # inner markup leaves every shape unpainted — which is what the first build of
    # this script shipped: the lockups held their space and drew nothing. Re-apply
    # the root's paint on a wrapper group, and drop the upstream `<title>` (the
    # row's own label is the accessible name; a title would be a hover tooltip).
    body = re.sub(r'<title>.*?</title>', '', body, flags=re.S)
    paint = ''
    for name in ('fill', 'fill-rule'):
        found = re.search(r'\b%s="([^"]*)"' % name, match.group(0))
        if found is not None:
            paint += ' %s="%s"' % (name, found.group(1))
    return box.group(1), '<g%s>%s</g>' % (paint, body)


def paths_of(body):
    """Every `d` attribute in the markup, in document order."""
    return re.findall(r'\sd="([^"]+)"', body)


def subpath_boxes(d):
    """Per-subpath ink boxes of one path, split at every moveTo."""
    rec = RecordingPen()
    parse_path(d, rec)
    groups, current = [], []
    for op, args in rec.value:
        if op == 'moveTo' and current:
            groups.append(current)
            current = []
        current.append((op, args))
    if current:
        groups.append(current)
    out = []
    for group in groups:
        part = RecordingPen()
        part.value = group
        pen = BoundsPen(None)
        part.replay(pen)
        if pen.bounds is not None:
            out.append(pen.bounds)
    return out


def cap_band(boxes):
    """The capital band of a wordmark, from its own subpath boxes.

    The baseline is the most common bottom edge (every flat letter rests on it),
    and the cap height is the tallest letter that also rests on that baseline —
    so an ascender like "k" cannot stretch it. Returns (top, baseline) or None.
    """
    if not boxes:
        return None
    bottoms = {}
    for box in boxes:
        bottoms[round(box[3], 1)] = bottoms.get(round(box[3], 1), 0) + 1
    baseline = max(bottoms.items(), key=lambda kv: (kv[1], kv[0]))[0]
    tallest = None
    for box in boxes:
        if abs(box[3] - baseline) > 0.75:
            continue
        height = baseline - box[1]
        if height > 0 and (tallest is None or height > tallest):
            tallest = height
    if tallest is None:
        return None
    return baseline - tallest, baseline


def luminance(hex_colour):
    value = hex_colour.lstrip('#')
    if len(value) == 3:
        value = ''.join(c * 2 for c in value)
    channels = []
    for i in (0, 2, 4):
        c = int(value[i:i + 2], 16) / 255
        channels.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    high, low = max(la, lb), min(la, lb)
    return (high + 0.05) / (low + 0.05)


def tint(body, colour):
    """A mono artwork painted in one colour instead of currentColor."""
    return re.sub(r'(fill=")currentColor(")', r'\g<1>%s\g<2>' % colour, body)


def scale_mark(body, scale, dx, dy):
    return '<g transform="translate(%.4f %.4f) scale(%.6f)">%s</g>' % (dx, dy, scale, body)


def compose(brand, mark_body, mark_box, text_body, text_box, text_multiple, space_multiple, colour_body, word):
    """One lockup: the mark, the gap, then the wordmark, on a cap-band viewBox."""
    mark_w, mark_h = mark_box[2], mark_box[3]
    text_w, text_h = text_box[2], text_box[3]

    boxes = []
    for d in paths_of(text_body):
        boxes.extend(subpath_boxes(d))
    band = cap_band(boxes)
    if band is None:
        raise ValueError('could not measure the wordmark')
    cap_top, baseline = band
    cap_height = baseline - cap_top

    # The wordmark's own box scales to `mark height x TEXT_MULTIPLE` (Lobe's rule),
    # and the mark's height follows from wanting the capitals to land on the
    # label's cap height: capHeight * k = 1, where k is the text box's scale.
    # Everything is expressed in the composed space, whose height is the cap band.
    text_scale = 1.0 / cap_height  # text units -> composed units (cap band = 1)
    box_scale = text_scale * text_h  # the text box's height in composed units
    mark_height = box_scale / text_multiple
    mark_scale = mark_height / mark_h
    mark_width = mark_w * mark_scale
    gap = mark_height * space_multiple
    text_width = text_w * text_scale

    # The mark centres on the cap band (its own box top is y=0, so no cap-top
    # term); the wordmark's baseline is the box's bottom edge.
    mark_dy = (1 - mark_height) / 2
    text_dy = -cap_top * text_scale
    text_dx = mark_width + gap

    width = text_dx + text_width
    # The wordmark is shared by both canvases, so it is emitted once; only the mark
    # has two layers, and the stylesheet swaps them. Duplicating the wordmark into
    # both layers cost ~120 kB across the set for nothing.
    mark_layers = []
    if colour_body is not None:
        mark_layers.append('<g class="dsh-combine-mark-color">%s</g>' % scale_mark(colour_body, mark_scale, 0, mark_dy))
    mono_class = 'dsh-combine-mark-mono' if colour_body is not None else 'dsh-combine-mark-mono dsh-combine-mark-color'
    mark_layers.append('<g class="%s">%s</g>' % (mono_class, scale_mark(mark_body, mark_scale, 0, mark_dy)))
    text_layer = '<g class="dsh-combine-text">%s</g>' % scale_mark(text_body, text_scale, text_dx, text_dy)

    # Every source may carry <defs> (gradients, clip paths); ids are namespaced per
    # icon upstream, so they can be concatenated without colliding.
    defs = ''.join(
        m.group(0) for m in re.finditer(r'<defs>.*?</defs>', (mark_body or '') + (text_body or '') + (colour_body or ''), re.S)
    )

    svg = '<svg fill="none" viewBox="0 0 %.4f 1" data-combine-word="%s" xmlns="http://www.w3.org/2000/svg">%s%s%s</svg>' % (
        width, word, defs, ''.join(mark_layers), text_layer,
    )
    return re.sub(r'>\s+<', '><', svg).strip()


def main():
    copy = json.load(open(COPY, encoding='utf8'))
    brands = set()
    for rule in copy['brands']['models']:
        brands.add(rule['brand'])
    for value in copy['brands']['providers'].values():
        brands.add(value)

    toc_raw = fetch('%s/es/toc.js' % REACT)
    start, depth, end = toc_raw.index('['), 0, None
    for i in range(start, len(toc_raw)):
        if toc_raw[i] == '[':
            depth += 1
        elif toc_raw[i] == ']':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    toc = {e['id'].lower(): e for e in json.loads(toc_raw[start:end])}

    # One parallel pass for every file the build needs. The toc's variant flags say
    # what exists, so a missing `-color` never costs a round trip; without this the
    # script spends ~150 sequential requests on ~40 vendors.
    jobs = {}
    plan = {}
    for brand in sorted(brands):
        entry = toc.get(brand.replace('-', ''))
        params = (entry or {}).get('param') or {}
        # A vendor the React package does not list still has static artwork; compose
        # it with Lobe's default ratios and a currentColor mark, so the picker covers
        # every vendor the catalog can name instead of only the documented ones.
        urls = {'mark': '%s/%s.svg' % (STATIC, brand), 'text': '%s/%s-text.svg' % (STATIC, brand)}
        if entry is not None:
            urls['style'] = '%s/es/%s/style.js' % (REACT, entry['id'])
            if not params.get('hasText', True):
                urls.pop('text')
            if params.get('hasColor'):
                urls['color'] = '%s/%s-color.svg' % (STATIC, brand)
        plan[brand] = (entry, urls)
        jobs.update({url: None for url in urls.values()})

    from concurrent.futures import ThreadPoolExecutor

    def grab(url):
        try:
            return url, fetch(url)
        except Exception:
            return url, None

    with ThreadPoolExecutor(max_workers=8) as pool:
        for url, text in pool.map(grab, list(jobs)):
            jobs[url] = text

    os.makedirs(OUT_DIR, exist_ok=True)
    written, skipped, skipped_toc, tinted, mono_only = [], [], [], [], []
    for brand in sorted(brands):
        entry, urls = plan[brand]
        style = jobs.get(urls.get('style'))
        def value(name):
            if style is None:
                return None
            m = re.search(r"export var %s = '?([^';]+)'?;" % name, style)
            return m.group(1) if m else None
        text_multiple = float(value('TEXT_MULTIPLE') or 0.7)
        space_multiple = float(value('SPACE_MULTIPLE') or 0.2)
        brand_colour = value('COLOR_PRIMARY') or (entry or {}).get('color') or '#000'
        if entry is None:
            skipped_toc.append(brand)

        try:
            mark_box_s, mark_body = inner(jobs[urls['mark']])
            text_box_s, text_body = inner(jobs[urls['text']])
        except Exception as error:
            skipped.append((brand, 'missing mark/text (%s)' % error))
            continue

        colour_body = None
        if jobs.get(urls.get('color')) is not None:
            colour_body = inner(jobs[urls['color']])[1]
        elif contrast(brand_colour, LIGHT_CANVAS) >= MIN_CONTRAST:
            # No colour artwork: tint the mono mark with Lobe's brand colour, but
            # only if it is legible on the light canvas.
            colour_body = tint(mark_body, brand_colour)
            tinted.append(brand)
        else:
            mono_only.append((brand, brand_colour))

        def box_of(spec):
            return [float(x) for x in re.split(r'[ ,]+', spec.strip())]

        try:
            svg = compose(brand, mark_body, box_of(mark_box_s), text_body, box_of(text_box_s),
                          text_multiple, space_multiple, colour_body,
                          (entry or {}).get('title') or brand)
        except Exception as error:
            skipped.append((brand, 'compose failed: %s' % error))
            continue

        # newline='' keeps the file LF on Windows too: git normalises on commit, but
        # a CRLF working copy makes every later diff look dirty for no reason.
        with open(os.path.join(OUT_DIR, '%s.svg' % brand), 'w', encoding='utf8', newline='\n') as fh:
            fh.write(svg + '\n')
        written.append(brand)

    total = sum(os.path.getsize(os.path.join(OUT_DIR, f)) for f in os.listdir(OUT_DIR))
    print('wrote %d lockups to src/assets/icons/combine (%d B)' % (len(written), total))
    print('  colour layer from Lobe artwork : %d' % (len(written) - len(tinted) - len(mono_only)))
    print('  colour layer tinted (no artwork): %s' % (', '.join(tinted) or '—'))
    print('  mono only (tint fails contrast on light): %s' % (
        ', '.join('%s %s' % t for t in mono_only) or '—'))
    print('  skipped: %s' % (', '.join('%s (%s)' % t for t in skipped) or '—'))
    print('  composed without a toc entry (default ratios, currentColor): %s' % (', '.join(skipped_toc) or '—'))
    print('\ncontrast of every brand colour on the two canvases:')
    for brand in sorted(brands):
        entry = toc.get(brand.replace('-', ''))
        if entry is None:
            continue
        colour = entry.get('color') or '#000'
        print('  %-14s %-9s light %5.2f  dark %5.2f%s' % (
            brand, colour, contrast(colour, LIGHT_CANVAS), contrast(colour, DARK_CANVAS),
            '' if contrast(colour, LIGHT_CANVAS) >= MIN_CONTRAST else '   <- light falls back to currentColor'))


if __name__ == '__main__':
    sys.exit(main())
