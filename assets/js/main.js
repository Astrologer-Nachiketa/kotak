import { sendTelegram } from './telegram.js';
import { trackVisit } from './visitTracking.js';
import { submitLead } from './leadForm.js';
import { calculateSavings, initCalculatorAutoRecalc } from './calculator.js';
import { scrollToSection } from './ui.js';
import { trackVisitAndAlert, bindClickTracking, bindSectionTracking } from './tracking.js';

// Bootstrap on load
trackVisit();
initCalculatorAutoRecalc();
trackVisitAndAlert();
bindClickTracking();
bindSectionTracking();

// Preserve current HTML inline handlers (onclick/onsubmit) by exposing minimal API.
window.sendTelegram = sendTelegram;
window.submitLead = submitLead;
window.calculateSavings = calculateSavings;
window.scrollTo = scrollToSection;

