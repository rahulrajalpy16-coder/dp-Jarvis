# Chain Reaction

Pass-and-play Chain Reaction for 2 to 8 players on one phone.

**Play:** https://rahulrajalpy16-coder.github.io/dp-Jarvis/chain-reaction/

## Install on Android
1. Open the link above in Chrome.
2. Tap **Install as app** on the setup screen, or open Chrome's menu (three dots) and choose **Add to Home screen** or **Install app**.
3. It then opens full screen from its own icon and works offline.

## Features
- 2 to 8 players, any mix of humans and CPU (Easy, Normal, Hard)
- Boards from 6×9 up to 16×28, plus any custom size up to 20×36
- Grid colour: white by default, any preset or custom colour, or the current player's colour
- Grid line thickness, brightness and glow; board background colour
- Orb style (glossy, flat, glow, ring) and size, optional orb counts
- Explosion speed, spin, shake, last-move highlight, sound and vibration
- Any colour for each player, undo, offline play

## Files
| File | What it is |
|---|---|
| `index.html` | The whole game: markup, styles and script |
| `manifest.webmanifest` | App name, icons and colours used when installed |
| `sw.js` | Service worker that caches the game for offline play |
| `icons/` | App icons (192px, 512px, and a maskable 512px for Android) |

When you change `index.html`, bump `CACHE` in `sw.js` (for example to `chain-reaction-v4`) so installed copies pick up the new version.
