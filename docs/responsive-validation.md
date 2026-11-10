# Responsive and performance validation — 0.4.0

Validated locally on 2026-11-04 and 2026-11-05 against the Vite development server and the production preview.

## Automated checks

- `npm test`: 23 tests passed, covering scene suspension, manual pause holds, reduced motion, loader readiness/cancellation, stable render/pixel budgets, inquiry validation/delivery/persistence, asset URL resolution, and image budgets.
- `npm run build`: passed. Heavy case-study routes, GSAP marquee code, the text canvas engine, and Three.js are separate lazy chunks.
- `node scripts/audit-build.mjs`: passed the initial JavaScript/CSS budgets; exact output is saved in `performance-audit.json`.
- `git diff --check`: passed.

The current initial gzip JavaScript decreased from 298,140 to 202,041 bytes, and CSS from 93,400 to 52,792 bytes. These are production entry-asset measurements, separate from the runtime samples below. The 56 optimized default image derivatives total 2,368,690 bytes versus 24,124,125 bytes for their source artwork; separate small phone background variants are also generated. Source images are preserved.

## Browser checks

| Viewport | Reviewed |
| --- | --- |
| 320 × 700 | Hero, navigation, ID flip, bento/skill branches, Contact, all three case studies, filters, tabs, technology details, screenshot dialog and focus return |
| 390 × 844 | All hero slides, previous/next/pause, drag-to-swipe, menu/anchors, touch ID, NetSuite tabs and keyboard arrows, shared phone composition |
| 768 × 1024 | Hero and tablet About composition, touch ID, two-column bento fit, normal page scrolling |
| 1024 × 768 | Desktop hero, Three.js card readiness, bento content fit |
| 1440 × 900 | Original desktop composition, ID drag and flip, menu, Contact overlap, covered/uncovered activity |
| 844 × 390 | Landscape hero scrolling, compact menu and keyboard containment, screenshot viewer controls and readable captions |

Reviewed page widths matched the document viewport without horizontal page overflow. Core bento contents fit their containers. Phone/tablet About mounted no canvas. The final production build showed `data-covered=true` at the desktop About anchor (top 88px) and the phone anchor (hero bottom 84px), with activity restored on returning to the top. Contact covering About sets the desktop Lanyard inactive.

Keyboard checks included menu Shift+Tab/Tab wrapping and Escape, NetSuite tab arrows, technology details, native screenshot dialogs, and focus return. The mobile carousel preserved manual pause through slide changes and menu navigation.

## Hero and navigation refinement — 2026-11-05

The workbench now uses a static backdrop instead of a measured spring surface. Both workbench and workflow frames have stable responsive widths and matching corner radii. Decorative asymmetric halos were replaced with a soft grid; the original background artwork, sliding carousel, rotating words, and decryption remain.

Primary hero links use one shared `HeroAction` component with palette fills, rolling labels, exchanging arrows, and keyboard focus treatment. About Me moved outside its frame. The third hero uses a simple two-line NetSuite caption. Desktop carousel controls use the slim unboxed rail with rotated words and 44px targets; compact layouts retain horizontal controls. The menu uses its existing optimized artwork beneath tinted static layers.

Rechecked at 320, 390, 768, 1024, and 1440px widths and 844 × 390 landscape. Reviewed hero cards and primary actions fit without horizontal page overflow. Verified the Projects action with keyboard Enter, About navigation to its 84px compact anchor, covered hero suspension, the resume URL, compact menu focus wrapping/body lock, and Escape restoration. All 10 tests, the production build, whitespace checks, and bundle budgets passed. No dependencies or autonomous animation loops were added.

The production review caught a CSS custom-property URL resolving against the built stylesheet's `/assets/` directory. Menu artwork now uses an absolute page-based URL through `absoluteAsset`; regression coverage includes root and nested deployment paths. Rechecked the actual production pseudo-element URL and visible menu artwork after rebuilding.

## Fixed hero lines and a new systems headline — 2026-11-05

Hero 2 now reserves each rotating word's maximum styled width and fits both full rows to the available space. Row/sibling layout springs and wrapping were removed; rolling letters remain. Fitting runs only when the container width or font changes. Reduced motion shows a single visible word on each row, with the full skill alternatives available to assistive technology.

Measured all three rotation states at 320, 390, 768, 1024, and 1440px widths and 844 × 390 landscape. Both rows' bounds and both suffix positions stayed identical within each viewport across every state. All 18 samples had matching page/scroll widths and no overflowing text container. The smallest-phone fitted type was 22.08px, preserving two readable full lines.

Hero 3 now reads “Make systems make sense.” with editor line numbers and a finite underline/trace reveal. Its supporting line is “NetSuite support, clearer workflows, and software built around real tasks.” The former braces and scrambling effect were removed. Primary links now use light outlined controls with rolling labels and exchanging arrows. The 320px copy fits between the header and carousel controls, with a 52px action target. Its heading is exposed as one readable sentence in the accessibility tree. Effects use the shared activity/reduced-motion handling; no new animation loop or dependency was added.

All 10 tests, the production build, whitespace checks, and bundle budgets passed for this revision.

## Natural-width motion and panel docking — 2026-11-05

At the user's request, the fixed visible word slots were replaced with natural widths and shared Motion layout springs. Whole-row fitting and reserved heights still enforce exactly two visual lines. A per-row transition bound leaves room for a long word arriving at the previous short row's centered position. Fitting remains limited to width/font changes; the existing active-slide word clock is reused.

After a clean reload, measured all three word states at 320, 390, 768, 1024, and 1440px widths and 844 × 390 landscape. Row heights and Y coordinates remain stable, while X coordinates change with word length. All 18 final samples had matching body/scroll widths and page/scroll widths. Primary actions align with the panel's leading edge. The first suffix and window label read “design + code”; Creative coding was removed from the hero Toolkit.

The outlined action styling remains, now using the shared mono font and a consistent 20px gap beneath its panel. Hero 3's original subtext moved into the former Understand / Build / Explain row and uses mono type. Its approved main headline and editor reveal remain. All 10 tests, the production build, whitespace checks, and bundle budgets passed.

## Main copy correction, word reveals, and internal action footers — 2026-11-05

Corrected the previous interpretation: only Hero 2's small window header reads “design + code.” Its main rotating rows retain “design &” and “development>,” with the existing natural-width springs and two-line fitting. The hero Toolkit remains React and UI / UX.

Hero 3's approved copy is unchanged. Its four headline words now roll through individual masks with staggered starts, the technical subtext reveals by word, and the underline traces afterward. All motion settles within 1.55 seconds. The shared activity hook and reduced-motion CSS make inactive, hidden, covered, and reduced-motion text static and readable; there are no new animation clocks or dependencies. The heading retains one readable accessible name.

All three primary actions now belong to their panel footers. Desktop actions align right, with Hero 2's Toolkit on the left; compact actions span the footer width. The accepted outlined styling, mono type, rollover labels, and exchanging arrows remain. Footer padding protects keyboard focus outlines.

Rechecked every hero at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All actions fit inside their panels, retain 52px compact / 54px desktop targets, and remain clear of the navigation and carousel controls. Landscape uses the existing vertically scrollable hero. All 18 final Hero 2 word-state samples had matching page and content scroll widths; row heights and Y positions stayed stable while horizontal positions changed with word length.

On the production preview, verified the corrected copy, PDF target, keyboard focus outlines, About navigation to its 88px desktop anchor, covered hero suspension, and keyboard Projects navigation on compact screens. The compact menu removes Hero 3 animations while open; Escape restores toggle focus and activity while preserving manual carousel pause. All 10 tests, the production build, bundle audit, and whitespace checks passed. Screenshot and geometry artifacts were saved locally.

## Footer details, scroll cue, and technical section strips — 2026-11-05

Hero 1's action footer now includes a document outline and résumé summary. Hero 3 has a case-study count derived from the shared project data, with a web/mobile descriptor. These fill the former empty left space without changing the accepted buttons or Hero 2 Toolkit. The same details reflow above full-width actions on compact screens.

The mouse indicator is now a thin schematic with blue/coral registration marks, an adaptive-color wheel and direction arrow, and a mono scroll label. Its one transform/opacity animation follows the shared activity hook, pauses when hidden/covered, and becomes static with reduced motion. It retains its accessible name, About destination, and 44px hit width; compact screens keep their existing swipe/navigation composition.

The section ribbons now use a dark technical strip with mono words, code-slash separators, static calibration ticks, and adaptive accent keylines. The organic wave artwork and its extra background animation were removed. The measured GSAP word loop, hover pause, shared activity handling, and color clock are unchanged. No stage/cap/hold geometry changed.

Reviewed both affected hero footers at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All measured page widths match their viewport, metadata and actions fit their panels, and compact actions clear the carousel controls. Banner heights remain 64px on tall desktop, 56px on short desktop, and 52px About / 64px Contact on phones.

Observed About rise over the hero, stop at 88px, and remain at 88px during additional scrolling at 1440px and 1024px widths. Contact then covers About and reaches the same cap. At full coverage, the About loop's transform stays unchanged across observations and its scene is marked covered. The mouse wheel pauses under the covering scene; manual carousel pause remains preserved. Verified hover pause, keyboard focus/Enter on the scroll cue, its 88px About destination, amber/blue adaptive rails and wheel colors, and compact normal-flow navigation. The production preview includes the new details and reaches the same banner cap.

All 10 tests, the production build, bundle audit, and whitespace check passed. No dependencies were added. Saved screenshots and geometry observations accompany the local validation.

## Connected word carousels and restored page loader — 2026-11-05

The accepted hero panels and their footer details remain. About/Contact now use whole-phrase labels, alternating adaptive-color filled modules and dark outlined modules connected by circuit nodes. Poppins replaces the mono slash ticker. The shared measured loop includes the connector in its probe, keeps an even repetition count for consistent alternation at the seam, and retains hover/visibility/reduced-motion handling. No banner or stage height changed.

Reviewed 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. Page widths match their viewport; all label modules fit vertically inside the unchanged banner heights. Both repeated groups have matching widths, with seams within 0.001px of zero. Whole ABOUT ME / CONTACT ME phrases remain together. Desktop About stays at 88px during additional scrolling and Contact covers it at the same cap; compact layouts stay in normal flow. Rechecked the production build and saved screenshots.

The original morph/color loader now appears on entry for a brief 1.05s cycle and waits for document/font readiness, with bounded fallbacks. Route transitions use one overlay and wait for lazy content to commit, with a 300ms minimum. Stale route completions cannot dismiss newer transitions. Reduced motion removes cosmetic waiting; hidden/inactive loader animation pauses. The underlay becomes inert and its shared autonomous effects suspend while loading. Destination focus is restored after dismissal, including late commits after the safety deadline.

Captured the visible loader on desktop and 320px refresh, with one overlay, active animation, and an inert underlay. Verified dismissal removes the inert state. On compact screens, Projects and NetSuite receive focus after loading; browser Back restores About focus, and an immediate return from Projects leaves no stuck overlay. A direct production #projects load showed the loader and then focused the committed Projects section. All 15 tests, the production build, bundle audit, and whitespace checks passed. No dependencies were added.

## Technical profile, inquiries, themes, and runtime performance — 2026-11-05

About now uses a simpler profile window, capability branches, and keyboard project-evidence tabs. Copy is sourced from the nested projects: Salt & Light progression/streak/passive logic and PWA/Capacitor wrappers; LifeCity QR duplicates, guarded Undo, scoped roles, and audit history. LifeCity's online-only requirement is respected. The moving grid and MagicBento subtree were removed from About. The original ID remains, with desktop drag/flip and compact tap-to-flip; the large entry swing is disabled.

The word ribbons now use large alternating filled/outlined type, with no chip containers. Back to Top uses a compact technical control and a scroll-progress edge. Keyboard focus waits for the hero to become visible at the top. A browser test exposed Swiper receiving About tab arrows while covered; covered/suspended heroes now disable their keyboard handler.

The Type-Delta-inspired sun/moon control defaults to dark, persists explicit choices, and works with keyboard Space. Light mode uses separate neutral surfaces, stronger accent inks, lighter artwork treatments, and adjusted page/control contrast. It is applied before React mounts. Reviewed both themes at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All 12 samples had matching page/viewport widths and no profile overflow; desktop profile bottoms clear their stage by at least 65px. Compact About mounts no canvas. Banner heights and the 88px desktop cap remain. Checked light Projects/NetSuite shells and case-study/toolkit contrast.

The inquiry form supports job/project/commission types, name/email/details, optional budget/timeline, accessible errors, cancellation, timeout, and retry IDs. Browser validation focuses the first invalid field. A synthetic local inquiry was persisted and its truthful local-only receipt verified; the synthetic record was then removed without touching other records. Phone inputs use 16px type. At 1024 × 768, expanded optional fields and errors remain reachable within the Contact body's scroll area. Public email remains unconfigured because no owner recipient or provider secret was available; the production form explains this and offers LinkedIn. Delivery setup and tested safeguards are documented in `inquiry-delivery.md`.

Runtime work now caps decorative canvas paints at 30Hz and interaction rendering at 60Hz, bounds Lanyard pixels, reduces spline sampling, avoids redundant geometry/UV/style writes, and suspends LogoLoop beneath parent overlays. Full-screen pointer textures are static and navigation no longer re-blurs moving content. The original sliding and text effects, loader, identity interactions, and adaptive palette remain.

Six-second local RAF samples at 1440 × 900, dark mode:

| Scene | Average FPS before → after | Frames over 34ms before → after |
| --- | --- | --- |
| Animated name / Hero 1 | 43.04 → 60 | 7 → 0 |
| Rotating skills / Hero 2 | 57.83 → 59 | 3 → 1 |
| About, after ID readiness | 58 → 60 | 2 → 0 |

The main-hero comparison used the same warmed sequence: visit About until WebGL is ready, return to Hero 1, and manually pause the carousel. Both samples had matching canvas dimensions. The hero's 95th-percentile frame interval changed from 33.3ms to 16.8ms. Raw samples and method are in `motion-audit.json`. These are short IAB measurements on this computer, not a cross-device benchmark or a sustained scrolling stress test. The development probe is absent from production code/chunks.

Verified mobile menu focus wrapping (including header controls), Escape restoration, theme persistence after reload, About keyboard tabs/branches, touch ID flip, desktop drag/flip, loader dismissal, and keyboard Back to Top returning scroll/focus to Home. All 23 tests, the final build, bundle budgets, and whitespace checks passed. No dependency was added, no live deployment occurred, and no external email was sent.

## Header, identity hardware, and inquiry refinements — 2026-11-05

Centered the sun/moon artwork inside its 44px control and separated it from the section marker. The expanded menu adds static circuit traces, numbered section nodes, real section paths, and an Escape hint. The compact menu's decoration is contained so it cannot create a horizontal scrollbar; all social links remain reachable by vertical scrolling at 320 × 700. Escape returns focus to the menu toggle.

Light mode now uses calmer gray-green surfaces and subdued artwork brightness. The footer verse uses the correct scoped contrast override. The accepted filled/outlined word carousel keeps its dimensions and measured loop, with subtle static microchip paths behind the text. No animation clock or dependency was added for the new decoration.

The new editable r7 ID artwork preserves the original portrait and logo, with dark slate technical detailing on both faces. Its static surrounding frame fills the empty area and remains pointer-transparent. Verified both new images decode on compact screens, tap-to-flip switches faces, and desktop Three.js renders both faces and continues to drag. Original r5/r6 artwork is unchanged. Back to Top now uses a slim vertical desktop rail and an arrow-only compact control; keyboard activation returned scroll to zero and focus to Home.

Connect now groups job, project, and commission choices with icons, type-specific brief prompts, numbered details, and a clearer send control. A synthetic local Commission submission produced the truthful local-only receipt. “Write another inquiry” restored Project, blank fields, the Project prompt, and collapsed optional fields. Only that synthetic inbox record was removed afterward. At 1024 × 768, expanded optional inputs and validation errors stayed accessible through the Contact body's small vertical scroll area; validation focused the name field.

Reviewed shared layouts in both themes at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. Page content fits the available viewport width, and profile/form content has no horizontal overflow. Compact About mounts no canvas. The About and Contact desktop caps remain 88px, and ribbon heights are unchanged. Final validation passed all 23 tests, the 593-module production build, bundle budgets, and whitespace checks. Current initial gzip sizes are 203,758 bytes JavaScript and 54,913 bytes CSS; `performance-audit.json` was refreshed. Production contains no development motion probe, and the new SVG assets match their source files.

## Hero compositions, identity pass, and collaboration workspace — 2026-11-05

The theme toggle now distinguishes pointer and keyboard input, including a pointer click on an already keyboard-focused checkbox. Browser checks confirmed no retained outline after that click and a clear outline after Tab/Space. Navigation replaces the decorative circuit drawing with a software directory: route paths, line-number gutter, a keyboard hint toolbar, and thin selection strips. Its existing artwork, staggered motion, Escape focus restoration, and scrollable compact menu remain.

Each hero now has a distinct static vector study outside its window: layered source planes, a Bézier composition, or modular blocks. Small captions and palette details connect the surrounding space to the terminal. Swiper supplies existing parallax; coarse input and reduced motion retain its existing disabled-parallax behavior. No animation clock, filter, canvas, or pointer listener was added. Phone landscape hides the decorative top caption to keep the content clear and moves the palette detail away from controls. Existing hero copy, two-line fitting, buttons, manual pause, and slide controls remain.

The r8 identity pass preserves the original portrait/logo, with a coral spine, pale portrait field, and stronger name hierarchy. Its header clears the physical lanyard slot on both faces. Open layered planes replace the enclosing circuit frame; a static field of angled color planes and registration marks now extends across About. Verified desktop front/back rendering and drag, compact image decode and tap-to-flip, and the 88px desktop cap. The original and r7 source artwork remain available.

Contact now uses one joined collaboration workspace. Type-aware labels, concise real-world examples, optional compensation/budget/date prompts, and a character count guide the brief. Browser checks confirmed that the outline helper fills only an empty textarea, focuses it, never submits, preserves writing across type changes, and rejects untouched prompts. A synthetic Commission inquiry produced the local-only receipt. Reset restored Project, blank fields, zero count, enabled outline action, and collapsed optional inputs. Only the synthetic record was removed afterward.

Reviewed both themes at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All 12 final samples have matching page/available viewport widths and no profile/workspace/form horizontal overflow. Compact About mounts no canvas. Ribbon heights remain unchanged. The 320px empty textarea now has matching 126px client/scroll heights, without a placeholder scrollbar. At 1024 × 768 the default Contact body fits at 566px; expanded optional fields plus errors use 580px of content in its 566px scroll area, with no horizontal overflow and focus on the first invalid field. Both desktop section caps remain 88px.

All 23 tests, the final 595-module production build, bundle budgets, and whitespace checks pass. Final initial gzip sizes are 205,438 bytes JavaScript and 56,298 bytes CSS. The native 1280 × 720 preview also clears the decorative hero caption above its panel. The refreshed audit excludes development motion diagnostics, and both r8 SVG assets match their production copies. No dependency, external email, or live deployment was added.

## Background atmosphere, woven lanyard, and first-paint loading — 2026-11-05

Removed the floating hero studies, side labels, palette captions, and added slogans. `HeroBackdrop` instead adds optical contour textures and one slow light pass beneath each existing terminal. It uses the shared activity hook, pauses under coverage/inactive slides, and becomes static with reduced motion. The accepted sliding composition, text, buttons, two-line skill layout, and slim controls remain.

Contact removes the code-bracket header, Project glyph, and circuit illustration. An envelope/application icon replaces them. Two bounded moving color fields and 16 small desktop particles now illuminate the existing background; compact/coarse layouts retain 8 particles. Motion changes only transforms/opacity, uses no per-frame React or JS loop, and pauses under the compact menu. Observed particle transforms change while active and computed play state switch to paused under the phone menu. The compose surface remains readable and all outline/validation/delivery behavior is unchanged.

The r9 ID removes decorative initials and angled portrait cuts. The original portrait sits on a plain warm matte rectangle, with real discipline text in the vertical spine. The actual Three.js strap now includes baked woven branding, repeat marks, and double seams; touch uses matching branding/seams. Adaptive changes tint the existing texture rather than rebuilding/uploading it. Verified desktop rendering, flip and drag, phone front/back image loading and flip, and no compact WebGL canvas. Original artwork remains untouched.

Restored an independent 5.5-second palette timer once the hero is covered or a secondary page is open. It uses the existing shared color interpolation, settles in-flight changes beneath a loader/modal, and stops for hidden documents/reduced motion. Returning to the hero resumes its slide palette without changing manual pause. About and Contact continued changing color while the hero stayed covered; phone strap background matched the root adaptive accent.

Back to Top now measures the visible footer edge in its existing scheduled scroll update. Its bottom clearance is the greater of the normal safe-area inset and the footer overlap plus a gap. Measured 12px desktop / approximately 10px phone clearance. The compact footer also clears the old row-oriented flex basis, removing excess blank space without changing its content. Keyboard return and lazy Projects navigation restored focus to Home/Projects after loading.

The refresh loader is now one HTML overlay styled by critical public CSS. App JavaScript waits for two painted frames before import. Its controller then reserves a full 1.05-second isolated intro before mounting the page surface, preloads primary fonts/first hero image, and retains readiness/failsafe/route cancellation. One SVG shape supplies the original morph to the core and three separately animated HTML echo layers. Initial Three import waits for active About visibility. Browser observations confirmed one overlay, one morph, three echoes, no scene/canvas during the isolated intro, visible desktop/phone refresh animation, and eventual dismissal/focus. Optional startup diagnostics stay development-only.

Deferring App exposed an old-style cascade issue during QA. The final startup stylesheet barrel loads all 21 eager component styles before the existing global refinements. Fresh development and production checks confirm 1px terminal borders, hidden obsolete print details, and the transparent 44px control rail. Lazy route/WebGL styles remain excluded from startup.

Reviewed 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390 in both themes. All 12 samples fit the available page width, with no profile/form horizontal overflow. Compact samples mount zero About canvases and show 8 particles; desktop shows 16. Both themes retain one loader and no former hero ornaments/initials. Desktop section caps remain 88px. The production phone refresh and footer clearance were also checked.

All 28 tests, the final 597-module production build, startup budgets, asset integrity, and whitespace checks pass. Head JavaScript is 72,660 bytes gzip; staged App JavaScript adds 132,541 bytes. The complete startup total is 205,201 bytes JavaScript and 58,094 bytes CSS, including the 1,715-byte gzip critical loader stylesheet. Deferral changes scheduling rather than removing that payload. Production excludes both motion and loader diagnostics; r9 SVG hashes match source. No dependency, public deployment, or external email was added.

Loader diagnostics also observed main-thread long tasks during development scene commit; no universal or before/after loader FPS claim is made. The validated improvements are first-paint visibility, an isolated full morph cycle, reduced morph tracks, compositor-friendly echo layers, deferred heavy initialization, and preserved readiness behavior.

## Continuous hero motion, painted loader morph, and softer backgrounds — 2026-11-06

Hero contours now drift with a 6.4-second alternate animation, and the broad light sweep uses a 5.2-second alternate animation. Both start partway through their motion rather than waiting offscreen through the 5.5-second slide dwell. Explicit Swiper active-slide gating supplements the shared visibility/activity hook. Browser observations showed motion on Heroes 2 and 3, exactly one active background at the settled hero, and all hero backgrounds paused under About. The carousel's dwell, text, controls, and manual-pause behavior remain unchanged.

The empty tilted ID planes were replaced with a static recessed color wash, masked halftone, and 14 elliptical contours. The r9 card artwork, woven strap, and interaction code are unchanged. Verified the production desktop card drags and flips over this pointer-transparent backdrop, and the compact card flips both ways with the same artwork. Compact About mounts no canvas. The filled header now uses sparse dots, fine diagonal lines, and a faint color wash; it adds no animation or blur.

The loader defect was a morph applied only to an unpainted SVG definition whose visible use instances did not reliably repaint its changing geometry. The main shape is now a directly painted path, with the existing three HTML echo layers. Controlled browser captures at 0, 350, and 700ms visibly showed the amber square/circular hole, coral octagon/diamond hole, and blue circle/square hole. All three had opacity 1 and distinct computed paths. Two regression checks protect the painted path and compatible, distinct pose geometry. The development preview excludes opacity transitions from animation freezing and is absent from production. Production entry still showed one loader before content, then dismissed successfully.

Contact now has eight smaller, softer color fields on desktop and four on compact/coarse layouts, replacing the two large glows. Desktop field diameters are 135–220px before their small transform scale; compact fields are smaller again. The existing 16 desktop / 8 compact particles remain. Only transforms and opacity animate, using the existing shared activity gate. Browser checks confirmed active fields run and all four compact fields pause beneath the open menu. Inquiry behavior and public-delivery configuration are unchanged.

Reviewed both themes at 320 × 780, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All 12 samples had no horizontal page or measured profile/form overflow; the expected 8/4 light-field counts and 14 identity contours were present. Production checks confirmed the textured header, new identity backdrop, 88px desktop Contact cap, compact dark/light composition, no compact About canvas, preserved terminal borders and transparent 44px control rail, and no development diagnostics. Screenshots and geometry/loader-pose JSON are saved in the local review artifacts.

All 30 tests, the 597-module production build, full whitespace check, asset integrity check, and startup budgets pass. The refreshed audit reports 205,344 bytes total startup gzip JavaScript (72,658 head plus 132,686 staged App), and 58,408 bytes CSS including the 1,721-byte critical loader stylesheet. Both r9 source/dist hashes match. No dependency, external email, or public deployment was added. These checks verify rendering, responsive fit, and bounded animation behavior; no new FPS improvement is claimed from this visual revision.

## Phase-correct echoes, contrasting motion, and keyboard/scroll polish — 2026-11-06

Loader echoes now paint separate, static square/octagon/circle outline paths in amber/coral/blue at 0/.35/.7 seconds. They retain the shape emitted while the core continues morphing. Base opacity zero and backwards fill hide delayed waves before their launch. Controlled 245/595/945ms browser captures showed only the appropriate expanded wave, with the two other layers at opacity zero. Only the directly painted core interpolates geometry; the three existing HTML echo layers animate transform/opacity. The startup readiness and isolated intro are unchanged.

Heroes 2 and 3 now use stronger cool-blue moving highlights over their warm yellow/coral artwork, with stronger contrasting contours and theme-specific light-mode strengths. Hero 1 retains its accepted treatment. Timings, negative start delays, slide dwell, active-slide gating, text, and two-line fitting remain unchanged. Both themes were reviewed at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390. All 12 samples had no horizontal page overflow and exactly one active hero backdrop. Background work still stops beneath the compact menu/covered sections and with shared reduced-motion/visibility preferences.

The open navigation now uses the same keyboard focus cycle on desktop and compact screens. Tab and Shift+Tab include routes, discoverable coming-soon socials, heart, theme, and close; Enter remains native. Browser checks confirmed Home → About → Contact → Projects → NetSuite, header controls, close → Home wrap, reverse Home → close wrap, Enter navigating to About, and Escape restoring toggle focus. A 2px inset route outline makes movement explicit in both themes. At 320px, focus scrolled the menu panel to reveal lower controls without changing page scroll.

Back to Top now keeps a stable resting bottom inset and uses subpixel translation for footer avoidance. A smooth approach curve replaces the abrupt max/rounded-bottom edge, with no perpetual frame loop. Nine desktop up/down samples preserved the 24px resting bottom while lift changed continuously through 0, 1.28, 10.08, 27.20, and 52.66px. Visible-footer clearance stayed above 12px. At 320/390px, the existing responsive 18px resting inset was retained, with at least 10px footer clearance; the control blended back toward its resting position when scrolling upward. Keyboard activation returned scroll to zero and focus to Home.

All 37 tests, the production build, full whitespace check, and combined startup budgets pass. The refreshed `performance-audit.json` includes deferred App JavaScript and critical loader CSS. Production excludes all motion/core-pose/echo diagnostic controls, and r9 source/dist artwork hashes remain identical. No dependencies were added. Saved screenshots and phase/focus/scroll/viewport observations document these checks; no new FPS improvement is claimed.

## About crosshair and original synchronized loader echoes — 2026-11-06

About now lazy-loads the same Crosshair component and settings as NetSuite: target-lock brackets, coordinates, click pulses, smoothing, and the ordinary cursor retained. Profile/capability/evidence panels are targets; nested links and buttons remain independently targetable. The canvas is pointer-transparent, scoped to About, and mounted only for active desktop fine-hover input without reduced motion. Hidden documents and Contact coverage unmount it. Its width fits About's containing block rather than adding the scrollbar width to the page. The coverage boundary accepts 1px of fractional anchor rounding.

Chrome review confirmed target brackets and coordinate lines in dark/light themes, ID dragging through the canvas, a visible desktop cursor at 1024px, no cursor canvas on compact screens, phone ID flip both ways, and no About cursor after Contact covered the scene. Both themes were checked at 320 × 700, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 844 × 390 with no horizontal page/profile overflow. The dark viewport sweep also verified hidden-tab suspension; active desktop rendering was checked separately. The in-app browser did not attach on this pass, so browser review used Chrome. These are desktop viewport checks, not physical-device tests.

Comparison with the original committed loader revealed the remaining echo defect: all original paths morph and change color together, with only expansion/fading staggered. The previous static emitted-shape treatment did not preserve that behavior. All four paths now paint directly and share the same zero-delay geometry/color clock. Echo expansion and outline weight alone use 0/.35/.7-second offsets. The current 1.05-second cycle, isolated first-paint intro, staged App import, readiness/failsafe behavior, HTML transform layers, and suspension/reduced-motion handling remain.

The development-only refresh diagnostic sampled 33 echo/frame comparisons with zero geometry mismatches and zero color mismatches. At 245, 595, and 945ms, all three computed echo paths equaled the core path and every stroke color equaled the core fill; only the expected expanded wave was visible. Saved painted captures show the matching outer silhouettes. This intentionally uses four small geometry tracks to reproduce the original motion reliably, instead of the incorrect single-core/static-echo approximation. The sampled frame timings are not presented as a performance benchmark.

All 37 tests and the final 598-module production build pass. Total startup gzip is 206,343 bytes JavaScript and 58,798 bytes CSS, including the 1,794-byte critical loader CSS, within budget. Crosshair remains a separate lazy chunk outside startup. Production contains no motion/echo diagnostic controls or mismatch counters; r9 artwork and critical CSS match their source hashes. Current documentation/guardrails reflect synchronized echoes. No dependency, external email, or deployment was added.

## Scope and limits

This was desktop-browser viewport testing, not testing on physical iOS/Android hardware. Runtime frame figures are the short local IAB samples described above; no Lighthouse score or cross-device FPS guarantee is claimed. Reduced-motion and hidden-document state transitions have automated coverage plus source review. Vite still reports a large-chunk advisory for the lazy Three.js interaction. That chunk is excluded from startup and compact/touch/reduced-motion interaction.

Future content and UI edits must use the shared React tree/data and pass responsive checks as recorded in the root `AGENTS.md` and README.
