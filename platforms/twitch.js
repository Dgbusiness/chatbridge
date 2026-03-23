import tmi from 'tmi.js';
import { TWITCH_CHANNEL } from '../config.js';

const twitchMessageConstruct = (emotes, message) => {
  let emotes_hash = {};

  if (emotes) {
    Object.entries(emotes).forEach(([id, value]) => {
      let positions = value[0].split('-');
      let key = message.substring(parseInt(positions[0]), parseInt(positions[1]) + 1);
      emotes_hash[key] = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" alt="${key}" shared-tooltip-text="${key}">`;
    });
  }

  return message.split(' ').map((value) => emotes_hash[value] ?? value).join(' ');
};

export function startTwitch(broadcast, getColor) {
  const twitch = new tmi.Client({ channels: [TWITCH_CHANNEL] });

  twitch.connect();
  console.log('Twitch connected!');

  twitch.on('message', (channel, tags, message) => {
    broadcast({
      platform: 'Twitch',
      user: tags['display-name'],
      userColor: getColor(tags['display-name']),
      text: twitchMessageConstruct(tags.emotes, message),
      badge: tags['badges-raw']?.split('/')[0],
    });
  });

  twitch.on('disconnected', () => console.warn('Twitch desconectado'));
}
