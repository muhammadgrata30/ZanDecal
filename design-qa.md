# Design verification — Zan Decal Atelier

## Image-based material explorer — 2026-11-04

Replaced the homepage material WebGL scene with an original responsive SVG decal illustration, as requested. No Three/R3F/MaterialScene imports remain in HomeMaterialSection. Existing 3D mockup routes and hero/studio are retained. The decal's base fill follows the published color selection, and a keyed 1.65-second right-to-left entrance runs on color or finish changes. Gloss has a sharper highlight, Satin a softer highlight, and Matte subdued lighting/fine vector grain. These are illustrative finishes, not photographs of physical catalog samples.

A shared animated outline/clip path creates slow eight-second flag-like edge motion; a moving light gradient reinforces the wave without WebGL, bitmap filters, or a JavaScript frame loop. Pause/resume controls both SVG and CSS animation. Intersection and document visibility pause animation offscreen/in hidden tabs; reduced motion removes entrance and SVG motion. The previous coil-specific scroll gate is removed with the 3D preview, so ordinary native page scrolling remains available. Palette, per-material finish memory, hover-driven specification transitions and admin material details remain intact.

Headline now uses bold upright Geist Sans in four stacked lines on the left, with outlined lower lines and a theme-aware shade over the decal's left edge. Mobile has its own image crop, smaller type, compact controls and a bounded scrollable palette. No new font download or raster asset request was added. TypeScript, focused ESLint and homepage integration checks pass for accessible SVG markup, wind animation, pause control, all three finishes, admin colors, unique anchors and preserved hero/studio/gallery/consultation. Browser discovery still reports unavailable native pipe/browser host; actual visual composition, browser animation and physical mobile FPS remain unverified. No push/deployment.

## Material recoil and directional specification transitions — 2026-11-04

Fixed the production option-5 geometry range: the closed endpoint previously retained a half-open sheet; the homepage now explicitly uses a compact full-roll endpoint and a fully extended open endpoint. Preview defaults remain unchanged. Stationary scroll events no longer restart opening after recoil completes. While the pin gate is playing, the committed direction completes instead of being immediately reversed by trackpad rebound; pause/skip and escape paths remain available. This supersedes the earlier mid-animation gesture reversal behavior described below.

Material hover/focus now animates the outgoing specification to the left and brings the new specification from the right, with a growing accent rule and staggered title/body/specification groups. Rapid selection replaces the outgoing snapshot and cancels its old cleanup timer. The outgoing copy is inert and hidden from assistive technology. Mobile uses shorter travel and a single panel transition, without child stagger. Only transforms/opacity animate; reduced motion removes these effects. Selected row text and arrow respond to selection. Existing theme, selected color, hero and studio are retained.

Validation: TypeScript, focused ESLint, production build, playback tests and homepage HTTP integration tests pass; localhost:3000 responds HTTP 200. Actual production geometry is tested at desktop/mobile/lite tessellation across recoil progress: finite positions, unit normals, full-open width above 7.9 units and closed width below 2.5 units. Browser discovery remains blocked by unavailable native pipe/browser host; rendered motion and physical device FPS are unverified. No GitHub push.

## Approved material mockup 5 integrated into homepage — 2026-11-04

User explicitly confirmed the earlier Bedanya Terasa material-motion option 5 and authorized direct homepage integration. Replaced only the previous homepage material introduction/legacy material disclosure with `HomeMaterialSection`; preserved the existing HeroStudioSequence, CustomStickerSection, PortfolioHandoff/gallery/workflow, consultation and footer. Previous preview routes remain available. Published materials/colors and per-material preview finish memory are retained; changing any choice does not rewind the sheet or reset the selected color.

The production material section has no rollout slider, drag-to-adjust timeline, preview tabs, specification disclosure or wrap/duel experiment controls. It retains the live rolled-sheet geometry and a Play/Pause/replay control. First arrival at the native sticky boundary runs a four-second unroll; normal wheel, vertical touch and keyboard progression are held at that boundary until completion. The sheet then remains open and scroll is released. Returning from below keeps it open through the pinned viewing interval; leaving toward the preceding section triggers a 2.6-second recoil. Reversing direction starts at the current progress. Pausing preserves progress, and replay coils then reopens. Large wheel/page-key crossings and inertial upward crossings are handled. No body overflow lock is used. A visible skip control, Escape/Tab/Home/End, deliberate link navigation, reduced motion and load/error fallback release the gate, preventing a permanently trapped page. Returning after bypass/late loading presents an open sheet rather than forcibly jumping backward.

Material names select their already-visible specifications on mouse pointer entry or keyboard focus. Touch/click remains supported; touch selection brings the specification region into view. The desktop detail region remains alongside the list. Existing material/material-detail/material-specification anchors are unique and preserved. No extra specification button is required.

Performance: the shared lightweight material scene is lazy-mounted near the section and only actively renders when in view. The production controller owns the animation clock, freezes geometry on completion and pauses time in hidden documents. Existing device-aware mobile/lite tessellation, DPR/environment limits, no-mobile-shadow policy and demand rendering are retained. Appearance changes get a finite settling window; cadence-based quality sampling remains enabled for the production playback and can downgrade during the short animation. No vehicle geometry or studio design was changed in this integration.

Validation: final focused ESLint and production build (including TypeScript) pass. HTTP homepage integration tests pass for the unique material anchors, full admin palette, direct specs for every published material, absence of range/disclosure controls, and retained hero/studio/gallery/consultation. Pure playback tests pass at simulated 20/30/60/120 Hz for duration, pause, held-open return, reversal, completion and skip/error release. Existing material geometry/appearance tests pass. These are logic/markup checks, not device FPS measurements. Final browser discovery again reports no apps/browsers, unavailable native pipe (os error 2) and unavailable browser host. Final visual QA result: blocked. Browser-rendered hover, scroll/touch gating, visual composition and physical low-end device performance remain unverified; no visual/mobile smoothness pass is claimed. No account/content mutation, deployment or GitHub push.

## Avant-garde visual mockups before implementation — 2026-11-04

User requested a more unconventional visual exploration and explicitly asked for mockups first. Generated five independent image boards using built-in Imagegen, grounded in the existing vinyl and Ferrari source images. Actual displayed order: Type Collision, Chromatic Shutter, Off-grid Editions, Surface Loom, The Colour Atlas. Every board contains a desktop composition, mobile adaptation and three proposed scroll-motion states. The ideas use typographic masks, large flat shutters, print collage, interwoven photographic strips and atlas-like 2D framing, rather than another central image with side text or a new live 3D scene.

Saved full images as `public/design-preview/avant-garde-1.png` through `avant-garde-5.png`, with exact generation prompts/reference paths in `avant-garde-prompts.json`. One review link is `public/design-preview/avant-garde.html`; the page explicitly identifies the boards as static proposals, not functional animation. Gallery and all five image URLs return HTTP 200. Generated images were inspected directly; no browser-rendered gallery comparison or mobile performance pass is claimed. Hero/studio and all live previews remain unchanged. Selection is pending before implementing a new direction. No push/deploy.

## Five reference-led scroll stories + studio optimization — 2026-11-04

Implemented `/scroll-lab?option=1` through `option=5`, with one shared selector and full live lower-page previews. Directions are Surface Index (vertical material story), Moving Archive (horizontal photography), Street Editions (released poster stack), Precision Journal (image wipes), and Signature Atelier (large image/editorial composition). The source is the frame-by-frame inspection of `public/videos/video ref.mp4`, saved as contact sheets under `artifacts/reference-video/`. Retained Zan Decal's existing pink/lavender/cyan tokens; scoped new bold Barlow Condensed/Geist typography to the lower previews without changing the image hero or studio design.

Each preview reuses the actual HeroStudioSequence, followed by a material manifesto, native sticky scroll journey, full expandable admin material catalog, installation story, portfolio inspiration images/details, published color palette, order steps, existing consultation form and footer. Scroll drives image travel/rotation/wipes, focused grayscale on desktop, title/detail progression, photography scale, card arrivals and section entrances without requiring clicks. Mobile uses vertical type/photo/copy hierarchy, no real-time grayscale filter, shorter native runways, responsive images and reachable controls. Reduced motion/no-JS uses readable normal-flow content rather than a pinned/hidden story. All published materials remain available in the full catalog; pinned chapters are capped at eight. Images are illustrative/inspiration and not falsely mapped to specific material brands. New photography delivery files are 92–227 KB WebP with responsive Next Image sizes.

The scroll director uses one passive event-driven RAF and viewport intersection filtering, batching reads before writes and avoiding React state updates while scrolling. It releases listeners/observers on unmount and restores readable text/inert state for reduced motion. No WebGL was added to the new lower-page sections. Homepage lower sections remain unchanged pending selection of a mockup.

Studio performance work changes delivery/render scheduling only: lossless gzip transport reduces Ducati from 8,037,776 to 5,229,177 bytes (34.9%) and BYD from 22,263,008 to 14,421,883 bytes (35.2%). Decompressed assets are byte-identical to their originals, including all geometry/textures, and original source files remain present. Explicit encoding/type headers are configured for these two static resources. Actual HTTP fetch/decompression/hash tests pass. Vehicle geometry/rig tests still pass: Ducati 101,989 triangles/2 wheels/3 paint materials; BYD 136,564 triangles/4 wheels. The shared studio now uses on-demand rendering, device-aware 30 FPS ambient scheduling on mobile/lite, adaptive pixel density/environment/transmission buffer resolution, and a bounded appearance/camera settling window. Orbit controls retain their own interaction invalidation. The renderer no longer continuously draws offscreen, and hidden studio models are not requested merely because their invisible layer intersects the hero. Geometry, textures, driving path, garage design and paint controls are retained.

Validation: final TypeScript, focused ESLint and production build pass. All five preview URLs return HTTP 200. Story tests pass 15,015 scene samples across 1/3/8 items and four viewport heights for finite/continuous transforms, one active item, large travel, wipe endpoints and reversal. Lossless model transport and real-asset rig/hero-studio sequence tests pass. Final browser discovery reports no apps/browsers, `Computer Use native pipe is unavailable` (os error 2) and `The browser access host is unavailable`. Final visual QA result: blocked. Browser capture, physical mobile gesture tests and measured GPU/phone FPS remain unverified; no visual comparison or universal lag-free claim is made. No GitHub push or deployment performed.

## Five non-3D material alternatives — 2026-11-04

Added `/material-ideas` with five selectable photo/text-based layouts: sample book, editorial journal, results inspiration gallery, paired material comparison and character discovery. These alternatives use existing local fonts/images and admin-managed material/portfolio content, with no Canvas/Three import, autoplay, custom animation or frame loop. Sample imagery is labelled illustrative; the gallery is labelled inspiration. Character discovery matches explicit catalog description text rather than asserting invented technical suitability. Controls include selecting samples, expandable real specifications, portfolio category filters, user-started video playback if published, two comparison selects, mood choices, theme and consultation links. The mobile comparison pairs each field in two columns without a wide scrolling table. Old previews and homepage remain intact.

Browser visual/mobile interaction verification remains unavailable; no visual or performance pass is claimed. TypeScript/lint and HTTP checks are recorded in this task's results. No push.

## Wrap and Duel live concept / mobile layout — 2026-11-04

Added an opt-in extension at `/material-motion?study=wrap` rather than replacing the existing five studies. The new concept has three working modes: sheet, wrapping, and two-finish comparison. A procedural illustrative hood base remains visible while the colored sheet morphs onto its tapered curved surface. Duel mode renders different roughness on the left/right of the same sheet using shader uniforms, with selected color on both sides; a range slider and horizontal dragging move the split. Material selection is available as a compact select, and existing admin colors/finish controls remain connected. Per-material finish memory, theme, reduced motion, mobile/lite budgets and one Canvas are retained. This is a panel wrapping illustration, not a precise vehicle model or physical installation simulation.

Mobile art direction: large three-step mode buttons, an uncluttered panel stage, no required orbit gesture, 48px selects, a full-width comparison slider and a two-column color palette. Left/right finish labels are explicit; equal finishes show a helpful matching-state note. The existing five studies and main homepage hero/studio are retained.

Verification: Final TypeScript and focused ESLint pass, including the left-finish label and matching-state note. Dedicated wrap tests pass at desktop/mobile/lite tessellation for original-sheet start, finite intermediate vertices, unit normals, tapered perimeter, front orientation and .035-unit separation between film and hood. Existing motion and material-preview tests pass; the new URL returns HTTP 200 with the exploration controls in HTML. Browser access was unavailable during the preceding testing run, so actual WebGL shader compilation, mobile composition, touch comparison, color appearance and measured FPS remain unverified. No visual/mobile QA pass is claimed. No push.

## Material interaction transition polish — 2026-11-04

Polished the five material-motion studies with one easing/timing system: sliding tab underline, finite canvas entrance, headline reveal, staggered material detail text, selected-swatch ring/check response, material-row underline/arrow motion, finish/button press feedback, and progressive details opening with a native fallback. All finite UI effects respect reduced motion and use no perpetual UI animation loops. Mobile durations are shorter and existing quality budgets/touch targets remain.

Removed the option-keyed WebGL remount so changing studies reuses the Canvas/context. Color, roughness, clearcoat, metalness and grain now settle smoothly toward the selected values; initial material properties are kept stable so React does not replace the interpolated values abruptly. Demand rendering permits a bounded 1.1-second appearance-settling window after option/color/finish/material/theme changes, including while animation is paused, then returns to idle scheduling. Reduced motion applies appearances immediately. Error fallback can recover on a different study selection.

TypeScript, focused ESLint, motion geometry tests and material preview tests pass. Browser-rendered appearance transitions and visual composition remain unverified because browser access has been unavailable; no visual/mobile FPS pass is claimed. Existing homepage hero/studio and admin data remain unchanged; no push.

## Color and material picker typography — 2026-11-04

Updated the live material-motion color selector and material collection using existing local fonts: readable Geist color names, an Instrument Serif selected-color heading, and Barlow Condensed material names with separate smaller material types. Added a checkmark and border for selected colors, restrained hover/press feedback, directional arrows for selected materials, larger spacing and two-column color choices on mobile with 54–56px touch targets. Long names wrap, theme tokens remain in use, and reduced motion suppresses transform feedback. No additional font downloads or continuous animation loops were introduced. Existing selected material/color state and 3D rendering are unchanged.

Browser visual verification remains unavailable; no visual QA pass claimed. Code and served-markup checks are recorded in the current task results.

## Mobile budgets and server retest — 2026-11-04

Mobile optimization from the preceding interrupted turn is now checked: desktop uses 1,495 vertices per sheet, mobile 363 and lite 189; mobile/lite disable real-time shadows, cap render scheduling at a target 30 FPS and DPR at 1.25/1 respectively, and lower environment resolution and gallery structure count. An explicit Mode hemat control selects lite. Sustained low observed render cadence lowers quality; it never upgrades beyond the device budget. Demand rendering schedules changed frames only while active, with idle geometry/DOM updates skipped. Deformation now writes into existing position/normal buffers with analytical normals rather than allocating an array per vertex and rebuilding triangle normals. Touch intent separates vertical page scroll from horizontal sheet dragging, and small-screen control targets were enlarged.

Validation: TypeScript and focused ESLint pass. Existing material motion and preview suites pass. `node scripts/verify-material-mobile.mjs` passes device-budget/downgrade checks and verifies 20,470 vertex positions/normals against the original coordinate function and independent finite-difference normals across all three tessellation levels. The CPU-only benchmark on this computer (four sheets/update, median samples after warmup) measured legacy 2.499 ms, optimized desktop .934 ms, mobile .286 ms and lite .127 ms. These are NOT smartphone FPS measurements and exclude browser, GPU rendering and touch behavior. Full output is saved in `artifacts/material-mobile-check.json`.

Local Next dev server restarted on port 3000, advertised LAN URL `http://192.168.1.9:3000`. Browser discovery reports both `The browser access host is unavailable` and `Computer Use native pipe is unavailable` (os error 2); no targetable browser/native app is exposed. Actual mobile viewport, visual color/lighting, WebGL shader compilation, physical touch, page overflow, thermal behavior and measured phone FPS remain unverified. Final visual/mobile-device QA result: blocked. Existing homepage hero/studio remain unchanged; no push/deploy.

## Black surface correction — 2026-11-04

User reported a black sheet despite selecting a color. Source investigation found that generated vertex rows inverted PlaneGeometry's original Y direction, reversing front/back winding, while the shader explicitly replaced every backface with black. Corrected row orientation and removed the black backface override. Both faces now retain the selected color through curls and folds; changed the shader cache key to invalidate the old program. This supersedes the dark-underside behavior described below.

Motion/preview tests pass, including a new regression using Three's actual PlaneGeometry triangle index order to assert that the unrolled front normal points toward the camera. HTTP mockup 5 returns 200. Browser-rendered color/lighting verification remains pending; no visual pass is claimed.

## Selected material and color in live mockup 5 — 2026-11-04

Removed the fixed cyan split-color shader from Touch: the full front surface now uses the selected published color. The dark adhesive underside is retained. The selector reads all admin-published colors using stable IDs, rather than three hardcoded colors. Switching materials preserves the selected color, and each material remembers its selected preview finish during the session. An initial finish is taken from explicit finish words in material name/type, with neutral Satin fallback; no brand-ID mapping is used. Surface rendering uses explicit chrome/metallic labels when present, and the selected finish changes roughness, clearcoat and grain. These are illustrative PBR settings, not measured material specifications or a material/color stock-availability matrix. Selected material type, color name and finish appear on the stage; published material specifications remain the source for technical information.

The preceding cinematic update also adds foil grain/dark backs, a moving studio spotlight, real shadows, a raised orbital platform, a moving illuminated gallery structure, larger camera/shape movements, and an optional reversible sticky scroll mode. Native browser QA for that revision was stopped by the user's physical Escape key. No further computer interaction was attempted in this turn.

Validation: final TypeScript and focused ESLint pass. New material-preview checks pass for new admin labels, default and overridden finishes, brand-independent parameters and reflective profiles; motion continuity/geometry checks still pass. Mockup 5 returns HTTP 200 and server HTML includes published colors beyond the old palette. Rendered colors, shader compilation, visual fidelity, scroll interactions, and FPS still need browser verification. Final visual QA result: blocked; no visual/smoothness pass claimed. Homepage hero/studio unchanged; no push.

## Five animated material mockups — 2026-11-04

final result: blocked (browser visual QA)

The previous material-v2 gallery contained static image storyboards. Added `/material-motion` with five selectable live WebGL studies mapped to the actual displayed image order: Unroll, Orbit, Gallery, Anatomy, Touch. Large movements include a physically coiled strip opening across the stage, three orbiting specimens, movement through monumental hanging sheets, four separating/rejoining illustrative layers, and a drag-controlled bending sheet. Generated mockup images are visual references, not screenshots of these live studies; exact photographic fidelity is not claimed.

Shared controls include automatic reversible playback, pause/replay, an accessible timeline slider, pointer dragging, three surface finishes, preview colors, theme switching, actual admin-managed material selection/specifications and consultation links. Manual playback resumes at matching progress rather than jumping. Reduced motion stops automatic movement; document visibility and viewport intersection suspend the animation clock and continuous Canvas rendering. Geometry updates occur outside React state, and DPR is bounded to 1–1.5. Existing homepage hero/studio and `/material-lab` studies remain unchanged. The old `design-preview/material-v2.html` link now opens the live studies; the original static gallery remains at `material-v2-static.html`.

Verification: all five live option URLs and the old entry link return HTTP 200 with controls in server HTML. Motion tests pass for four loop cycles, progress bounds, continuity at loop boundaries, inverse progress for jump-free resume, finite continuous vertices through the curl, and deformation exceeding three world units. Final TypeScript, focused ESLint and motion tests passed after the transparent-layer material adjustment. Browser inventory and an explicit in-app tab attempt report `The browser access host is unavailable`. Actual rendered desktop/mobile composition, theme contrast, dragging/clicks, WebGL runtime console, photographic comparison and measured FPS remain unverified. No visual or smoothness pass is claimed. No push/deployment performed.

## Continuation check — 2026-11-04

Localhost restarted on port 3000. Homepage, admin, public content API and all five material-lab options returned HTTP 200. Local admin integration, PostgreSQL migration/RLS/rollback tests and cloud HTTP contract tests passed again; main account/content were not modified. Hero, studio and the unselected material options remain unchanged.

Added `scripts/check-supabase.mjs` for read-only online table/bucket readiness checks. Syntax check passed; execution correctly reports missing configuration because this workspace has no live Supabase environment. Netlify/Supabase activation, real uploads/CORS and persistence after redeployment remain unverified.

Browser inventory now sees Brave but the browser access host remains unavailable. Native Brave accessibility read succeeded; clicking failed with unavailable coordinate geometry, and a fresh screenshot/input retry was rejected because a different application occupied the target point. No rendered website, theme, mobile, interaction or animation smoothness pass is claimed. Visual QA remains blocked.

Target: `public/design-preview/mockup-combined.png`, combining mockup 2 page structure with the mockup 3 configurator section.

Final result: blocked

Browser capture could not be completed. The in-app browser reports “The browser access host is unavailable.” The existing Chrome window was discovered, but native app access returned “Computer Use app approval timed out.” No rendered screenshot or interaction verification is claimed.

Implemented surfaces awaiting visual verification:

- Typography: existing Geist family; large asymmetric headline, compact labels, readable supporting copy.
- Spacing and layout: white asymmetric hero, dark 65/35 configurator, image-led materials and gallery; mobile stacking at 760px.
- Colors: existing pink #FF9A9E, lavender #A18CD1, cyan #8FD3F4 and existing light/dark tokens. First-visit theme is light; saved theme choices persist.
- Images: generated individual hero, vinyl, and gallery assets. Gallery masthead is explicitly labeled visual inspiration.
- Content and interaction: original color presets, four finishes, orbit/zoom, click-to-paint and WhatsApp concept handoff retained. Existing material brand/layer controls, custom sticker content, gallery filters/detail modal, order stepper, consultation form and theme toggle remain available.

Intentional extensions beyond mock: original feature-rich sections remain below the mock's image-led introductions; material technical controls are available in an expandable section rather than removed.

Required next visual checks: desktop hero composition; mobile navigation/overflow; live model color and finish changes; orbit/zoom and click-to-paint; saved theme; gallery filtering/detail closure; order step navigation; consultation choices. Recompare source and captured implementation before marking visual QA passed.

## Custom Sticker scroll repair — 2026-10-29

final result: blocked

User reported missing pinning, excessively fast vehicle motion, and empty space below the section. Replaced trailing padding with measured parent height so the sticky panel occupies its entire scroll interval. Increased the vehicle scroll distance from 1.65 to 3.2 viewport heights; used clamped smoothstep movement with initial/final holds and overlapping departure/arrival. Removed opacity thresholds that made vehicles disappear suddenly. Services and consultation links remain present.

Validation: TypeScript and focused ESLint passed. Latest production compilation succeeded, but page-data workers failed with Windows `spawn UNKNOWN`, including outside the sandbox. No claim of successful final production build. Browser interaction and visual comparison remain unverified because Chrome access was not approved in the preceding turn. Earlier QA notes above describe the previous design and are not proof of this repair.

## Vehicle and gallery revision — 2026-10-29

Removed the small Custom Sticker detail image. Main vehicles now use newly generated Ferrari 488 GTB and Yamaha YZF-R6 transparent images, enlarged and horizontally centered. CSS aligns tires using measured source alpha bounds (Ferrari baseline 71.5%, Yamaha 92.6%). Pinned transition and service details retained. Gallery now includes Ford F-150 Raptor, KTM 1290 Super Duke R, Ferrari, Yamaha R6, Porsche, and street motorcycle directions. BYD remains in the gallery masthead and one collection item. Filters, dialog details, and WhatsApp handoff retained.

New images inspected directly; TypeScript and focused ESLint passed. Browser-rendered layout comparison is still unverified; final result remains blocked.

## Four-image gallery and brand palette revision

Gallery reduced to four collection images: Ferrari, Ford Raptor, KTM Super Duke, Yamaha R1. Removed the additional masthead photograph. Existing filters and detail modal retained. New photographs use different body colors; pinned Ferrari and R6 also use separate pink/blue assets.

Pinned departure now measures the runway width and actor offset in pixels instead of translating by a percentage of a potentially narrow actor. Motor becomes hidden only after its departure completes, and restores when scrolling back. Runway clipping prevents off-stage remnants.

Shared pink, lavender, sky blue, magenta and stealth black tokens applied to headings, backgrounds, button states, section accents, and footer. TypeScript and focused lint passed. Browser visual verification remains blocked; no claim of visual QA pass.

## B3 continuous 3D experience — 2026-10-30

Implemented the selected B3 Material Atelier hero and Colour Chamber studio as one pinned, scroll-driven Canvas. Ducati and BYD have independently rotating wheels, vehicle travel, camera movement, paint controls, finish controls, and theme-aware rooms. Each following section uses its own reversible arrival treatment. Reduced-motion support and an ambient-motion pause control are included. Rendering stops when the experience is outside the viewport or the browser tab is hidden; DPR is bounded and adapts to slow frames.

Validation: TypeScript and focused ESLint passed. Actual-asset rig tests passed for Ducati (2 wheels, 3 paint materials, 101,989 triangles) and BYD (4 wheels, 2 paint materials, 136,564 triangles), with original geometry preserved. Scroll path continuity passed. Localhost returned HTTP 200 and the new experience markup.

Browser screenshot comparison, camera interaction, mobile composition, and measured frame rate could not be verified: the supported browser runtime returned `No browser is available` and an empty browser list. No visual or smoothness pass is claimed. Final visual QA result: blocked.

## Garage and driving revision — 2026-10-30

Replaced circular vehicle movement with a forward approach/departure and a separate left-to-right studio arrival. Wheel angles now follow the translated distance. A foreground garage shutter covers the room change, reverses with scroll, and is removed for reduced motion. Removed the vinyl sheet. Both rooms now have procedural garage architecture with structural columns, roller door/service cabinets in the hero, and an illuminated wrap bay, workbench and material rolls in the studio. Both palettes follow the selected theme.

Ordinary wheel and trackpad scrolling no longer zoom OrbitControls. Trackpad pinch (ctrl+wheel) and touchscreen two-finger distance changes adjust camera distance within limits. One-finger vertical page scrolling remains allowed. These physical gestures still require device/browser validation.

Actual-asset geometry and wheel tests passed, including forward-only motion in each visible bay, matching wheel travel, left-side arrival, shutter coverage and pinch scaling. Localhost returned HTTP 200 with the new transition markup. Browser discovery was retried and returned an empty list; visual and gesture QA remain blocked.

## Distinct hero, detailed workshop and loading repair

Hero now uses an open architectural runway with light portals and fins, separate from all studio garage geometry. Hero-only vehicle scale is 1.22 and the desktop camera is closer with a 31-degree field of view. Studio framing, driving path and shutter transition remain. Headline replaced with animated “Bukan sekadar warna. INI KARAKTER.”, with staggered entrance, an ink sweep, reduced-motion support and ambient pause support.

Studio adds a gridded cutting table, film sheet, heat gun, squeegees, ruler, knife, tool pegboard and rolling chest. The shared palette now contains 12 distinct colors, also displayed as workshop film rolls. Swatches use a responsive six-column layout.

Removed drei Html from the model Suspense fallback. A normal React DOM loading overlay outside Canvas now follows the model-ready callback; this removes the nested HTML root teardown implicated by the reported synchronous-unmount warning. Direct console confirmation is still pending browser access.

Validation: TypeScript, focused ESLint and actual-asset driving/geometry tests passed. Localhost returned HTTP 200 with the revised headline and expanded palette. Visual framing, physical gestures and runtime console remain unverified; visual QA remains blocked by unavailable browser connection.

## Animated hero explorations — options 1 and 3

Selected references: `public/design-preview/hero-v5-1.png` (Concrete Dawn) and `public/design-preview/hero-v5-3.png` (Precision Index), inspected directly before implementation. Added isolated `/hero-motion?option=1` and `/hero-motion?option=3` previews without replacing the homepage. Concrete Dawn uses a forward motorcycle arrival, concrete architecture, sunlight/shadows and a scroll camera move. Precision Index uses a higher camera, dimensional guides, a moving light scan and a scroll change toward a lower camera angle. Both include real Ducati geometry, physical wheel travel, live paint controls, theme switching, reduced motion, ambient pause, replay, links to the existing studio and a dialog for the source mockup.

Source geometry is reused; no raster production was needed for these explicitly requested 3D interpretations. Browser discovery returned an empty list. Exact photographic fidelity, mobile layout, interaction playback, runtime console and measured frame rates remain unverified. Both preview URLs returned HTTP 200 and their expected headings. TypeScript and motion/geometry tests passed; focused lint issues were repaired and rechecked. Final visual QA result: blocked, pending a browser-rendered comparison.

## Approved static-image split hero — study VI option 4

Reference `public/design-preview/hero-v6-4.png` inspected directly. Homepage now uses `SplitImageHero`, with two actual transparent frontal vehicle images, matching half-lavender/half-white paint, independently generated photographic dark/light backdrops, condensed split headline and CTA. Source assets were generated with built-in Imagegen against the selected reference; PNG masters remain in `public/images/split-hero-*.png`, with alpha-preserving WebP delivery versions totaling approximately 428 KB. No live 3D is rendered by the hero component.

The image timeline holds each vehicle for exactly 3,000 ms and crossfades/slides over 1,000 ms. Both images must load before the clock starts. The clock pauses offscreen, in a hidden tab, on user pause and under reduced motion. Light sweeps right-to-left, Dark left-to-right. The View Transition API applies the same 1-second directional reveal to the whole website where supported; the hero has its own CSS wipe fallback. Global theme storage and all existing theme consumers are retained. Rapid theme changes skip the previous view transition before starting another.

The previous continuous hero/studio component is retained with a `studioOnly` mode, rendering only the existing studio below the new image hero. Its Canvas loads when approaching the viewport. Homepage has one H1 and retains gallery/workflow/material/consultation sections. Admin work has not started.

Validation: exact hold/transition boundary tests passed over eight alternating slots, and PNG/WebP dimensions/transparency were checked. Homepage and the delivered car image returned HTTP 200; server-rendered markup contains the new hero and standalone studio. TypeScript and focused lint passed. Source images were inspected directly. Browser discovery again returned an empty list: screenshot comparison, physical theme gestures, exact framing and runtime console verification remain blocked. Final visual QA result: blocked, with runnable implementation available for user review.

## Theme hit area, photo transition and pinned studio correction

Source inspection identified the absolute navbar's full-width box (z-index 20) above the hero theme controls (z-index 8). Empty navbar space now ignores pointer events; its actual links and buttons remain interactive. This removes the overlapping hit target over the theme switch. Runtime clicking remains pending browser availability.

Vehicle transitions now fade the outgoing image out before fading the incoming image in, keeping both images centered with no lateral shift or scaling. This removes overlapping silhouettes; the 3-second hold/1-second transition contract remains.

Restored a dedicated pinned studio runway after the photograph hero: the garage shutter closes and opens, branded ZAN DECAL, then the selected vehicle travels from offscreen left into the display position on the right. Controls enter after arrival. Scroll reverses the sequence. Native scroll, lazy Canvas, pause and reduced motion remain supported. No additional 3D was added to the image hero.

Boundary/asset tests and actual-model movement tests passed, including no simultaneous photo silhouettes, left-to-right studio motion, door closed/open endpoints and control arrival. TypeScript and focused lint passed; localhost returned HTTP 200. Browser-rendered click, scroll and visual comparison are still unverified. Final visual QA result: blocked on browser access.

## Theme-painted hero and persistent admin

Hero now has four additional theme-specific photographs: fully white Ducati/BYD for Light and fully lavender Ducati/BYD for Dark, with alpha-preserving WebP variants. Source framing and transparency inspected. The first fresh visit keeps the split mockup; a saved explicit theme restores the corresponding full-theme photograph. Theme selection controls the image overlay and background wipe together.

Added `/admin` with first-account setup, login/logout, hashed passwords and signed HttpOnly/SameSite cookies. Authenticated content publishing covers materials, photo/video portfolios, studio color presets and gallery background video. Content is stored atomically in `data/content.json`, and uploaded media in `data/uploads`, served through a validated media route with range/HEAD support. Public server rendering and client content updates consume the same data. Revision checks avoid overwriting a newer save from another tab. Production setup requires ADMIN_SETUP_TOKEN. Local data and hosting requirements are documented in ADMIN.md.

Validation: TypeScript passed. Integration tests against actual server handlers in an isolated temporary directory passed for setup/login, cookie authentication, CSRF checks, photo and real MP4 upload, media byte ranges, unsupported-file rejection, publishing/editing/deleting, background video selection, validation, revision conflicts and persistence. No admin credentials or content were created on the main installation by tests. The live `/admin`, `/api/content`, `/api/admin/session` and homepage returned HTTP 200; current public data contains 3 materials, 4 portfolio entries and 12 colors. Four theme images passed dimension/alpha checks. Browser discovery remains empty, so actual admin form interaction, screenshots and visual theme playback remain unverified. Final visual QA result: blocked; API/logic checks are separate passes.

## Shared hero-to-studio pin and admin entry

Replaced the separate hero and studio scroll sections with one shared sticky viewport. The image hero stays pinned during the first scroll phase. A Zan Decal garage door then closes over it, the underlying scene swaps only while the door is fully shut, and the door opens onto the 3D studio as the vehicle enters. Studio controls appear after arrival. The sequence reverses when scrolling back. Shared progress refs/subscriptions keep scroll frames outside React renders; the hero slideshow pauses when hidden behind the studio. Reduced motion displays the hero and studio as normal sections.

The main navigation and footer anchors now target one homepage anchor and one studio anchor; the studio link lands at the final studio phase. Added a small Admin link in the footer, retaining the existing login protection. An admin link is a convenience, not an access control mechanism.

Validation: sequence tests pass for the initial hero hold, fully covered scene swap, continuous door movement and final studio arrival. Actual vehicle geometry/motion tests pass. TypeScript and focused lint passed. Homepage returned HTTP 200 with one shared pin, one of each anchor and the footer Admin link. Browser screenshot/interaction verification remains blocked by the unavailable browser connection.

## Admin access correction

Admin session is now resolved on the server from the request cookies. The login/setup form or authenticated workspace is rendered in the initial `/admin` response, eliminating the previous client-only loading screen and initial session-fetch dependency. The session API uses the same session resolver. A window-focus check still refreshes session state after hydration.

The footer Admin entry is now a native document-navigation link labeled “Masuk Admin”, with a 44px minimum click area and explicit pointer events. This keeps navigation independent of the departing WebGL tree and Next client route transition. Existing authentication remains enforced.

Validation: HTTP `/admin` contains the username/password form before client execution; homepage contains the native admin link. TypeScript and targeted lint pass. Integration tests now also explicitly add, publish and delete a material and a color preset, alongside existing portfolio/photo/video tests. Tests leave the user's account and main content unchanged. Direct browser clicking remains unverified because the browser connection is unavailable. No GitHub push was performed; user confirmation is required before pushing.

## Netlify origin correction

The previous origin check compared the browser Origin only with `request.url.origin`, which can represent an internal proxy URL. Updated validation accepts exact configured public origins (`ZAN_SITE_URL`, Netlify URL/DEPLOY_URL/DEPLOY_PRIME_URL, and optional explicitly listed ZAN_ALLOWED_ORIGINS). On Netlify the public Host header is also supported with HTTPS. Cross-site fetch metadata, malformed origins, unrelated Netlify tenants, suffix-lookalike domains and spoofed X-Forwarded-Host are still rejected.

Regression tests simulate the internal Netlify URL with production, preview and custom public domains, and verify malicious-origin rejection. Full admin integration tests still pass; TypeScript and focused lint passed. No live Netlify deployment was inspected or modified in this turn. The separate existing filesystem-storage limitation on serverless hosting is documented in ADMIN.md and was explicitly disclosed to the user.

## Persistent admin backend

## Material live studies

Added `/material-lab?option=1` through `option=5` as separate live section previews. Five compositions explore editorial vinyl photography, technical surface inspection, a warm finish library, a cinematic material archive and a workshop notebook. Each reads admin-managed materials from SiteContentContext, displays real names without brand-ID assumptions, supports selection and expandable specifications, and links to the existing consultation section. Light/dark uses the website theme provider.

Motion includes perspective photograph drift, light passes, inspection scanning, shelf motion, cinematic image panning, workshop ticket drift, requestAnimationFrame scroll offsets and progressive CSS scroll entrances. Pause and reduced-motion behavior are provided; automatic material selection stops on manual selection and pauses for hidden documents/focused content. Real existing project images are reused. These previews do not replace the homepage material section until a direction is selected.

Validation: all five routes returned HTTP 200 with their distinct headings, specs and controls; TypeScript and production build passed. Browser capture was unavailable because the browser access host could not connect, so desktop/mobile visual interaction is not claimed as verified.

### Admin creation drawers

Material, portfolio and color creation now opens a native modal drawer with isolated draft state, responsive scrolling, a fixed publish footer, upload previews and a color picker. Cancel does not insert incomplete rows. The drawer validates before sending, publishes directly through the authenticated content API, keeps drafts after failed requests/session expiry, and prevents closing during upload/save. Native dialog provides focus containment and Escape handling; closing restores focus. Reduced motion disables entrance animation. Existing inline editors remain available for updates.

The integration suite exercises the same draft preparation used by the drawer: missing required fields/media are rejected, existing data is not mutated, all three creation flows publish successfully, and public reads return each new entry with normalized categories. Actual browser interaction could not be inspected because the browser access host is unavailable.

Added Supabase PostgreSQL/Storage integration while retaining local persistent storage for development. Cloud account setup is atomic, all writes require the admin cookie and same-origin validation, and content publication uses a transaction with a revision conflict check. Signed direct uploads avoid proxying video bodies through Netlify Functions; completion checks the stored size and file signature. Admin session expiry preserves unfinished drafts, editors disable during saving/uploading, and unavailable storage shows an explicit configuration state.

Validation: local admin integration, real PostgreSQL PGlite migration/RLS/rollback tests, and cloud HTTP contract tests backed by PGlite all passed. TypeScript, focused ESLint and the production build passed, with type errors enabled. Runtime storage paths are excluded from static tracing to avoid bundling customer uploads/credentials. Browser interaction remains unverified because the browser host is unavailable. No live Supabase credentials are configured; live migration, upload CORS and Netlify deployment remain unverified. DATABASE.md and .env.example document activation. Existing local user credentials were preserved. No push was performed.
