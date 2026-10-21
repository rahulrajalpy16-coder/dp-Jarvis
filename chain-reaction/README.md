# Chain Reaction

Pass-and-play Chain Reaction for 2 to 8 players on one phone.

**Play:** https://rahulrajalpy16-coder.github.io/dp-Jarvis/chain-reaction/

## Install on Android
1. Open the link above in Chrome.
2. Tap **Install as app** on the home screen of the game, or open Chrome's menu (three dots) and choose **Add to Home screen** or **Install app**.
3. It then opens full screen from its own icon and works offline.

## Saving
- **Autosave.** The game in progress is saved after every move (and every 10 seconds of play). Close the app at any point,
  even in the middle of an explosion, and it reopens exactly where you were. A game only ends when someone wins or you
  choose **Quit game**. **Home (game stays saved)** leaves it waiting on the home screen under **Continue game**.
- **Saved games.** Up to 30 named copies you can load, rename and delete.
- **Backup and devices.** Each device has a name. Download, share or copy a backup of everything, and restore it on the same
  or another device by merging or replacing. The game keeps up to 3 automatic restore points (one a day, and one before
  every restore or erase) and asks the browser to protect its data from automatic cleanup.

All data stays on the device in the browser's storage. Nothing is sent anywhere.

## Features
- 2 to 8 players, any mix of humans and CPU (Easy, Normal, Hard)
- Campaign of 12 levels against the CPU, 16 achievements, stats with wins by player and games by device
- Undo and redo, hints, optional turn timer (10 to 60 seconds), game clock
- Boards from 6×9 up to 16×28, plus any custom size up to 20×36
- Customize grid colour (white by default), thickness, brightness and glow, board background, orb style and size,
  orb counts, explosion speed, spin, shake, last-move highlight, sound, vibration and keeping the screen on
- Android back button opens the game menu instead of leaving the game; full screen mode

## Files
| File | What it is |
|---|---|
| `index.html` | The whole game: markup, styles and script |
| `manifest.webmanifest` | App name, icons and colours used when installed |
| `sw.js` | Service worker that caches the game for offline play |
| `icons/` | App icons (192px, 512px, and a maskable 512px for Android) |

When you change `index.html`, bump `CACHE` in `sw.js` (for example to `chain-reaction-v5`) so installed copies pick up the new version.
