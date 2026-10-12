# gbppimentel-dev — portfolio

This version starts from your working **original React + Vite migration**, not the replacement website in v2. The original visual identity remains: the full-screen three-slide carousel, abstract images, Tilt Warp typography, code-style headlines, illustrated About cards, animated full-screen menu, cursor follower, and hover effects.

## Solid logo and carousel brand colors (0.3.6)

This complete project can be used directly from the last applied **gbppimentel-dev** branding version. You can skip all previous logo-update ZIPs.

- **Approved double-storey g:** the wider letter has a squared lower loop with a flat bottom.
- **Compact proportions:** the slash no longer extends above the letter, and the shallow lower loop finishes at the same bottom edge as the slash.
- **Three continuous color bands:** amber, coral, and blue meet edge-to-edge with no cut gaps.
- **Stronger slash:** the slash is slightly thicker, with more space separating it from the g.
- **Exact approved artwork:** this uses the final spaced version approved after the gaps were removed. Exports preserve its proportions and alpha transparency.
- **Transparent icons:** the mark, PNG favicons, embedded ICO images, and home-screen exports retain their alpha channels without a filled rectangle.
- Header, open menu, footer, browser tab, and home-screen icons use the new artwork. Versioned icon filenames avoid the previous favicon cache.

The `-dev` suffix now follows the active carousel slide across the header wordmark, hero name, menu, and footer:

| Carousel slide | `-dev` color |
| --- | --- |
| 1 | Amber (`#d8b97c`) |
| 2 | Coral (`#d79998`) |
| 3 | Blue (`#93aec6`) |

The color is driven by Swiper's real slide index, so autoplay and manual navigation use the same source of truth, including loop wraparound. It also updates when navigating manually while autoplay is paused. The color transition is subtle and respects the existing reduced-motion rules. Autoplay timing, hover/focus pause behavior, real-name placement, layout, and project content remain as before.

Implementation: `src/components/Hero.jsx` reports the real slide index to `src/App.jsx`, which sets the shared `--brand-accent` CSS property. `src/styles/branding.css` applies it to the `-dev` labels.

Logo files:

- `public/brand/solid-mark-512.png`: normalized transparent website mark.
- `public/brand/solid-logo-master.png`: full-size approved generated original.
- `public/brand/solid-favicon-16.png`, `solid-favicon-32.png`, and `solid-favicon-48.png`: transparent tab icons.
- `public/favicon-solid.ico`: explicit browser ICO, with `public/favicon.ico` updated as a fallback.
- `src/components/Brand.jsx`: the logo with the live gbppimentel-dev wordmark.

The symbol was created with the built-in image-generation tool and approved before integration. Final prompt direction: preserve the compact double-storey g, shallow angular lower loop, and common top/bottom proportions; remove both horizontal cut gaps while keeping the solid amber #D8B97C, coral #D79998, and blue #93AEC6 boundaries aligned; thicken the slash slightly, then move it right by about 40px at the original 1280px scale. Keep the background, counters, and space between glyphs transparent. The final approved raster master is included above.

Validation: production build and asset-reference checks pass. Real Swiper DOM checks verify automatic slide changes, Next/Previous, forward/backward loop wrap, manual navigation while paused, and reduced-motion navigation. PNG and embedded ICO transparency were verified; the mark was visually checked on light and dark surfaces at header and favicon sizes. Full browser page rendering remains unverified in this environment.

If a browser tab still shows an older icon, close and reopen that tab after starting the updated project.

## Run it in VS Code

1. Extract `gbppimentel-dev-brand-sync.zip` into a **new folder**. Keep your current working copy until you have compared them.
2. In VS Code, choose **File → Open Folder** and open the extracted `gbppimentel-dev` folder. You should see `package.json` directly inside it.
3. Choose **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite. Press **Ctrl+C** in the terminal to stop the server.

The project requires Node.js 20.19+ in the Node 20 series, or 22.12+ in newer supported releases (the same requirement as the original migration).

To check a production build:

```bash
npm run build
npm run preview
```

## What changed

- **Same original artwork.** Backgrounds use CSS saturation and brightness adjustments on separate decorative layers. Text, links, screenshots, and the resume do not inherit those filters. Original image files have not been edited.
- **Darker color treatment.** Ink and charcoal with smoky blue, muted amber, dusty coral, and lilac details. The original graphic compositions remain visible.
- **Original animation style.** Sliding/parallax carousel, looping slides, animated menu layers and hamburger, button text rollover, cursor follower, and back-to-top interaction remain. The slides have a pause button and respect reduced-motion preferences.
- **Same site structure.** Home → About Me → Projects → Awards → Contact. All are sections on the same page. No Notebook or unrelated new page structure.
- **The existing unfinished sections now have a base.** Projects contains Salt & Light and LifeCity Attendance; Artworks and Games have honest empty states. Awards has a placeholder until actual entries are added. Contact uses the existing LinkedIn URL and resume.
- **Responsive CSS adjustments.** Scalable hero text, controls along the bottom on phones, two-column About cards on tablets, one-column cards on phones, and larger menu targets.
- **Local fonts.** Tilt Warp, Poppins, and Roboto are included with their licenses. The live app no longer needs Google Fonts requests.

## Where to edit

| What you want to change | File |
| --- | --- |
| Palette, artwork saturation, spacing, responsive rules | `src/styles/refinement.css` |
| Logo lockup and brand spacing | `src/components/Brand.jsx`, `src/styles/branding.css` |
| Original underlying theme styles | `src/styles/style.css` |
| Three hero slides and their wording | `src/components/Hero.jsx` |
| About Me text and four illustrated cards | `src/components/About.jsx` |
| Social links, project entries, awards, contact details | `src/data.js` |
| Project layout and filters | `src/components/Projects.jsx` |
| Menu | `src/components/Navigation.jsx` |
| Contact and footer | `src/components/Footer.jsx` |
| Original graphics | `public/images/` |
| Resume PDF | `public/Pimentel-Resume-IT.pdf` |

### Adjust the colors

Open `src/styles/refinement.css`. The `:root` block at the top contains the palette:

```css
--ink: #14151b;
--blue: #93aec6;
--amber: #d8b97c;
--coral: #d79998;
--lilac: #aaa0cb;
```

The same file controls the background treatment using `--art-saturation` and `--art-brightness`. Slide two and slide three have individual overrides because their source images are much brighter than slide one. The menu, About section, and footer have their own filters in that file. Search for `filter:` to tune each one.

### Add real project material

Open `src/data.js` and find an item in `projects`.

1. Put a screenshot in `public/images/projects/`, creating the folder if needed.
2. Set `screenshot` to a path such as `images/projects/salt-and-light.png` (do not include `public/`).
3. Add the actual `liveUrl` and/or `sourceUrl` when ready. Empty values do not create links.
4. Add a `details` paragraph to show an expandable description.
5. Update `status` and `description` to match the project. The original graphic tile is a cover, not a claimed app screenshot.

To add a project, copy an existing object, give it a unique `id`, and choose `Web development`, `Artworks`, or `Games` as the category. Additional projects appear automatically.

### Add awards

The `awards` array in `src/data.js` starts empty. Replace it with real entries, for example:

```js
export const awards = [
  {
    title: 'Your actual award or certification',
    organization: 'The issuing organization',
    year: '2026',
    url: '',
  },
];
```

The placeholder automatically becomes a list. No sample award is presented as a real achievement.

### Contact and resume

Set `contact.email` in `src/data.js` when you want a public email link. Until then the main contact button goes to the existing LinkedIn profile. The footer keeps the original social accounts, with GitHub pointing to `gbppimentel-dev`.

The included resume and About text are carried over from the original migration. Update those files directly when your professional content is ready.

## Validation

- Production build passes.
- New DOM checks pass for carousel color synchronization: real Swiper autoplay (with a shortened test timer), Next/Previous, looping in both directions, manual navigation while paused, reduced-motion navigation, and CSS property cleanup on unmount. Tests run in React Strict Mode; DOM tests cannot verify touch gestures or rendered transitions.
- The accepted base previously passed menu, focus, project-filter, and section-anchor checks. Those unrelated checks were not rerun for this update.
- Local asset and archive integrity checks pass.
- **Rendered browser visual checks remain unverified.** Chromium could not launch in this execution environment. Review the layout locally on desktop, tablet, and phone before publishing, including all three slides and the open menu. The DOM checks do not prove pixel layout or touch behavior.

This ZIP does not change or deploy your GitHub repository. Relative asset paths are retained for hosting below a repository path. The original archived HTML/JavaScript remains in `legacy/`; the React application does not execute those old scripts. Font licenses are included under `public/fonts/`.
