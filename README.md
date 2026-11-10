# gbppimentel-dev — responsive portfolio

The portfolio now uses one shared React application for desktop, tablet, and phone. Its original sliding hero, typography, amber/coral/blue palette, project content, and core interactions remain the basis of the design. Responsive composition and lighter animation work make the same portfolio usable across screen sizes.

This section describes the current application. The older release notes below are retained as history and may describe features, assets, or limitations that have since changed.

## Local development

Use the Node.js version range in `package.json` (Node 20.19+ in the Node 20 series, or 22.12+ in supported newer releases).

```bash
npm install
npm run dev
```

Open the URL printed by Vite. To validate a production bundle and preview it locally:

```bash
npm test
npm run build
node scripts/audit-build.mjs
npm run preview
```

The 0.4.0 viewport checks and measured bundle/image changes are recorded in [`docs/responsive-validation.md`](docs/responsive-validation.md) and [`docs/performance-audit.json`](docs/performance-audit.json).

## Keep desktop and mobile together

Every future UI and content edit must work on desktop, tablet, and mobile in both themes. Dark is the default, and the sun/moon control remembers the visitor's choice. Use the existing shared React components and data, rather than creating a separate phone version to maintain.

- Main content and project facts live in `src/data.js` and the showcase modules in `src/data/`.
- The shared shell and screen-size composition use `src/styles/responsive.css`.
- About and project layouts have scoped responsive styles alongside their existing component styles.
- About's technical profile and sourced project evidence use `src/data/aboutProfile.js` and `about-technical.css`. The editable `profile-id-front-r9.svg` / `profile-id-back-r9.svg` artwork keeps the original portrait on a straight matte field. Desktop and touch share the artwork and branded woven strap, whose tint follows the adaptive accent. `id-workbench.css` provides a static recessed color wash, masked halftone, and 14 elliptical contours without decorative initials; the backdrop refinement leaves the r9 card artwork unchanged. About reuses NetSuite's scoped `Crosshair` cursor with target locking, coordinates, and click pulses. It loads lazily only for an active About scene on a desktop hover/fine pointer; touch and reduced motion keep their normal interactions, without another global cursor dot.
- `themes.css` and `themes-pages.css` define the separate light experience, including page surfaces, artwork treatment, controls, and case-study shells. The shared theme controller uses a native 650ms whole-page swipe where supported, with a bounded 360ms surface fade fallback. Hidden documents and reduced motion apply the choice immediately; rapid toggles cannot restore an older choice. The transition preserves the live page state and the visitor's saved theme.
- The accepted finish is in `src/styles/surface-refinement.css`: the decorative hero arrows and print treatment are removed while the original palette, components, and motion remain.
- Hero window chrome is in `src/styles/hero-technical.css`; stable frames and slim controls are in `src/styles/hero-polish.css`. Primary buttons share `HeroAction.jsx` and `hero-actions.css`. `HeroBackdrop.jsx` enhances the existing backgrounds with optical contours and a light sweep, with no foreground objects or decorative captions. Hero 1 retains its existing treatment; Heroes 2 and 3 use a blue/cool moving field that contrasts with the warm adaptive accent. The 6.4-second contour drift and 5.2-second sweep start midcycle with negative delays, and `useSwiperSlide` explicitly gates them to the active slide alongside shared activity preferences. The carousel dwell remains 5,500ms.
- The open menu uses `navigation-depth.css` for its artwork and `navigation-tech.css` for its software-directory layout, section paths, selection strips, and header spacing. Tab and Shift+Tab cycle through routes, social profiles, and header controls; Enter opens a route, and Escape closes the menu and restores its toggle. Keyboard focus has a clear row outline and reveals clipped rows within the panel. `runtime-polish.css` adds static sparse dots and diagonal texture to the filled header surface in both themes.
- Hero 2's two-line fitting lives in `SlideTwoText.jsx` and `hero-two-lines.css`; `design + code` belongs only in the window header. Hero 3's headline and finite staggered word reveal live in `HeroSystems.jsx` and `hero-systems.css`. Hero actions sit in their panel footers, right aligned on desktop and full width on compact screens.
- `TextLoop.jsx` and `TextLoop.css` provide the open filled/outlined word ribbons with static microchip traces. Keep the existing desktop overlap/cap behavior in About/Contact styles and normal-flow compact layout. `HeroScrollCue.jsx` shares the scene's activity handling for its schematic mouse indicator.
- Phones and tablets open the actual portfolio directly. The touch identity card flips the same front/back artwork; it does not download the desktop Three.js interaction.

Preserve the established visual identity when making focused edits. Desktop-specific physical effects can use an equivalent touch-friendly interaction, while content and destinations stay shared.

## Animation and image performance

Use `src/hooks/useAnimationActivity.js` for autonomous effects. It combines viewport activity with document visibility, reduced-motion preference, input type, and parent scene activity. Hidden tabs, offscreen content, inactive hero slides, and covered scenes should not keep animation work running. User controls and reduced-motion preferences must continue to work when animation resumes.

The original morph/color loader starts from one HTML overlay before the application initializes. Its critical `public/portfolio-loader.css` animates four small directly painted SVG paths: one filled core and three outlined echoes. All four share the current geometry and color clock with zero phase delay, matching the original animation. Only echo expansion, fading, and stroke weight are staggered; do not freeze echoes as emitted shapes or use unreliable clones of a non-painted definition. HTML echo wrappers retain transform/opacity animation. App import waits for the first painted frames; page content mounts after the isolated intro. `src/utils/pageLoader.js` coordinates intro, document/font/image readiness, lazy-route commit, cancellation, and fallback. `PageLoader.jsx` adopts the existing overlay. Keep one overlay and defer page focus until it dismisses.

`src/styles/startup-components.js` loads eager component CSS in its original order before the global refinements. Keep that list synchronized when adding an eager component stylesheet so deferred JavaScript cannot change the style cascade. The build audit reports head assets, the deferred App increment, and their combined startup total; use the combined total when comparing payloads.

Three.js is lazy-loaded for the visible desktop ID interaction. About shows a section-level identity loader until both face images are decoded, the strap and hardware are ready, and the complete scene has rendered successfully. The extended canvas stays hidden until that first complete frame; a module resolving while About is covered waits before initializing Three. The card renderer uses bounded simulation work. It sleeps after projected card/strap points remain within a 0.6 CSS-pixel window for 0.8 seconds, even if the constraint solver retains tiny residual velocities. Gestures, breeze, resizing and resumed activity reset the still window; palette-only tint draws keep the simulation asleep. WebGL/loading failures switch to a complete flat card and strap, with a text card if images are unavailable and a working retry action. Touch/reduced-motion layouts use the same bounded image readiness and complete fallback. Keep large images out of eager loading paths where they are not needed for the opening screen.

During local development, `/?id-check=slow#about` delays the first ID attempt and `/?id-check=error#about` exercises fallback and retry. These opt-in diagnostics are excluded from production; the global morph loader remains separate from the identity section loader.

The adaptive palette follows the hero while it is visible and continues on its own 5.5-second timer afterward. The palette index stays in a ref and retargets the shared clock directly, so timer ticks do not reconcile the whole React application. Shared color painting is capped at 30Hz while retaining the exact final color. The shared visibility preferences stop background cycling when hidden, reduced, loading, or covered by the compact navigation. Contact uses eight smaller, soft color fields on desktop and four on compact screens, with 16 desktop / 8 compact particles, all gated by the same activity hook. Back to Top uses subpixel vertical translation and a short approach curve to clear the visible footer, preserving at least 12px desktop / 10px compact clearance.

Crosshair coalesces pointer, scroll and observer work into one demand frame, reuses the measured target rectangle, and ignores decorative transform/opacity writes that would otherwise keep waking a stationary cursor. Interactive targets, layout and semantic visibility changes still refresh the lock. About's adaptive cursor ink subscribes directly and reads the CSS color when drawing instead of updating React state on every color frame. Both the Crosshair and ID backing surfaces use the shared 1.6-million-pixel cap.

Decorative canvas work uses a stable 30Hz budget; pointer/physics rendering is capped at 60Hz. About no longer mounts the moving grid or MagicBento effects. The optional development URL `?motion-check=1` exposes six- and twelve-second measurement controls with bounded render counters and long-frame attribution; the production build excludes them. These samples measure animation scheduling, not actual display FPS. Earlier local before/after samples are saved in [`docs/motion-audit.json`](docs/motion-audit.json).

Local image paths pass through `src/utils/assets.js`. The helper resolves the checked-in manifest to optimized derivatives, preserving base paths and version query strings. Original source artwork is left intact.

To regenerate image derivatives:

```bash
node scripts/optimize-assets.mjs
```

The optimizer requires a locally available `sharp` module. If it is installed elsewhere, use `--sharp-path` with that module directory, or set `SHARP_MODULE_PATH`. The website and normal production build do not require Sharp. Keep machine-specific module paths out of repository files.

Screenshots under `public/images/projects/` are collected automatically. Add new large hero/background artwork to the optimizer's source list when appropriate. Commit the generated files together:

- `public/images/optimized/`
- `src/data/asset-manifest.json`
- `docs/asset-optimization.json`

## Inquiry form

Contact accepts job opportunities, projects, and commissions, with optional budget and timeline. During `npm run dev`, valid submissions are stored in the ignored `.local/inquiries.ndjson` inbox and the receipt clearly states that no email was sent. Public delivery uses the prepared Cloudflare/Resend endpoint and remains unavailable until its recipient and mail credentials are configured. The form keeps a LinkedIn alternative. Follow [`docs/inquiry-delivery.md`](docs/inquiry-delivery.md) to connect delivery; never place mail secrets in frontend variables.

The shared collaboration workspace provides type-specific labels and examples, a character count, and an optional editable brief outline. The outline fills only an empty brief and never submits it. Changing inquiry type preserves existing writing; untouched outline prompts must be edited before sending. A new inquiry resets to Project with blank fields.

## Responsive review checklist

Review both themes at 320, 390, 768, 1024, and 1440 pixels wide, plus phone landscape. Check text wrapping, complete content, touch targets, and horizontal overflow. Exercise the menu and keyboard focus, carousel swipe/controls/pause, identity card, skill branches, project filters, case-study tabs, inquiry validation/delivery states, and screenshot dialogs. Also check reduced motion, hidden-tab suspension, and returning to a previously active scene.

Repository guidance for future edits is recorded in `AGENTS.md`.

---

## Historical release notes

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
