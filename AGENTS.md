# Portfolio development guidance

These instructions apply to the portfolio at this repository root. The nested `salt-light/` and `lifecity-attendance/` folders provide project context and are separate applications with their own instructions.

## Design and responsive parity

- Preserve the accepted portfolio identity: amber, coral, and blue accents, Tilt Warp/Poppins typography, abstract artwork, the sliding hero, animated text, staggered menu, technical profile, interactive identity card, skill branches, and project-specific case studies. Improve the requested area without replacing the overall design.
- Every future UI or content change must work on desktop, tablet, and phone, in both dark and light themes. Dark is the default; preserve the visitor's saved theme choice. This is a standing user requirement.
- Keep the navigation's software-directory treatment instead of adding decorative circuits. Mouse/touch clicks must not leave a focus ring on the theme toggle; retain clear keyboard focus. The filled header uses static sparse dots and diagonal texture, with no additional animation loop.
- Hero backgrounds use optical contours and a light sweep. Keep Hero 1's existing treatment; Heroes 2 and 3 use a blue/cool moving field that contrasts with the warm adaptive accent. Preserve the 6.4-second contour drift and 5.2-second sweep with negative delays so motion begins midcycle; explicitly gate them with `useSwiperSlide` and the shared activity hook. Keep the carousel dwell at 5,500ms. Do not reintroduce foreground geometric ornaments or repeated decorative slogans.
- Keep the ID backdrop's geometry static: recessed color wash, masked halftone, and 14 elliptical contours. Background refinements must preserve the shared r9 front/back artwork. Do not add decorative GB initials to the identity card or its backdrop.
- Hero 2's rotating copy must remain on exactly two visual lines at every viewport. Preserve whole-row fitting and stable row heights, while allowing the words and suffixes to glide horizontally with changing word lengths. Do not replace that motion with fixed-width visible word slots or allow wrapping.
- Hero 2's small window header reads `design + code`; the main rotating rows retain `design &` and `development>`. Keep these separate when editing copy.
- Use the same React component tree and shared data for every viewport. Edit content once in its existing source, including `src/data.js` and its showcase data modules. Use responsive composition and input-appropriate interactions instead of maintaining a separate mobile copy.
- Keep the whole portfolio accessible on compact screens. Do not restore device detection that blocks phones or tablets behind a desktop-only notice.
- Keep the adaptive About/Contact banners covering the previous desktop scene and sticking at the existing 88px cap. Their visual treatment can evolve without changing the stage heights, overlap holds, stacking, or normal-flow compact layout.
- Preserve the original morph/color page loader on entry and route transitions. Use its shared readiness controller, one overlay, bounded waits, and reduced-motion handling rather than removing the loading feedback during performance work.
- The loader is a single first-paint HTML overlay with critical public CSS. Keep the staged App import and isolated full intro cycle. Four small directly painted SVG paths share the current geometry and color clock with zero phase delay: one filled core and three outlined echoes. Only echo expansion/fading and stroke weight are delayed. Preserve this original synchronized behavior; never freeze echoes as emitted phase shapes or move geometry into a non-painted definition/use-only proxy. The HTML echo wrappers retain transform/opacity animation. Do not mount the page surface or initialize Three during the isolated intro. Include the deferred App chunk and critical loader CSS in startup bundle accounting.
- Preserve feature and content parity. A lighter interaction can replace an expensive implementation on touch devices; the identity card, for example, uses the same front/back artwork with tap-to-flip on touch and drag/flip physics on desktop.
- Keep `src/styles/surface-refinement.css` for the accepted surface treatment. Responsive changes belong in `src/styles/responsive.css` or the component's scoped responsive stylesheet. Avoid broad rules that reset animation-owned transforms.
- Keep all eager App component styles in `src/styles/startup-components.js`, imported before the base/global refinements in `main.jsx`. Its direct CSS imports match the App's static dependency order. This preserves the cascade when App JavaScript is deferred; lazy case-study and Lanyard styles stay lazy.
- About copy and project evidence live in `src/data/aboutProfile.js`; keep claims grounded in the actual nested project sources. LifeCity is online-only, so do not claim offline attendance synchronization.
- The inquiry form saves to an ignored local inbox during development. Public email delivery requires the configured Worker and server-side mail settings; never report an unsent message as delivered or put mail secrets in frontend variables. See `docs/inquiry-delivery.md`.

## Performance guardrails

- Autonomous animation must stop when its content is offscreen, inside an inactive slide, covered by another scene, or in a hidden document. Respect `prefers-reduced-motion`.
- Reuse `src/hooks/useAnimationActivity.js` and its shared preference/context handling rather than adding independent perpetual loops or redundant document/media listeners.
- Keep Contact's soft color fields capped at eight desktop / four compact, with the existing 16 desktop / eight compact particles. Gate both layers with shared scene activity and reduced-motion handling.
- Use demand rendering, bounded work per frame, and cleanup for observers, animation frames, timers, listeners, and GPU resources. Measure the relevant behavior before claiming a performance gain.
- Retain stable paint budgets: 30Hz decorative canvas work, up to 60Hz pointer/physics interaction, and the Lanyard pixel budget. The optional `?motion-check=1` diagnostic is development-only; it must stay out of production bundles.
- Keep the independent 5.5-second palette cycle running when the hero is covered or a secondary page is open. Suspend it under the loader, compact modal menu, hidden documents, and reduced motion. Both desktop and touch straps must follow the shared adaptive accent. Bake strap branding/weave once; adaptive tint must not regenerate or upload a canvas texture per frame.
- Keep Three.js lazily loaded for the visible desktop identity interaction. Do not eagerly preload it or load it for the compact/touch/reduced-motion card.
- About reuses NetSuite's scoped Crosshair effect, loaded lazily only while About is active for a desktop hover/fine pointer. Preserve target locking, coordinates, click pulses, pointer-transparent rendering, and shared coverage/visibility/reduced-motion suspension. Do not add another global cursor dot or load it for touch/reduced motion.
- Keep motion that communicates navigation and interaction; reduce unnecessary background work instead of removing the site's character.
- Route local image references through `src/utils/assets.js`. Preserve hosting base paths, query strings, and external URLs. Use the generated optimized asset manifest and responsive background derivatives where appropriate.
- Preserve source artwork. Regenerate optimized derivatives with `scripts/optimize-assets.mjs`, then include `public/images/optimized/`, `src/data/asset-manifest.json`, and `docs/asset-optimization.json` together. The script needs a locally available `sharp` package or `--sharp-path`; do not put a machine-specific module path into repository code.

## Validation

- Run the relevant automated checks and `npm run build` for code changes.
- Review affected screens at widths **320, 390, 768, 1024, and 1440 pixels**, plus phone landscape. Verify readable text, complete content, no horizontal page overflow, and usable touch targets.
- Exercise navigation and Escape/focus restoration, carousel swipe/previous/next/pause, desktop ID drag/flip, touch ID flip, skill branches, project filters, case-study tabs, and screenshot dialogs when those areas are affected.
- Check reduced-motion behavior and hidden/offscreen animation suspension. Confirm resuming a tab or returning to a slide preserves the user's manual pause choice.
- Use keyboard as well as pointer/touch controls. Check links, dialog focus and dismissal, and orientation changes.
- Report what was actually verified and any remaining limitations. Keep the work within the user's requested scope and existing authorization.
