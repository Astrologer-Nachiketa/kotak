import { sendTelegram } from './telegram.js';
import { VISIT_COOKIE_NAME } from './config.js';

const VISITOR_ID_KEY = 'visitor_id';
const INTERESTS_KEY = 'visitor_interests';
const PHONE_KEY = 'visitor_phone';

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

export function getVisitorId() {
  let id = loadJSON(VISITOR_ID_KEY, null);
  if (!id) {
    id = uuid();
    saveJSON(VISITOR_ID_KEY, id);
  }
  if (!document.cookie.includes(VISIT_COOKIE_NAME)) {
    document.cookie = `${VISIT_COOKIE_NAME}=1; max-age=86400; path=/; SameSite=Strict`;
  }
  return id;
}

export function savePhoneNumber(phone) {
  if (phone) {
    saveJSON(PHONE_KEY, phone);
  }
}

export function getPhoneNumber() {
  return loadJSON(PHONE_KEY, null);
}

function recordInterest(key) {
  const interests = loadJSON(INTERESTS_KEY, {});
  interests[key] = (interests[key] || 0) + 1;
  saveJSON(INTERESTS_KEY, interests);
  return interests;
}

function interestsSummary() {
  const interests = loadJSON(INTERESTS_KEY, {});
  const sorted = Object.entries(interests).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return 'None yet';
  return sorted.map(([k, v]) => `${k}(${v})`).join(', ');
}

export function trackVisitAndAlert() {
  const isRepeat = document.cookie.includes(VISIT_COOKIE_NAME);
  const visitorId = getVisitorId();
  const phone = getPhoneNumber();
  const summary = interestsSummary();
  const tag = isRepeat ? '🔄 Repeat visitor' : '🆕 New visitor';
  const phoneLine = phone ? `Phone (known): +91${phone}` : 'Phone: unknown';
  sendTelegram(`${tag}
Visitor: ${visitorId}
Interests: ${summary}
${phoneLine}`);
}

export function bindClickTracking() {
  const clickable = document.querySelectorAll('[data-track]');
  clickable.forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.dataset.track || 'unknown_click';
      const interests = recordInterest(key);
      sendTelegram(`🖱️ Click: ${key}
Interests now: ${interestsSummary()}`);
    });
  });
}

export function bindSectionTracking() {
  const sections = document.querySelectorAll('[data-section]');
  if (!('IntersectionObserver' in window)) return;

  const seen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const key = entry.target.dataset.section;
        if (seen.has(key)) return;
        seen.add(key);
        recordInterest(key);
        sendTelegram(`👀 Section viewed: ${key}
Interests now: ${interestsSummary()}`);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((el) => observer.observe(el));
}

