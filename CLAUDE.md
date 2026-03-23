# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Start server**: `npm start` (runs `node server.js`)
- **Install dependencies**: `npm install`
- No test suite or linter is configured.

## Architecture

ChatBridge is a two-component streaming chat aggregator:

### Backend (`server.js`)
A Node.js process that:
1. Connects to Twitch chat via `tmi.js` and YouTube live chat via `youtube-chat`
2. Processes incoming messages (emote parsing, badge detection, per-user color assignment)
3. Broadcasts unified JSON message objects to all connected WebSocket clients on port 8080

**Twitch emotes** are converted to `<img>` tags using Jtvnw CDN URLs. **YouTube messages** are reconstructed from structured objects (text runs + emoji/image runs). User display colors are generated dynamically as random HSL values and stored per-username in a `Map`.

### Frontend (`stream_chat.html`)
A standalone HTML file (no build step) intended as a browser source overlay in OBS or similar. It:
- Connects to `ws://localhost:8080`
- Renders messages with slide-in animations; each message auto-removes after 90 seconds
- Caps visible messages at 10

### Configuration
Channel targets are hard-coded at the top of `server.js`:
```js
const TWITCH_CHANNEL = 'dgame24yt';
const YT_CHANNEL_ID = 'dgame24yt';
```

### Static assets
Badge icons (`twitch.ico`, `youtube.ico`, `broadcaster.png`, `moderator.png`, `vipkick.png`, `ytmod.png`) are referenced by relative path in the HTML and must stay in the project root.

### YouTube reconnection
The YouTube client retries on disconnect with a 10-second interval loop. Twitch uses `tmi.js` built-in reconnect behavior.
