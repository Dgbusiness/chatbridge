import { LiveChat } from 'youtube-chat';
import { YT_CHANNEL_ID, YT_RETRY_INTERVAL } from '../config.js';

const ytBadges = ['vipkick', 'ytmod'];

const youtubeMessageConstruct = (message) => {
  let final = '';
  message.map((m) => {
    if (!m.text) final += `<img src="${m.url}" alt="${m.alt}" shared-tooltip-text="${m.alt}">`;
    else final += m.text;
  });
  return final;
};

let yt;
let ytRetryScheduled = false;

function scheduleYtRetry(broadcast, getColor) {
  if (ytRetryScheduled) return;
  ytRetryScheduled = true;
  console.warn('YouTube: reintentando en 10 segundos...');
  setTimeout(() => {
    ytRetryScheduled = false;
    startYouTube(broadcast, getColor);
  }, YT_RETRY_INTERVAL);
}

function attachYtListeners(broadcast, getColor) {
  yt.on('start', (liveId) => {
    console.log(`YouTube conectado! Live ID: ${liveId}`);
  });

  yt.on('chat', (chatItem) => {
    if (chatItem.message.length > 0)
      broadcast({
        platform: 'YouTube',
        user: chatItem.author.name,
        userColor: getColor(chatItem.author.name),
        text: youtubeMessageConstruct(chatItem.message),
        badge: chatItem.isOwner ? ytBadges[0] : (chatItem.isModerator ? ytBadges[1] : null),
      });
  });

  yt.on('error', (err) => {
    console.error('YouTube error:', err?.message ?? err);
    yt.stop();
    scheduleYtRetry(broadcast, getColor);
  });

  yt.on('end', () => {
    console.warn('YouTube chat desconectado.');
    scheduleYtRetry(broadcast, getColor);
  });
}

export async function startYouTube(broadcast, getColor) {
  try {
    yt = new LiveChat({ handle: YT_CHANNEL_ID });
    attachYtListeners(broadcast, getColor);
    await yt.start();
  } catch (err) {
    console.error('YouTube error al iniciar:', err?.message ?? err);
    scheduleYtRetry(broadcast, getColor);
  }
}
