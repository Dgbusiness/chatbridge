# ChatBridge

A lightweight Node.js server that aggregates Twitch and YouTube live chat into a single WebSocket stream, designed to be used as a browser source overlay in OBS or similar streaming software.

## Requirements

- Node.js 18+
- An active Twitch channel and/or YouTube channel with live chat

## Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone <repo-url>
   cd chatbridge
   npm install
   ```

2. Copy the example environment file and fill in your channel details:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env`:
   ```
   TWITCH_CHANNEL=your_twitch_channel
   YT_CHANNEL_ID=your_youtube_channel_handle
   WS_PORT=8080
   YT_RETRY_INTERVAL=10000
   ```

## Usage

| Command | Behavior |
|---|---|
| `npm start` | Both Twitch and YouTube |
| `npm run start:tw` | Twitch only |
| `npm run start:yt` | YouTube only |

The WebSocket server listens on the port defined in `WS_PORT` (default: `8080`).

## OBS Setup

1. Start the server with `npm start`
2. In OBS, add a **Browser Source**
3. Check **Local file** and select `stream_chat.html`
4. Set width/height to match your scene (e.g. 400×600)

## Project Structure

```
chatbridge/
├── server.js              # WebSocket server and entry point
├── config.js              # Loads environment variables
├── platforms/
│   ├── twitch.js          # Twitch chat client
│   └── youtube.js         # YouTube chat client with reconnect logic
├── stream_chat.html       # OBS browser source overlay
├── assets/                # Badge and platform icons
├── .env                   # Your config (not in repo)
└── .env.example           # Config template
```
