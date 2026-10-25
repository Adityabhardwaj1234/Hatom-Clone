# Hatom Clone

A complete, locally runnable clone of [https://www.hatom.com/](https://www.hatom.com/) —
including all scripts, styles, fonts, images, audio, Lottie animations, WebGL
assets (GLBs, textures, LUTs, MSDF fonts), DRACO/Basis decoders, and all
localized route pages with their Nuxt payloads.

## Run locally

Prerequisites: Python 3 (or Node.js).

```bash
cd clone
python -m http.server 8765
```

Then open [http://127.0.0.1:8765](http://127.0.0.1:8765).

With Node:

```bash
npx serve clone -l 8765
```

## Routes

- `/` (English home, full 3D scene)
- `/fr/`, `/zh/`, `/ko/`, `/pt/`, `/ro/`, `/es/` (localized)
- `/en/preview/`, `/fr/preview/`, ... (preview pages)
- `/en/about`, `/en/contact`, `/en/terms` and localized equivalents

## Notes

- External API calls (MultiversX, Hatom app) require network access.
- External media (audio, media kit) is loaded from the original CDN.
- The clone is a static mirror of the production build; it is not a source
  project. See `.agents/skills/clone-anything/SKILL.md` for the full cloning
  methodology (including optional source reconstruction).

## Credits

Original site and assets belong to Hatom. This clone is for educational and
research purposes only.
