# Design verification — Zan Decal Atelier

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
