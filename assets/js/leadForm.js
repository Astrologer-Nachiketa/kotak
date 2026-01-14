import { sendTelegram } from './telegram.js';
import { savePhoneNumber } from './tracking.js';

export function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(String(phone).trim());
}

export function submitLead(e) {
  e.preventDefault();

  const input = document.getElementById('lead-phone');
  const phone = input ? input.value : '';

  if (isValidIndianMobile(phone)) {
    savePhoneNumber(phone);
    sendTelegram(`🚀 NEW LEAD!\nPhone: +91${phone}\nSource: Savings Portal CTA`);
    alert('✅ Success! Expert callback in 30 mins.');
    e.target.reset();
  } else {
    alert('Valid 10-digit mobile required');
    if (input) input.focus();
  }
}

