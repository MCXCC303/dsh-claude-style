#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the picker's Gemini face from the upstream Google Sans Flex variable font.

Manual tool, deliberately NOT part of `npm run build`: it needs Python + fontTools,
and the repo's zero-dependency Node build must stay that way. Re-run it only when
the charset or the pinned instance changes:

    pip install fonttools brotli
    python scripts/slim-google-sans.py "path/to/GoogleSansFlex[GRAD,ROND,opsz,slnt,wdth,wght].ttf"

The source is the 4.2 MB six-axis variable font from
https://github.com/googlefonts/googlesans-flex (not committed here). What this does:

1. Instances the variable font at its own axis defaults — wght 400, slnt 0,
   wdth 100, GRAD 0, ROND 0, opsz 18 — i.e. the standard-weight upright cut. The
   defaults are read from `fvar` instead of being hardcoded, so an upstream
   revision that moves them cannot silently change what "standard" means here.
2. Renames the family to `Google Sans Flex Picker`. Upstream declares no Reserved
   Font Name, so a subset (an OFL "Modified Version") would be allowed to keep the
   original name; it is renamed anyway, because a Latin-only subset registered
   under the same family would shadow a full system-installed copy on this page.
3. Subsets to Latin letters, digits and the punctuation the picker's labels use,
   keeping only the `kern` feature so a model name renders deterministically
   (no ligature substitutions inside a label).
4. Writes `fonts/GoogleSansFlexPicker.woff2` — about 12 KB.

The face stays under the SIL Open Font License 1.1: `fonts/OFL-GoogleSansFlex.txt`
carries the upstream copyright notice and the licence text, and the binary keeps the
name-table records (IDs 0/13/14) that point at it. Condition 5 of the licence means
this subset must not be redistributed under any other licence.
"""
import os
import sys

from fontTools.subset import Options, Subsetter, parse_unicodes
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FAMILY = "Google Sans Flex Picker"
SUBFAMILY = "Regular"
PS_NAME = "GoogleSansFlexPicker-Regular"
# Taken from the source's name ID 5 ("Version 4.007;[52e1f16]").
VERSION = "4.007"
# Latin letters, digits and the punctuation the picker's labels use: ASCII
# printable, no-break space, middle dot, en/em dash, curly quotes, ellipsis.
UNICODES = parse_unicodes("U+0020-007E,U+00A0,U+00B7,U+2013,U+2014,U+2018-201D,U+2026")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "fonts", "GoogleSansFlexPicker.woff2")


def instance_standard(font):
    """Pin every axis to its default, turning the variable font into one static cut."""
    limits = {axis.axisTag: axis.defaultValue for axis in font["fvar"].axes}
    print("pinning axes:", limits)
    return instantiateVariableFont(font, limits, inplace=True)


def rename(font):
    """Point the name table at this subset instead of the upstream family."""
    mapping = {
        1: FAMILY,
        2: SUBFAMILY,
        3: "%s;GOOG;%s" % (VERSION, PS_NAME),
        4: "%s %s" % (FAMILY, SUBFAMILY),
        6: PS_NAME,
        16: FAMILY,
        17: SUBFAMILY,
    }
    name = font["name"]
    for record in list(name.names):
        if record.nameID in mapping:
            name.setName(mapping[record.nameID], record.nameID, record.platformID,
                         record.platEncID, record.langID)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    font = instance_standard(TTFont(sys.argv[1]))
    rename(font)
    options = Options()
    options.name_IDs = ["*"]            # keeps the OFL records (0/13/14) intact
    options.name_languages = ["*"]
    options.layout_features = ["kern"]  # deterministic labels: no ligature substitution
    options.glyph_names = True
    options.notdef_glyph = True
    options.notdef_outline = True
    options.flavor = "woff2"
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    font.flavor = "woff2"               # TTFont.save() reads this, not options.flavor
    font.save(OUT)
    print("wrote %s (%d bytes, %d glyphs)" % (OUT, os.path.getsize(OUT), font["maxp"].numGlyphs))


if __name__ == "__main__":
    main()