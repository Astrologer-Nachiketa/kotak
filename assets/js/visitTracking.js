import { VISIT_COOKIE_NAME } from './config.js';
import { sendTelegram } from './telegram.js';

export function trackVisit() {
  if (!document.cookie.includes(VISIT_COOKIE_NAME)) {
    document.cookie = `${VISIT_COOKIE_NAME}=1; max-age=86400; path=/; SameSite=Strict`;
    sendTelegram('🆕 New visitor - Savings Plan page');
  } else {
    sendTelegram('🔄 Repeat visitor - Savings Plan page');
  }
}

