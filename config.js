import 'dotenv/config';

export const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL;
export const YT_CHANNEL_ID = process.env.YT_CHANNEL_ID;
export const WS_PORT = parseInt(process.env.WS_PORT) || 8080;
export const YT_RETRY_INTERVAL = parseInt(process.env.YT_RETRY_INTERVAL) || 10000;
