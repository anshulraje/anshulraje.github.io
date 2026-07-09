# Anshul Raje — Portfolio Website

This is the personal portfolio website of Anshul Raje, a robotics engineer (quadrupeds,
autonomous vehicles, ROS 2) starting his MS in Robotics Engineering at WPI in Fall 2026.
This directory is the main and only source for the site. It is plain HTML/CSS/JS — no
framework, no build step, no server. Every page must work by opening the file directly
in a browser (`file://`).

## Hard rules

- **Never invent content.** All facts (dates, roles, metrics, project details, data
  values) come from Anshul. When adding or rewording content, preserve facts exactly;
  if information is missing, ask — do not fabricate.
- Keep the site dependency-free and openable locally. Google Fonts and YouTube thumbnails
  are the only external resources; everything else must be a relative path.

## Page index

| Page | One-liner |
|---|---|
| `index.html` | Home: hero, signature animation band, Experience, Projects grid, Education, Contact |
| `strider.html` | Strider Robotics — quadruped autonomy & perception (richest page: timeline, stats, architecture) |
| `f110.html` | F1/10 autonomous racing at HiPeRT Lab (simplest project page; also linked from the HiPeRT experience entry) |
| `kratos.html` | Project Kratos Mars Rover at BITS Goa |

## Supporting files

| Path | Purpose |
|---|---|
| `css/style.css` | **All** styling for every page — design tokens, components, both themes |
| `js/site.js` | Theme toggle handler + the home-page signature animation (four generated SVG scenes); theme *initialization* is an inline script in each page's `<head>` |
| `assets/<page>/` | Images per page (`index/`, `strider/`, `f110/`, `kratos/`), plus `assets/resumes/` |

## Design system (do not fork per-page styles)

- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (eyebrows, tags, metadata).
- **Accent:** ember orange — `--accent` is `#d64513` (light) / `#ff7a45` (dark).
- **Theming:** light is the default token set on `:root`; dark overrides live under
  `[data-theme="dark"]`. Never hardcode colors in HTML — always use the CSS variables.
- Each page's `<head>` has an inline script that sets `data-theme` before first paint
  (priority: `?theme=light|dark` URL param → localStorage → OS preference, falling back
  to **dark** unless the OS explicitly prefers light). Every new page
  must copy this script, the fonts `<link>`, the stylesheet link, the nav (with the
  theme-toggle button and its two SVG icons), and `<script src="js/site.js"></script>`
  before `</body>`.
- **Recurring components** (all defined in `style.css`): `.section-head` (numbered section
  headers `01 / Title` + rule), `.reveal` (entrance animation), `.tag`, `.btn-solid` /
  `.btn-outline`, `.project-card`, `.exp-item` (an `<a>` when a detail page exists, a `<div>`
  otherwise), `.tech-item`, `.phase-item` (timeline), `.stat-card`, `.arch-card` /
  `.layer-row`, `.video-card`, `.media-collage` / `.media-grid`, `.thesis-card`, `.note-strip`.

## How to extend

- **New experience:** copy an `.exp-item` block in `index.html` (an `<a>` if it has a detail
  page, a `<div>` if not). Keep reverse-chronological order.
- **New project card:** copy a `.project-card` in the `#projects` grid. Internal pages use
  `card-cta` text "View project"; GitHub links use "View on GitHub" with `target="_blank"`.
- **New project page:** copy the closest existing project page (`f110.html` is the simplest,
  `strider.html` has the timeline/stats/architecture components) and swap content. Put its
  images in a new `assets/<page>/` folder. Add its card to `index.html`.
- **New signature-animation scene:** each scene is an IIFE in `js/site.js` building into a
  `#sig-sN` group in `index.html`, styled by `.sig` classes in `style.css` (shared draw /
  pop / fadein vocabulary). Add the group, the IIFE, a caption, and a duration to the
  `caps` / `durs` arrays; scene-specific CSS needs reduced-motion fallbacks that render
  the final frame. Scene 04's system-ID parameter values are real data from Anshul —
  don't alter them.

## Verification

Before declaring done: check every local `src`/`href` resolves to a real file, and render
the changed pages in **both** themes. Headless Firefox here is a snap: it cannot write to
`/tmp`, so screenshot into `~/snap/firefox/common/`, and pass a profile with
`user_pref("ui.prefersReducedMotion", 1);` in `user.js` so entrance animations don't leave
the screenshot blank:

```bash
firefox --headless -profile ~/snap/firefox/common/ffprofile \
  --screenshot ~/snap/firefox/common/shots/out.png --window-size=1400,4800 \
  "file://$PWD/index.html?theme=light"
```

Also spot-check a narrow viewport (~420px wide).
