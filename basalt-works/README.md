# Basalt Works

Scroll-driven 3D site for Basalt Works. React + Vite, with the 3D done in react-three-fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

Routes: `/` home, `/story` our story, `/credits` model credits.
Deep links work: `/story#hall`, `/#capability`.

When you deploy `dist/`, the host must serve `index.html` for unknown paths (a "single-page app" /
rewrite rule), otherwise a refresh on `/story` will 404. Netlify, Vercel and Cloudflare Pages
do this with one setting; for Netlify add a file `public/_redirects` containing `/* /index.html 200`.

## Stack

React 18 · Vite · React Router 6 · three.js 0.160 · @react-three/fiber · @react-three/drei ·
self-hosted fonts via Fontsource. Plain CSS, one file per component.

## Where things live

```
public/models/          the four .glb models (decoded from the old models.js)
src/
  main.jsx, App.jsx     entry + routes
  config/site.js        site name, contact email, model path helper
  content/              ALL the words: home.js, story.js, credits.js
  pages/                Home, Story, Credits (thin: content + scene)
  components/
    layout/             ScrollStory (the page shell), Navbar, Chapters, Backdrop, Hud, Loader
    ui/                 Action (every button/link)
    scene/              reusable 3D parts: Stage, CameraRig, Embers, Sparks, LightRig, StageRings...
  scenes/
    home/               HomeScene.jsx + config.js (camera path, shifts, glow)
    story/              StoryScene.jsx + config.js
    useFittedModel.js   model loading helpers
  hooks/                useScrollProgress, useProgressSubscription, usePageMeta ...
  lib/                  math, scroll-progress store, camera path, three helpers
  styles/               tokens.css (colours/fonts), global.css
```

## Common edits

- **Change any text, numbers or chapter timing:** `src/content/home.js` / `story.js`.
- **Make "Start a project" / "Work with us" send an email:** set `contactEmail` in `src/config/site.js`.
- **Move the camera or the subject position:** `src/scenes/<page>/config.js`
  (`cameraKeys` = where the camera is at each scroll position, `shifts` = how far the model slides sideways).
- **Add a new scroll page:** add `content/<name>.js`, a `scenes/<name>/` folder, a page in `pages/`,
  and a `<Route>` in `App.jsx`. `ScrollStory` does the rest.
- **Colours / fonts:** `src/styles/tokens.css`.
- **Look at one scroll position while testing:** open any page with `?debug`, then in the console
  run `__basalt.setP(0.5)`.

## Licence note

The 3D models are CC BY 4.0 (Sketchfab). Keep the `/credits` page, or an equivalent credit, on the live site.
