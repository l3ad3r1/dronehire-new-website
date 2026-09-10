# DroneHire Flight Lab — Mavic pilot trainer

Open **index.html** in a modern browser to start. Keep the vendor folder beside it. No installation or account is required. WebGL must be available. The flight simulator works offline; optional Google Fonts fall back to system fonts without a connection.

## Learn to fly

Start with **Take off**, then follow the five lessons: takeoff, hover, rotation, beacon navigation, and landing. Choose **Next lesson** after earning each skill. Completed skills are remembered in this browser when storage is available; select a lesson to practice it again.

| Control | Action |
| --- | --- |
| W / S | Ascend / descend |
| A / D | Rotate left / right |
| Arrow keys | Fly forward, backward, left, right relative to the aircraft nose |
| Space | Automatic takeoff / land (or cancel landing) |
| P | Pause / resume |
| R | Reset aircraft and current exercise |
| C | Cycle follow, pilot, and overhead cameras |
| On-screen sticks | Drag to control both sticks, including on touchscreens |

Release the controls to brake and hover. Cine offers the gentlest response and a slow descent. Return home climbs to at least 8 m, travels directly to the H pad, and lands. Click again to cancel. Land descends at the current location. Reset replenishes the battery. Switching away pauses an airborne flight.

The practice field has a 65 m radius and a 30 m ceiling. Those are simulator exercise limits, not real flight regulations. Beacon targets accept a horizontal distance under 2.5 m and altitude of 3–7 m. Landing requires low horizontal and vertical speed for positive feedback.

## Scope

The interface follows the DroneHire website design system: Syncopate display type, Inter body type, JetBrains Mono telemetry, the #FF5500 signal orange, off-white canvas, and black flight-deck surfaces.

Independent Mavic-style educational simulator, not affiliated with DJI. It uses a stylized folding-arm quadcopter and simplified GPS-assisted flight dynamics. It does not simulate exact Mavic performance, real battery endurance, obstacle sensing, radio transmission, or terrain collisions outside the practice area. Keyboard and touch input are supported; physical controllers are not integrated.

Mode 2 reference: [DJI remote controller documentation](https://developer.dji.com/mobile-sdk/documentation/introduction/component-guide-remotecontroller.html). Consult [the official Mavic 3 manuals](https://www.dji.com/downloads/products/mavic-3) for real aircraft operation.

## Files

- `index.html` — interface and handbook
- `style.css` — responsive layout
- `app.js` — 3D field, controls, and exercises
- `physics.js` — flight model
- `vendor/three.min.js` — bundled Three.js r128, MIT license included

Validated: grounded input lock, takeoff, braking, nose-relative movement, automatic return and landing, manual descent, flight boundaries, and depleted-battery landing. Browser checks cover first-lesson completion, pause/resume, camera switching, reset, and responsive page width.
