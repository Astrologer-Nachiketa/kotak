# Kotak Savings Landing Page (Static)

This is a simple static landing page (no build step) with:
- **Telegram alerts** for visits, plan clicks, calculator usage, and lead submissions
- **Savings calculator** (term slider affects output)
- **Lead form** with Indian mobile validation

## Folder structure

- `index.html`: UI markup only (keeps minimal inline handlers)
- `assets/styles.css`: small custom CSS (Tailwind + FontAwesome remain CDN)
- `assets/js/`
  - `config.js`: config values (Telegram + misc constants)
  - `telegram.js`: `sendTelegram()` transport
  - `visitTracking.js`: first/repeat visitor tracking
  - `leadForm.js`: lead form submit + mobile validation
  - `calculator.js`: calculator logic + auto-recalc on slider input
  - `ui.js`: small UI helpers (scroll)
  - `main.js`: app bootstrap + exposes minimal `window.*` used by HTML

## Customize

- **Telegram**: edit `assets/js/config.js`
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

## Notes / Best practice

- **Do not hardcode bot tokens in production frontend code.** Anyone can view page source.
  - Best approach: send leads to your backend, and the backend sends Telegram messages.

## Run locally

Just open `index.html` in a browser.
For best results (module scripts), serve with a local static server:

```bash
npx --yes serve .
```

