<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TE6NIiZOGNVOksWmINx0Pc8S6rpwtTAJ

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy with Docker (Synology / any Docker host)

1. Create `.env` file:
   ```
   GEMINI_API_KEY=your-key-here
   ```
2. Build and start:
   ```bash
   docker compose up -d --build
   ```
3. Access at `http://your-nas-ip:3001`
