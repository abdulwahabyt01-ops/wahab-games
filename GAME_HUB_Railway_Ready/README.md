# GAME HUB — Railway Ready

A static browser-game collection with 10 games, served by a tiny Node.js HTTP server.

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

## Deploy to Railway

1. Create a GitHub repository.
2. Upload/push the contents of this folder to the repository root.
3. In Railway, create a new project from that GitHub repository.
4. Railway detects `package.json` and runs `npm start`.
5. Generate a Railway domain from the service's Networking/Domain settings.

The server listens on Railway's `PORT` environment variable and `0.0.0.0`.

## Mobile app / PWA

The site includes:
- `manifest.webmanifest`
- service worker (`sw.js`)
- installable icons
- responsive mobile layouts
- an Install App button where the browser supports the install prompt

On Android/desktop, use the browser's **Install app / Add to Home Screen** option.

iOS Safari can use **Share → Add to Home Screen**.

This is an installable web app (PWA), not an App Store/Google Play native package. A signed APK/IPA can be produced later with a wrapper such as Capacitor if needed.

## Important

The games are client-side HTML/CSS/JavaScript. No database or backend API is required by the current project.
