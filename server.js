import WebSocket, { WebSocketServer } from 'ws';
import { WS_PORT } from './config.js';
import { startTwitch } from './platforms/twitch.js';
import { startYouTube } from './platforms/youtube.js';

const wss = new WebSocketServer({ port: WS_PORT });
const clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Nuevo cliente conectado al overlay');
});

function broadcast(msg) {
  for (const c of clients) {
    if (c.readyState === WebSocket.OPEN)
      c.send(JSON.stringify(msg));
  }
}

const userColors = {};
function getColor(username) {
  if (!userColors[username]) {
    const hue = Math.floor(Math.random() * 360);
    userColors[username] = `hsl(${hue}, 90%, 55%)`;
  }
  return userColors[username];
}

// Plataformas: PLATFORM=yt o PLATFORM=tw para solo una; sin variable = ambas
const platform = process.env.PLATFORM;
const enableTW = !platform || platform === 'tw';
const enableYT = !platform || platform === 'yt';

console.log(`Plataformas activas: ${[enableTW && 'Twitch', enableYT && 'YouTube'].filter(Boolean).join(' + ')}`);

if (enableTW) startTwitch(broadcast, getColor);
if (enableYT) startYouTube(broadcast, getColor);

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
