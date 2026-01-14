import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, INDIA_TZ } from './config.js';

function nowISTString() {
  return new Date().toLocaleString('en-IN', { timeZone: INDIA_TZ });
}

/**
 * Fire-and-forget Telegram message.
 * Intentionally swallows errors to avoid breaking UX on network/CORS failures.
 */
export async function sendTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `📈 Kotak Savings Site | ${nowISTString()} IST\n${text}`,
        parse_mode: 'HTML',
      }),
    });
  } catch (_) {
    // no-op
  }
}
