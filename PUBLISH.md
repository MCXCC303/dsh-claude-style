# Publish / 发布流程

This document records how this skin is published and listed in the official
market. / 本文档记录本皮肤的发布与官方市场收录流程。

## 1. GitHub

```sh
git remote add origin https://github.com/TaiyakiOffical/claude-style-skin.git
git push -u origin main
```

## 2. npm

Requires an npm account with 2FA support; publish tokens with `bypass 2FA`
skip the OTP prompt. / 需要已开 2FA 的 npm 账号；带 bypass 2FA 的发布令牌可免 OTP。

```sh
npm login          # or: npm config set //registry.npmjs.org/:_authToken=npm_xxx
npm publish
```

Verify: `npm view claude-style-skin`

## 3. Official market (awesome-dsh-plugin)

The market catalog is curated in
[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin).
Submit a PR adding one file `data/plugins/TaiyakiOffical__claude-style-skin.yml`:

```yaml
url: https://github.com/TaiyakiOffical/claude-style-skin
name: TaiyakiOffical/claude-style-skin
category: theme
description:
  en: Claude-style warm-editorial skin for the DSH web GUI — ivory/warm-black canvas, a clay ember accent, serif display + sans UI + mono labels, hairline borders and pill CTAs, light/dark themes.
  zh: Claude 风格暖调编辑 DSH Web 皮肤：象牙白/暖黑双画布、陶烬橙点睛、衬线标题+无衬线界面+等宽标签、发丝线与胶囊 CTA，亮暗双主题跟随系统。
```

Then regenerate the READMEs and commit them with the YAML:

```sh
npm ci
node scripts/generate-readme.mjs
git add data/plugins/TaiyakiOffical__claude-style-skin.yml README.md README.zh.md
git commit -m "Add TaiyakiOffical/claude-style-skin (theme)"
git push origin <branch>
```

### Submission gate

The `Submission gate` check requires the repository to be **at least 1 day old**
and to have **at least 10 commits** before the entry is accepted. If it fails
on either, push more commits / wait for the repo to age, then re-trigger the
check (push any commit) and resubmit — nothing is held against a resubmission.
