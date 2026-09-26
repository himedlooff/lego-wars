# Lego World War — how this site works and how to add a build

Static site, no framework, no npm install. Deployed by GitHub Pages from the
`main` branch, root folder, at https://legoworldwar.com (see `CNAME`).
Pushing to `main` is the deploy.

## Layout

- `index.html` — page shell, the logo card, plus a hidden `#buildTemplate` card that gets cloned per build.
- `assets/style.css` — all styling. Cards are 3:4 aspect ratio, dark page background. At 900px and wider the cards form one viewport-tall row that scrolls sideways; narrower screens stack them vertically.
- `assets/js/builds.js` — **generated, do not hand-edit.** `window.BUILDS` array of `{ id, name, totalFrames }`, newest build first.
- `assets/js/carousel.js` — clones the template for each entry in `BUILDS`, wires prev/next buttons, drag, left/right arrow keys, and turns mouse-wheel scrolling into sideways scrolling on desktop. It is a plain photo carousel, not a 3D or 360° spin. Image path is `assets/{id}_{frame}.jpg`, frame zero-padded to 2 digits.
- `assets/buildN_NN.jpg` — the photos the site serves. `N` is the build number, `NN` is the frame (carousel slide).
- `build-names.json` — maps `buildN` to a display name. Missing name falls back to `Build N`.
- `build-config.js` — Node script. Scans `assets/` for `buildN_NN.jpg`, counts frames, reads names, writes `builds.js`.
- `compress-images.sh` — macOS script (`sips` + `exiftool`). Resizes, recompresses and strips metadata from `originals/*.jpg` into `assets/`.
- `originals/` — full-size source photos. **Not tracked in git** (only a `.DS_Store`). Lives on Mike's machine only.

## Adding a new build

Say the last build is `build2` and the new one is the third.

1. Name the source photos `build3_01.jpg`, `build3_02.jpg`, ... and put them in `originals/`.
   - Frames must start at `01` and have no gaps. The viewer only knows the highest frame number and requests every number up to it; a gap is a broken image.
   - Order the frames the way you want them shown. The next button walks up the numbers and wraps.
   - Aspect ratio of the card is 3:4 portrait. Wider photos get letterboxed on grey.
2. Compress them. The README's settings (quality 80, max 1200px) match the existing builds; the script's own defaults (70, 1920) do not.
   ```sh
   ./compress-images.sh ./originals ./assets 80 1200
   ```
   - Needs `exiftool` (`brew install exiftool`). `sips` ships with macOS.
   - The script re-encodes **every** jpg in `originals/`, not just new ones. Only keep the new build's photos in `originals/` so old builds in `assets/` aren't re-compressed and show up as diffs.
   - If the photos are already compressed and stripped, skip this step and copy them straight into `assets/`.
3. Add the display name to `build-names.json`:
   ```json
   "build3": "Tank"
   ```
4. Regenerate the build list:
   ```sh
   node build-config.js
   ```
   It prints the build count. Check `assets/js/builds.js` shows the new build first with the right `totalFrames`.
5. Check it locally. Any static server works, for example:
   ```sh
   python3 -m http.server 8000
   ```
   Open http://localhost:8000, confirm the new card is first, click through every frame, no broken images.
6. Commit the new jpgs, `build-names.json` and `assets/js/builds.js`. Push to `main` (or open a PR to `main`). Pages rebuilds within a minute or two.

## Other changes

- **Rename a build:** edit `build-names.json`, run `node build-config.js`, commit both.
- **Add or remove a frame:** add/remove the jpg in `assets/` (renumber so there are no gaps), run `node build-config.js`.
- **Remove a build:** delete its jpgs from `assets/`, remove its name, run `node build-config.js`.
- **Styling or viewer behaviour:** `assets/style.css` and `assets/js/carousel.js`. Nothing is bundled, edit in place.

## Gotchas

- Never edit `assets/js/builds.js` by hand. The next `node build-config.js` overwrites it.
- Build numbers sort numerically and descending, so `build10` correctly lands above `build9`.
- Filenames are case-sensitive on Pages. Stick to lowercase `.jpg`.
- `.DS_Store` files are committed in a few places. Harmless, ignore them.
