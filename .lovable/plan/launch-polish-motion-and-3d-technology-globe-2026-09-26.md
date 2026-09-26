# Launch polish: motion and 3D technology globe

## What will change
- Add a lightweight interactive 3D globe to the Services (“What We Do”) page, styled in the existing Copper Glass visual system.
- Connect the globe visually to S&S services using subtle network arcs, nodes, and restrained labels rather than adding more marketing copy.
- Refine page transitions, reveal timing, and interactive movement so motion feels smoother and purposeful.
- Keep mobile performance strong by reducing geometry, pixel density, effects, and interaction on small screens.
- Preserve a complete static presentation when reduced motion is enabled.

## Technical details
- Use Three.js for the globe, loaded only in the browser and isolated from server rendering.
- Pause rendering when the globe is off-screen or the tab is hidden; cap frame rate and device pixel ratio.
- Avoid new AI or image-generation requests; this work uses code and the existing palette/assets only.
- Keep all existing enquiries, quotes, portfolio, admin, SEO, PDF, and recommendation behavior unchanged.

## Verification and launch
- Check desktop, mobile, and reduced-motion views for rendering, spacing, controls, and errors.
- Confirm the current build is healthy and verify the primary navigation and WhatsApp path.
- Publish the finished version to the existing live address.
