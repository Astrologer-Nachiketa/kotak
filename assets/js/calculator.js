import { sendTelegram } from './telegram.js';

function numberOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function calculateSavingsValues({ monthly, payYears, totalYears }) {
  const totalPremium = monthly * 12 * payYears;
  const investYears = Math.max(0, totalYears - payYears);

  // Calibrated so that with payYears=10 and totalYears=20, the factor is ~2.64.
  const assumedAnnualGrowth = 0.07;
  const baseMultiplier = 1.34; // 1.34 * (1.07^10) ≈ 2.64

  const maturity = Math.round(
    totalPremium * baseMultiplier * Math.pow(1 + assumedAnnualGrowth, investYears),
  );
  const deathBenefit = Math.round(maturity * 1.1);

  return { totalPremium, investYears, maturity, deathBenefit };
}

export function calculateSavings() {
  const monthly = numberOr(document.getElementById('monthly-prem')?.value, 10000);
  const payYears = numberOr(document.getElementById('pay-years')?.value, 10);
  const totalYears = numberOr(document.getElementById('total-term')?.value, 20);

  const { maturity, deathBenefit } = calculateSavingsValues({ monthly, payYears, totalYears });

  const maturityEl = document.getElementById('maturity-val');
  const deathEl = document.getElementById('death-val');
  const resultEl = document.getElementById('calc-result');

  if (maturityEl) maturityEl.textContent = `₹${(maturity / 100000).toFixed(1)}L`;
  if (deathEl) deathEl.textContent = `Life Cover up to ₹${(deathBenefit / 100000).toFixed(1)}L`;
  if (resultEl) resultEl.classList.remove('hidden');

  sendTelegram(`🧮 Calculator: ₹${monthly.toLocaleString()}/mo x ${payYears}yr → Maturity ₹${(maturity / 100000).toFixed(1)}L`);
}

export function initCalculatorAutoRecalc() {
  const resultEl = document.getElementById('calc-result');
  if (!resultEl) return;

  const payYearsEl = document.getElementById('pay-years');
  const totalTermEl = document.getElementById('total-term');

  const updatePayYearsLabel = (e) => {
    const label = document.getElementById('pay-val');
    if (label) label.textContent = e.target.value;
  };
  const updateTotalTermLabel = (e) => {
    const label = document.getElementById('term-val');
    if (label) label.textContent = e.target.value;
  };
  const recalcIfVisible = () => {
    if (!resultEl.classList.contains('hidden')) calculateSavings();
  };

  if (payYearsEl) {
    payYearsEl.addEventListener('input', (e) => {
      updatePayYearsLabel(e);
      recalcIfVisible();
    });
  }
  if (totalTermEl) {
    totalTermEl.addEventListener('input', (e) => {
      updateTotalTermLabel(e);
      recalcIfVisible();
    });
  }
}

