# mion-bot

**mion-bot** is a feature-rich, multi-purpose Discord bot built with `discord.js` and TypeScript. It includes integrations with YouTube for livestream tracking, as well as Japanese language tools like Jisho dictionary search and Kanji breakdown tools.

## Features & Capabilities

### 📺 YouTube Livestream Tracking
The bot natively integrates with YouTube to track and remind users about upcoming livestreams.
- **Cron Job (`streamer-loader`)**: Automatically runs in the background to check the YouTube API for upcoming scheduled livestreams from a predefined list of saved YouTubers. It will send notifications to specific channels/users as streams are about to begin.
- **`/add-channel`**: Add a YouTube channel by name to the bot's tracking list.
- **`/search`**: Quickly search for a YouTuber's upcoming stream status.

### 🇯🇵 Japanese Language Tools
- **`/jisho`**: Search for any Japanese word, romaji, or English definition through Jisho.org's API wrapper.
- **`/kanji`**: Break down kanji characters into their radicals/components, providing detailed meanings and interactive buttons to explore deeper into kanji trees.

### ⏰ Utilities
- **`/remind`**: Set personal reminders using standard time formats (e.g., `10s`, `5m`, `1h`). The bot will ping you when the time is up!

## Tech Stack
- **Bun** (Fast runtime and package manager)
- **TypeScript**
- **Discord.js**
- **MongoDB & Redis** (Data persistence and caching)
- **APIs & Libraries**: `youtubei.js` (YouTube data), `kuromojin` & `kanji` (Japanese tokenization & processing) 

---

## Setup & Local Development

To install dependencies:

```bash
bun install
```

Make sure to set your environment variables (e.g., `DISCORD_API_KEY`, `CLIENT_ID`, `STREAMER_LOADER_CRON`, `MONGO_URI`, `REDIS_URL`) by copying `.env.example` to `.env`.

To start the project:

```bash
bun start
```

*This project was created using `bun init` in bun v1.2.15.*
