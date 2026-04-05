<script setup>
import { ref, computed } from 'vue'

const TIERS = [
  { id: 'S', label: 'S — JACKPOT', color: '#16a34a', desc: 'Highest payouts — elite multiplier, strong COLA, early retirement, protected by law' },
  { id: 'A', label: 'A — PREMIUM', color: '#0ea5e9', desc: 'Above-average returns — generous formula, real inflation protection, favorable retirement age' },
  { id: 'B', label: 'B — SOLID', color: '#8b5cf6', desc: 'Competitive pension with decent multiplier and some COLA — a good retirement foundation' },
  { id: 'C', label: 'C — AVERAGE', color: '#eab308', desc: 'Adequate but COLA gaps or benefit cuts dilute long-term value' },
  { id: 'D', label: 'D — THIN', color: '#f97316', desc: 'Low multiplier, no COLA, late retirement, or hybrid/DC dilution' },
]

const CRITERIA = [
  { key: 'mult', label: 'Multiplier', weight: '30%', desc: 'Benefit accrual rate — determines replacement rate at 30 years' },
  { key: 'cola', label: 'COLA', weight: '25%', desc: 'Lifetime inflation protection — compounding 3% doubles income over 24 years' },
  { key: 'cost', label: 'Employee Cost', weight: '15%', desc: 'What you pay in — lower is better relative to what you get' },
  { key: 'age', label: 'Retire Age', weight: '10%', desc: 'Earlier unreduced retirement = more years collecting benefits' },
  { key: 'prot', label: 'Legal Protection', weight: '10%', desc: 'Constitutional > Contract > Property > Gratuity' },
  { key: 'hlth', label: 'Retiree Health', weight: '10%', desc: 'Employer-subsidized health insurance in retirement' },
]

const GRADES = { S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 }

const STATES = [
  // S TIER
  { rank: 1, abbr: 'NV', name: 'Nevada', tier: 'S', multiplier: '2.50%', replace30: '75%', empContrib: '15%*', cola: '2% fixed compound', colaType: 'fixed', protection: 'Contract', retireAge: '55/65', ss: 'No', fas: '3 yr', vesting: '5 yr', health: 'Subsidy', grades: { mult: 'S', cola: 'A', cost: 'C', age: 'A', prot: 'B', hlth: 'B' }, notes: 'Highest general-employee multiplier in the nation. No SS — but you skip 6.2% payroll tax. 30 years = 75% for life. 2% compounding COLA. Police/fire unreduced at 55. No state income tax.' },
  { rank: 2, abbr: 'CA', name: 'California', tier: 'S', multiplier: '2.0–3.0%', replace30: '60–90%', empContrib: '7–8%', cola: 'CPI (2% cap)', colaType: 'cpi', protection: 'California Rule', retireAge: '50–62', ss: 'Partial', fas: '1–3 yr', vesting: '5 yr', health: 'PEMHCA', grades: { mult: 'S', cola: 'A', cost: 'A', age: 'S', prot: 'S', hlth: 'A' }, notes: 'Classic safety formulas (3%@50) = 90% at 30 years. Even PEPRA misc (2%@62) = 60%. California Rule locks your formula at hire. CPI COLA capped at 2%. PEMHCA retiree health. 80+ systems, 4.6M members.' },
  { rank: 3, abbr: 'IL', name: 'Illinois', tier: 'S', multiplier: '2.2%', replace30: '66%', empContrib: '4–9.5%', cola: '3% compound', colaType: 'fixed', protection: 'Constitutional', retireAge: '60–67', ss: 'Partial', fas: '4–8 yr', vesting: '10 yr', health: 'State subsidy', grades: { mult: 'A', cola: 'S', cost: 'A', age: 'C', prot: 'S', hlth: 'B' }, notes: 'The COLA king. 3% compounding COLA is constitutionally untouchable (Art. XIII §5). A $60K pension becomes $108K after 20 years. 2.2% = 66% at 30 years. Fund is 52% funded, but your benefits cannot be diminished — the state must find the money.' },
  { rank: 4, abbr: 'LA', name: 'Louisiana', tier: 'S', multiplier: '2.5–3.33%', replace30: '75–100%', empContrib: '8–10%', cola: 'Ad hoc (regular)', colaType: 'adhoc', protection: 'Constitutional', retireAge: '55–60', ss: 'Partial', fas: '3–5 yr', vesting: '5–10 yr', health: 'OGB', grades: { mult: 'S', cola: 'B', cost: 'B', age: 'A', prot: 'S', hlth: 'B' }, notes: 'Teachers at 2.5%, hazardous up to 3.33%. Constitutional protection (Art. X §29). #1 contribution adequacy — the state overpays its bills by 13.4%. Police/fire retire at 55 with 25 years.' },
  { rank: 5, abbr: 'OH', name: 'Ohio', tier: 'S', multiplier: '2.2%', replace30: '66%', empContrib: '10%', cola: 'CPI (3% cap)', colaType: 'cpi', protection: 'Property', retireAge: '55–60', ss: 'No', fas: '3–5 yr', vesting: '5 yr', health: 'Plan-provided', grades: { mult: 'A', cola: 'A', cost: 'B', age: 'A', prot: 'B', hlth: 'A' }, notes: 'No SS saves you 6.2%. Net cost is ~3.8% above a private-sector worker. 2.2% multiplier, CPI COLA up to 3%, retiree health through the plan, five statewide systems. Police/fire retire at 48 with 25 years.' },
  { rank: 6, abbr: 'NM', name: 'New Mexico', tier: 'S', multiplier: '2.35–3.0%', replace30: '70–90%', empContrib: '7–10%', cola: 'CPI (2% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Partial', fas: '3–5 yr', vesting: '5 yr', health: 'RHCA', grades: { mult: 'S', cola: 'A', cost: 'B', age: 'A', prot: 'B', hlth: 'B' }, notes: 'PERA general at 2.35–3%, law enforcement at 3%. 30 years safety = 90%. CPI COLA at 2%. Rule of 80. Retiree Health Care Authority. Non-SS employees get enhanced formulas.' },

  // A TIER
  { rank: 7, abbr: 'MA', name: 'Massachusetts', tier: 'A', multiplier: '2.5%', replace30: '75%', empContrib: '9–12%', cola: '3% fixed', colaType: 'fixed', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '10 yr', health: 'GIC', grades: { mult: 'S', cola: 'A', cost: 'C', age: 'A', prot: 'B', hlth: 'A' }, notes: '2.5% = 75% at 30 years, plus SS stacks on top. 3% fixed COLA on first $13K. Group 4 (police/fire) retire at 55. Higher contributions but pension + SS can exceed 100% replacement.' },
  { rank: 8, abbr: 'MO', name: 'Missouri', tier: 'A', multiplier: '1.7–2.5%', replace30: '51–75%', empContrib: '4–6.5%', cola: 'CPI (5% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–62', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Varies', grades: { mult: 'A', cola: 'S', cost: 'A', age: 'A', prot: 'B', hlth: 'C' }, notes: 'CPI COLA with 5% cap — the most generous cap nationally. Low contributions (4–6.5%). Rule of 80. 3-year FAS. Plus SS. During high-inflation years, Missouri retirees are better protected than almost any state.' },
  { rank: 9, abbr: 'CO', name: 'Colorado', tier: 'A', multiplier: '2.5%', replace30: '75%', empContrib: '10.5%', cola: '1.25% fixed', colaType: 'fixed', protection: 'Contract', retireAge: '55–64', ss: 'Partial', fas: '3 yr', vesting: '5 yr', health: 'PERACare', grades: { mult: 'S', cola: 'C', cost: 'C', age: 'A', prot: 'B', hlth: 'B' }, notes: '2.5% = 75% at 30 years — excellent base. COLA slashed from 3.5% to 1.25% in 2018 SB 200 reform. 3-year FAS. Rule of 65. PERACare retiree health. Non-SS for many school employees.' },
  { rank: 10, abbr: 'NY', name: 'New York', tier: 'A', multiplier: '1.67–2.0%', replace30: '50–60%', empContrib: '3–6%', cola: '1–1.5% fixed', colaType: 'fixed', protection: 'Constitutional', retireAge: '55–63', ss: 'Partial', fas: '3–5 yr', vesting: '5–10 yr', health: 'NYSHIP', grades: { mult: 'B', cola: 'C', cost: 'S', age: 'A', prot: 'S', hlth: 'S' }, notes: 'Lower multiplier but: constitutional protection, contributions drop to 0% after 10 years (Tier 6), NYSHIP retiree health worth $15–25K/yr. Police/fire plans historically 50% at 20 years. 7 systems. Taylor Law collective bargaining.' },
  { rank: 11, abbr: 'OR', name: 'Oregon', tier: 'A', multiplier: '1.5–1.67%', replace30: '45–50%', empContrib: '6%', cola: 'CPI (2% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'No', fas: '3 yr', vesting: '5 yr', health: 'RHIA/RHIPA', grades: { mult: 'B', cola: 'A', cost: 'A', age: 'B', prot: 'A', hlth: 'B' }, notes: 'No SS (save 6.2%), IAP individual account on top of DB, CPI COLA at 2%, only 6% contribution, retiree health subsidies. Oregon courts are the most aggressive defending pension contracts.' },
  { rank: 12, abbr: 'AZ', name: 'Arizona', tier: 'A', multiplier: '2.1–2.35%', replace30: '63–70%', empContrib: '7–12%', cola: 'Plan-linked', colaType: 'linked', protection: 'Constitutional', retireAge: '52–65', ss: 'Yes', fas: '3–5 yr', vesting: '5–10 yr', health: 'Varies', grades: { mult: 'A', cola: 'B', cost: 'B', age: 'A', prot: 'S', hlth: 'C' }, notes: 'Constitutional pension protection. ASRS general 2.1%, PSPRS safety 2.35%. Plus SS. Rule of 80. Variable COLA from excess returns. Public safety retire at 52.5 with 25 years.' },
  { rank: 13, abbr: 'WA', name: 'Washington', tier: 'A', multiplier: '2.0%', replace30: '60%', empContrib: '6–7%', cola: 'Plan-linked', colaType: 'linked', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '5 yr', health: 'PEBB', grades: { mult: 'A', cola: 'B', cost: 'A', age: 'B', prot: 'A', hlth: 'B' }, notes: '2% = 60% at 30, plus SS. 103% funded — second most secure promise in America. Variable COLA. No state income tax. LEOFF Plan 2 safety gets employer-paid retiree health.' },
  { rank: 14, abbr: 'AR', name: 'Arkansas', tier: 'A', multiplier: '2.0–2.07%', replace30: '60–62%', empContrib: '5–6.5%', cola: '3% fixed compound', colaType: 'fixed', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3–5 yr', vesting: '5 yr', health: 'Varies', grades: { mult: 'A', cola: 'S', cost: 'A', age: 'B', prot: 'B', hlth: 'C' }, notes: 'The sleeper pick. 2% multiplier + 3% fixed compounding COLA (same type Illinois has) + SS + low 5–6.5% contribution. Low cost of living. 83% funded. The COLA alone makes this A-tier.' },
  { rank: 15, abbr: 'HI', name: 'Hawaii', tier: 'A', multiplier: '1.25–2.0%', replace30: '38–60%', empContrib: '6–8%', cola: '2.5% fixed compound', colaType: 'fixed', protection: 'Constitutional', retireAge: '55–62', ss: 'Yes', fas: '3 yr', vesting: '5–10 yr', health: 'EUTF', grades: { mult: 'B', cola: 'S', cost: 'A', age: 'A', prot: 'S', hlth: 'A' }, notes: 'Constitutional protection. 2.5% fixed compounding COLA — one of the highest guaranteed rates. Safety at 2.0% = 60% + SS. EUTF retiree health. The COLA + protection combo adds massive lifetime value.' },

  // B TIER
  { rank: 16, abbr: 'TN', name: 'Tennessee', tier: 'B', multiplier: '1.5–2.5%', replace30: '45–75%', empContrib: '5%', cola: 'Ad hoc (regular)', colaType: 'adhoc', protection: 'Contract', retireAge: '55–60', ss: 'Yes', fas: '5 yr', vesting: '5 yr', health: 'Varies', grades: { mult: 'B', cola: 'B', cost: 'A', age: 'A', prot: 'B', hlth: 'C' }, notes: '104% funded — most secure promise in America. Legacy 2.5%, current hybrid 1.5% DB + DC. Very low 5% contribution. Ad hoc COLAs regularly granted. Plus SS.' },
  { rank: 17, abbr: 'SD', name: 'South Dakota', tier: 'B', multiplier: '1.7–2.4%', replace30: '51–72%', empContrib: '6%', cola: 'Variable', colaType: 'linked', protection: 'Property', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '3 yr', health: 'None', grades: { mult: 'B', cola: 'B', cost: 'A', age: 'B', prot: 'B', hlth: 'D' }, notes: '100% funded. Variable COLA (positive or negative). Low 6% contribution. 3-year FAS and vesting. Plus SS. No retiree health.' },
  { rank: 18, abbr: 'WI', name: 'Wisconsin', tier: 'B', multiplier: '1.6%', replace30: '48%', empContrib: '6.9%', cola: 'Variable', colaType: 'linked', protection: 'Property', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Varies', grades: { mult: 'C', cola: 'B', cost: 'A', age: 'B', prot: 'B', hlth: 'C' }, notes: 'Unique risk-sharing — benefits adjust with fund performance. 1.6% base = 48% at 30 but annuity adjustments can push higher. 98% funded. Plus SS.' },
  { rank: 19, abbr: 'DC', name: 'D.C. / Federal', tier: 'B', multiplier: '1.0–1.7%', replace30: '30–51%', empContrib: '0.8–4.4%', cola: 'CPI (FERS partial)', colaType: 'cpi', protection: 'Federal statute', retireAge: '55–62', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'FEHB', grades: { mult: 'C', cola: 'A', cost: 'S', age: 'B', prot: 'A', hlth: 'S' }, notes: 'FERS three-legged stool: pension (1.0–1.1% multiplier) + TSP (5% match = free money) + Social Security. The multiplier looks low but TSP match + SS stacking + FEHB retiree health is the total package. FERS COLA = CPI minus 1% if CPI > 2%. CSRS legacy at 1.5–1.7% with full CPI COLA is excellent. DCRB local police/fire/teachers at 2.0–2.5%. FEHB is the gold standard of retiree health — you keep your federal insurance for life.' },
  { rank: 20, abbr: 'NC', name: 'North Carolina', tier: 'B', multiplier: '1.82%', replace30: '55%', empContrib: '6%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '4 yr', vesting: '5 yr', health: 'SHP subsidy', grades: { mult: 'B', cola: 'C', cost: 'A', age: 'B', prot: 'B', hlth: 'B' }, notes: '1.82% = 55% at 30. Low 6% contribution. 93% funded. Plus SS. Ad hoc COLA only. State Health Plan subsidy for 20+ year retirees.' },
  { rank: 21, abbr: 'GA', name: 'Georgia', tier: 'B', multiplier: '2.0%', replace30: '60%', empContrib: '1.5–6%', cola: '1.5% fixed', colaType: 'fixed', protection: 'Contract', retireAge: '60–65', ss: 'Yes', fas: '2 yr', vesting: '10 yr', health: 'Varies', grades: { mult: 'A', cola: 'C', cost: 'S', age: 'D', prot: 'B', hlth: 'C' }, notes: '2% = 60%. Very low contribution (1.5% for newer ERS). 1.5% fixed COLA. 2-year FAS (favorable). Plus SS. 81% funded. Catch: retirement at 60+ and 10-year vesting.' },
  { rank: 22, abbr: 'MN', name: 'Minnesota', tier: 'B', multiplier: '1.7–1.9%', replace30: '51–57%', empContrib: '6–11%', cola: 'CPI (2.5% cap)', colaType: 'cpi', protection: 'Unique', retireAge: '55–66', ss: 'Yes', fas: '5 yr', vesting: '3–5 yr', health: 'Varies', grades: { mult: 'B', cola: 'A', cost: 'B', age: 'B', prot: 'B', hlth: 'C' }, notes: 'Recently bumped to 1.9% for post-2025. CPI COLA with 2.5% cap. Plus SS. Strong unions. Rule of 90. 3-year vesting for PERA.' },
  { rank: 23, abbr: 'NE', name: 'Nebraska', tier: 'B', multiplier: '2.0–2.4%', replace30: '60–72%', empContrib: '4.8–9.8%', cola: 'None/ad hoc', colaType: 'none', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'None', grades: { mult: 'A', cola: 'D', cost: 'B', age: 'B', prot: 'B', hlth: 'D' }, notes: 'Good multiplier (2.0–2.4%). 92% funded. Plus SS. But essentially zero COLA — purchasing power drops ~45% over 20 years. No retiree health.' },
  { rank: 24, abbr: 'ME', name: 'Maine', tier: 'B', multiplier: '2.0%', replace30: '60%', empContrib: '7.65%', cola: 'CPI (3% cap)', colaType: 'cpi', protection: 'Property', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Group rate', grades: { mult: 'A', cola: 'A', cost: 'B', age: 'B', prot: 'B', hlth: 'C' }, notes: '2% = 60%. CPI COLA with 3% cap — solid inflation protection. Plus SS. 88% funded. #3 contribution adequacy. Rule of 80 for teachers.' },
  { rank: 25, abbr: 'IA', name: 'Iowa', tier: 'B', multiplier: '2.0%', replace30: '60%', empContrib: '6.29%', cola: 'Dividend-based', colaType: 'linked', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'None', grades: { mult: 'A', cola: 'B', cost: 'A', age: 'B', prot: 'B', hlth: 'D' }, notes: '2% = 60%. Unique dividend COLA — retirees share outperformance. Low 6.29% contribution. 89% funded. Plus SS. Rule of 88. No retiree health.' },
  { rank: 26, abbr: 'WV', name: 'West Virginia', tier: 'B', multiplier: '2.0%', replace30: '60%', empContrib: '4.5–6%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '55–62', ss: 'Yes', fas: '3–5 yr', vesting: '5 yr', health: 'RHBT', grades: { mult: 'A', cola: 'C', cost: 'A', age: 'A', prot: 'B', hlth: 'B' }, notes: '2% multiplier. Very low 4.5% for teachers. 89% funded (up from 40% in 2003). Plus SS. RHBT retiree health. Ad hoc COLA only.' },
  { rank: 27, abbr: 'DE', name: 'Delaware', tier: 'B', multiplier: '2.0%', replace30: '60%', empContrib: '3–5%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '55–62', ss: 'Yes', fas: '3–5 yr', vesting: '5 yr', health: 'Group rate', grades: { mult: 'A', cola: 'C', cost: 'S', age: 'A', prot: 'B', hlth: 'C' }, notes: '2% = 60%. Very low 3% contribution. 90% funded. Plus SS. Ad hoc COLA. Small, simple system.' },
  { rank: 28, abbr: 'VA', name: 'Virginia', tier: 'B', multiplier: '1.7%', replace30: '51%', empContrib: '5%', cola: 'CPI (varies)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Credit program', grades: { mult: 'B', cola: 'B', cost: 'A', age: 'B', prot: 'B', hlth: 'C' }, notes: '1.7% = 51% at 30. Low 5% contribution. CPI COLA. 88% funded. Plus SS. Hybrid since 2014 (DB+DC). Health insurance credit for retirees.' },
  { rank: 29, abbr: 'ID', name: 'Idaho', tier: 'B', multiplier: '2.0–2.3%', replace30: '60–69%', empContrib: '7.12%', cola: 'CPI (1%)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'None', grades: { mult: 'A', cola: 'D', cost: 'B', age: 'B', prot: 'B', hlth: 'D' }, notes: '2.0–2.3% multiplier. 91% funded. CPI COLA capped at only 1% — very weak. Plus SS. Rule of 90. No retiree health.' },
  { rank: 30, abbr: 'UT', name: 'Utah', tier: 'B', multiplier: '1.5–2.0%', replace30: '45–60%', empContrib: '0%*', cola: 'CPI (2.5% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '4 yr', health: 'None', grades: { mult: 'B', cola: 'A', cost: 'S', age: 'B', prot: 'B', hlth: 'D' }, notes: 'Employer pays full contribution for many = $0 cost to you. CPI COLA 2.5% cap. Plus SS. 90% funded. Post-2011 hires: hybrid/DC option shifts risk to you.' },

  // C TIER
  { rank: 31, abbr: 'TX', name: 'Texas', tier: 'C', multiplier: '2.0–2.3%', replace30: '60–69%', empContrib: '8–9.5%', cola: 'None (ad hoc)', colaType: 'none', protection: 'Gratuity', retireAge: '55–65', ss: 'Partial', fas: '3–5 yr', vesting: '5 yr', health: 'GBP (limited)', grades: { mult: 'A', cola: 'D', cost: 'C', age: 'B', prot: 'D', hlth: 'D' }, notes: 'Multiplier looks strong but fatal flaws: zero COLA (a $60K pension = $33K real after 20 years), benefits are "gratuity" (weakest protection), no collective bargaining. 93+ fragmented systems.' },
  { rank: 32, abbr: 'FL', name: 'Florida', tier: 'C', multiplier: '1.6–3.0%', replace30: '48–90%', empContrib: '3%', cola: 'None (frozen)', colaType: 'none', protection: 'Contract', retireAge: '60–65', ss: 'Yes', fas: '5–8 yr', vesting: '8 yr', health: 'HIS ($5/mo/yr)', grades: { mult: 'B', cola: 'D', cost: 'S', age: 'D', prot: 'B', hlth: 'D' }, notes: 'General 1.6% = 48%, Special Risk 3.0% = 90%. Very low 3% contribution. COLA frozen since 2011 — the defining flaw. Plus SS. No income tax. DROP adds value. 8-year vesting.' },
  { rank: 33, abbr: 'PA', name: 'Pennsylvania', tier: 'C', multiplier: '2.0–2.5%', replace30: '60–75%', empContrib: '5–7.5%', cola: 'None', colaType: 'none', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5–10 yr', health: 'Group rate', grades: { mult: 'A', cola: 'D', cost: 'B', age: 'B', prot: 'B', hlth: 'C' }, notes: 'Legacy multipliers good (2.0–2.5%) but zero COLA. 66% funded = risk. New hires since 2019 in hybrid. 3-year FAS. Plus SS.' },
  { rank: 34, abbr: 'MD', name: 'Maryland', tier: 'C', multiplier: '1.2–1.8%', replace30: '36–54%', empContrib: '7%', cola: 'CPI (2.5% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3–5 yr', vesting: '5–10 yr', health: 'State subsidy', grades: { mult: 'C', cola: 'A', cost: 'B', age: 'B', prot: 'B', hlth: 'B' }, notes: 'Lower multiplier (1.2% reformed) with 7% contribution = mediocre return. CPI COLA 2.5% cap helps. Plus SS. Worst investment performance nationally.' },
  { rank: 35, abbr: 'KS', name: 'Kansas', tier: 'C', multiplier: '1.85%', replace30: '56%', empContrib: '6%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '5 yr', health: 'Group rate', grades: { mult: 'B', cola: 'C', cost: 'A', age: 'B', prot: 'B', hlth: 'C' }, notes: '1.85% = 56%. Low 6% contribution. #1 investment performance. Ad hoc COLA. Tier 3 = cash balance for new hires.' },
  { rank: 36, abbr: 'NH', name: 'New Hampshire', tier: 'C', multiplier: '1.5–2.5%', replace30: '45–75%', empContrib: '7%', cola: 'CPI (1.5% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '10 yr', health: 'Medical subsidy', grades: { mult: 'B', cola: 'C', cost: 'B', age: 'B', prot: 'B', hlth: 'B' }, notes: 'General 1.5%, safety 2.5%. CPI COLA at 1.5% cap — low. 10-year vesting. Plus SS.' },
  { rank: 37, abbr: 'OK', name: 'Oklahoma', tier: 'C', multiplier: '2.0%', replace30: '60%', empContrib: '3.5–8.5%', cola: 'None/ad hoc', colaType: 'none', protection: 'Contract', retireAge: '55–62', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Varies', grades: { mult: 'A', cola: 'D', cost: 'A', age: 'A', prot: 'B', hlth: 'C' }, notes: '2% = 60%. Teacher contribution as low as 3.5%. Plus SS. But no COLA. 74% funded. 3-year FAS.' },
  { rank: 38, abbr: 'WY', name: 'Wyoming', tier: 'C', multiplier: '2.125%', replace30: '64%', empContrib: '9.94%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Property', retireAge: '55–60', ss: 'Yes', fas: '3 yr', vesting: '4 yr', health: 'None', grades: { mult: 'A', cola: 'C', cost: 'C', age: 'A', prot: 'B', hlth: 'D' }, notes: '2.125% = 64%. But 9.94% contribution is high. Ad hoc COLA. No retiree health. No state income tax. Plus SS. Rule of 85.' },
  { rank: 39, abbr: 'ND', name: 'North Dakota', tier: 'C', multiplier: '2.0%', replace30: '60%', empContrib: '7%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3–5 yr', vesting: '5 yr', health: 'None', grades: { mult: 'A', cola: 'C', cost: 'B', age: 'B', prot: 'B', hlth: 'D' }, notes: '2% = 60%. Plus SS. No COLA. 76% funded. 7% contribution. Rule of 85. Small system.' },
  { rank: 40, abbr: 'VT', name: 'Vermont', tier: 'C', multiplier: '1.25–1.67%', replace30: '38–50%', empContrib: '5.5–6.65%', cola: 'CPI (5% cap)', colaType: 'cpi', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'Group rate', grades: { mult: 'C', cola: 'S', cost: 'A', age: 'B', prot: 'B', hlth: 'C' }, notes: 'Low multiplier (1.25% general). But CPI COLA with 5% cap — most generous cap in the country. The COLA adds huge lifetime value to a modest base. Plus SS.' },
  { rank: 41, abbr: 'SC', name: 'South Carolina', tier: 'C', multiplier: '1.82%', replace30: '55%', empContrib: '9%', cola: 'None (rarely)', colaType: 'none', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '8 yr', health: 'None', grades: { mult: 'B', cola: 'D', cost: 'C', age: 'B', prot: 'B', hlth: 'D' }, notes: '1.82% = 55%. Higher 9% contribution. Zero COLA. 67% funded. 8-year vesting. You pay 9% for 55% with no inflation protection.' },
  { rank: 42, abbr: 'AL', name: 'Alabama', tier: 'C', multiplier: '2.0125%', replace30: '60%', empContrib: '5–8.5%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Contract', retireAge: '56–62', ss: 'Yes', fas: '3 yr', vesting: '10 yr', health: 'PEEHIP', grades: { mult: 'A', cola: 'C', cost: 'B', age: 'C', prot: 'B', hlth: 'B' }, notes: '2.0125% = 60%. Ad hoc COLA. Plus SS. Tier 2 raised retirement to 62 with 10-year vesting. Lowest probability of meeting return assumptions (44%). PEEHIP retiree health is a plus.' },
  { rank: 43, abbr: 'MT', name: 'Montana', tier: 'C', multiplier: '1.785%', replace30: '54%', empContrib: '7.9%', cola: '0.5% fixed', colaType: 'fixed', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5 yr', health: 'None', grades: { mult: 'B', cola: 'D', cost: 'B', age: 'B', prot: 'B', hlth: 'D' }, notes: '1.785% = 54%. 0.5% COLA is virtually nothing — your pension loses real value every year. 7.9% contribution. Plus SS. No retiree health.' },
  { rank: 44, abbr: 'MS', name: 'Mississippi', tier: 'C', multiplier: '2.0%', replace30: '60%', empContrib: '9%', cola: '3% fixed', colaType: 'fixed', protection: 'Contract', retireAge: '60–65', ss: 'Yes', fas: '4 yr', vesting: '8 yr', health: 'Group rate', grades: { mult: 'A', cola: 'A', cost: 'C', age: 'D', prot: 'B', hlth: 'C' }, notes: '2% + 3% COLA looks great on paper. But: 57% funded (distressed), worst contribution adequacy, 9% contribution, 8-year vesting, retirement at 60+. Generous COLA is draining the fund. High reform risk.' },
  { rank: 45, abbr: 'RI', name: 'Rhode Island', tier: 'C', multiplier: '1.0–1.6%', replace30: '30–48%', empContrib: '3.75%', cola: 'Suspended', colaType: 'none', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '5 yr', health: 'State plan', grades: { mult: 'D', cola: 'D', cost: 'A', age: 'B', prot: 'B', hlth: 'B' }, notes: '2011 reforms gutted benefits. New hires: 1.0% DB + DC hybrid. COLA suspended until 80% funded. Low 3.75% contribution reflects reduced benefit. Plus SS. 68% funded.' },

  // D TIER
  { rank: 46, abbr: 'NJ', name: 'New Jersey', tier: 'D', multiplier: '1.67%', replace30: '50%', empContrib: '7.5%', cola: 'Suspended', colaType: 'none', protection: 'Contract', retireAge: '60–65', ss: 'Yes', fas: '5 yr', vesting: '10 yr', health: 'SHBP', grades: { mult: 'C', cola: 'D', cost: 'B', age: 'D', prot: 'B', hlth: 'A' }, notes: '1.67% = 50%. COLA suspended since 2011. 55% funded. 10-year vesting. Plus SS. SHBP retiree health is valuable but under pressure.' },
  { rank: 47, abbr: 'KY', name: 'Kentucky', tier: 'D', multiplier: '1.97–2.5%', replace30: '59–75%', empContrib: '5–6%', cola: 'Suspended', colaType: 'none', protection: 'Contract', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '5 yr', health: 'State plan', grades: { mult: 'A', cola: 'D', cost: 'A', age: 'B', prot: 'B', hlth: 'B' }, notes: 'Legacy multipliers look good but: COLA suspended, 54% funded, new hires get cash balance. 20 years of political dysfunction.' },
  { rank: 48, abbr: 'AK', name: 'Alaska', tier: 'D', multiplier: 'DC only*', replace30: 'N/A', empContrib: '8%', cola: 'N/A', colaType: 'none', protection: 'Constitutional*', retireAge: 'Varies', ss: 'No', fas: 'N/A', vesting: '5 yr', health: 'Varies', grades: { mult: 'D', cola: 'D', cost: 'B', age: 'C', prot: 'B', hlth: 'C' }, notes: 'DB closed in 2006 — new hires get DC only. No Social Security for most. Worst combo: no pension AND no SS. Legacy DB at 2% + CPI COLA + constitutional protection is excellent, but new hires are on their own.' },
  { rank: 49, abbr: 'IN', name: 'Indiana', tier: 'D', multiplier: '1.1%', replace30: '33%', empContrib: '3%', cola: 'Ad hoc', colaType: 'adhoc', protection: 'Gratuity', retireAge: '55–65', ss: 'Yes', fas: '5 yr', vesting: '10 yr', health: 'None', grades: { mult: 'D', cola: 'C', cost: 'A', age: 'B', prot: 'D', hlth: 'D' }, notes: '1.1% = 33% — among the lowest in America. Pension is supplementary. Benefits classified as "gratuity." 10-year vesting. No retiree health. SS does the heavy lifting.' },
  { rank: 50, abbr: 'MI', name: 'Michigan', tier: 'D', multiplier: '1.5%*', replace30: '45%*', empContrib: '4–7%', cola: 'Fixed (varies)', colaType: 'fixed', protection: 'Constitutional', retireAge: '55–60', ss: 'Yes', fas: '3–5 yr', vesting: '10 yr', health: 'Stipend', grades: { mult: 'C', cola: 'C', cost: 'A', age: 'A', prot: 'S', hlth: 'C' }, notes: 'DB closed to most new state/school employees — DC or hybrid with minimal DB. Legacy 1.5% = 45%. Constitutional protection for DB members. Best probability of meeting returns (68%). Trend is away from pensions.' },
  { rank: 51, abbr: 'CT', name: 'Connecticut', tier: 'D', multiplier: '1.33–2.0%', replace30: '40–60%', empContrib: '2–5%', cola: 'Fixed (reduced)', colaType: 'fixed', protection: 'Property', retireAge: '55–65', ss: 'Yes', fas: '3 yr', vesting: '5–10 yr', health: 'State plan', grades: { mult: 'C', cola: 'C', cost: 'S', age: 'B', prot: 'B', hlth: 'B' }, notes: 'Newer tier at 1.33% = 40%. COLA reduced. 62% funded. Aggressive paydown (+10.1%) is encouraging. Teachers plan slightly better. Plus SS.' },
]

const selectedTier = ref(null)
const expanded = ref(null)
const sortBy = ref('tier')
const search = ref('')

const colaLabels = { fixed: 'Fixed', cpi: 'CPI-linked', linked: 'Plan-linked', adhoc: 'Ad hoc', none: 'None/Suspended' }
const colaColors = { fixed: '#0ea5e9', cpi: '#16a34a', linked: '#8b5cf6', adhoc: '#eab308', none: '#ef4444' }
const gradeColors = { S: '#16a34a', A: '#0ea5e9', B: '#8b5cf6', C: '#eab308', D: '#f97316', F: '#ef4444' }

const filtered = computed(() => {
  let r = STATES
  if (selectedTier.value) r = r.filter(s => s.tier === selectedTier.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter(s => s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q))
  }
  if (sortBy.value === 'replace') {
    r = [...r].sort((a, b) => {
      const av = parseInt(String(a.replace30).replace(/[^0-9–]/g, '').split('–').pop()) || 0
      const bv = parseInt(String(b.replace30).replace(/[^0-9–]/g, '').split('–').pop()) || 0
      return bv - av
    })
  }
  return r
})

const tierCounts = computed(() => {
  const c = {}; TIERS.forEach(t => c[t.id] = 0)
  STATES.forEach(s => { if (c[s.tier] !== undefined) c[s.tier]++ })
  return c
})

function tierColor(id) { return TIERS.find(t => t.id === id)?.color || '#888' }
function toggle(abbr) { expanded.value = expanded.value === abbr ? null : abbr }
</script>

<template>
  <!-- Criteria (collapsible) -->
  <details class="pr-criteria">
    <summary class="pr-criteria-toggle">Scoring Criteria</summary>
    <div class="pr-criteria-grid">
      <div v-for="c in CRITERIA" :key="c.key" class="pr-crit-item">
        <div class="pr-crit-head"><span class="pr-crit-label">{{ c.label }}</span><span class="pr-crit-weight">{{ c.weight }}</span></div>
        <div class="pr-crit-desc">{{ c.desc }}</div>
      </div>
    </div>
    <p class="pr-crit-note">Each state receives a letter grade (S/A/B/C/D) per criterion. Grades are weighted and combined to determine tier placement. <a href="./pension-power-rankings-methodology">Full methodology →</a></p>
  </details>

  <!-- Filters -->
  <div class="pr-filters">
    <div class="pr-tier-chips">
      <button :class="['pr-chip', { 'pr-chip-on': !selectedTier }]" @click="selectedTier = null">All ({{ STATES.length }})</button>
      <button v-for="t in TIERS" :key="t.id"
        :class="['pr-chip', { 'pr-chip-on': selectedTier === t.id }]"
        :style="{ color: t.color, borderColor: selectedTier === t.id ? t.color : 'transparent' }"
        @click="selectedTier = selectedTier === t.id ? null : t.id">
        {{ t.id }} ({{ tierCounts[t.id] }})
      </button>
    </div>
    <div class="pr-controls">
      <input v-model="search" class="pr-search" placeholder="Search state..." />
      <button :class="['pr-sort', { 'pr-sort-on': sortBy === 'tier' }]" @click="sortBy = 'tier'">By Tier</button>
      <button :class="['pr-sort', { 'pr-sort-on': sortBy === 'replace' }]" @click="sortBy = 'replace'">By Payout</button>
      <span class="pr-updated">Updated Apr 2026</span>
    </div>
  </div>

  <!-- Rankings -->
  <template v-if="sortBy === 'tier' && !selectedTier">
    <div v-for="tier in TIERS" :key="tier.id" class="pr-tier-section">
      <template v-if="filtered.filter(s => s.tier === tier.id).length">
        <div class="pr-tier-header" :style="{ borderLeftColor: tier.color }">
          <span class="pr-tier-badge" :style="{ color: tier.color }">{{ tier.id }}</span>
          <div style="flex:1">
            <strong :style="{ color: tier.color }">{{ tier.label }}</strong>
            <div class="pr-tier-desc">{{ tier.desc }}</div>
          </div>
          <span class="pr-col-header">Salary Replaced<br/>after 30 yrs</span>
        </div>
        <div v-for="s in filtered.filter(st => st.tier === tier.id)" :key="s.abbr" class="pr-card" @click="toggle(s.abbr)">
          <div class="pr-card-row">
            <span class="pr-rank">#{{ s.rank }}</span>
            <span class="pr-abbr" :style="{ color: tierColor(s.tier), borderColor: tierColor(s.tier) + '50' }">{{ s.abbr }}</span>
            <div class="pr-card-info">
              <div class="pr-card-name">{{ s.name }}</div>
              <div class="pr-card-meta">
                <span>×{{ s.multiplier }}</span>
                <span :style="{ color: colaColors[s.colaType] }">{{ colaLabels[s.colaType] }}</span>
                <span>EE: {{ s.empContrib }}</span>
              </div>
            </div>
            <span class="pr-replace" :style="{ color: tierColor(s.tier) }">{{ s.replace30 }}</span>
          </div>
          <!-- Expanded detail -->
          <div v-if="expanded === s.abbr" class="pr-detail">
            <div class="pr-grades">
              <div v-for="c in CRITERIA" :key="c.key" class="pr-grade-item">
                <span class="pr-grade-label">{{ c.label }}</span>
                <span class="pr-grade-badge" :style="{ background: gradeColors[s.grades[c.key]] + '20', color: gradeColors[s.grades[c.key]] }">{{ s.grades[c.key] }}</span>
              </div>
            </div>
            <div class="pr-stats">
              <div><span>Multiplier</span><strong>{{ s.multiplier }}</strong></div>
              <div><span>30-Yr Replace</span><strong :style="{color: tierColor(s.tier)}">{{ s.replace30 }}</strong></div>
              <div><span>You Pay</span><strong>{{ s.empContrib }}</strong></div>
              <div><span>COLA</span><strong :style="{color: colaColors[s.colaType]}">{{ s.cola }}</strong></div>
              <div><span>Retire Age</span><strong>{{ s.retireAge }}</strong></div>
              <div><span>Vesting</span><strong>{{ s.vesting }}</strong></div>
              <div><span>FAS Period</span><strong>{{ s.fas }}</strong></div>
              <div><span>Social Security</span><strong>{{ s.ss }}</strong></div>
              <div><span>Protection</span><strong>{{ s.protection }}</strong></div>
              <div><span>Retiree Health</span><strong>{{ s.health }}</strong></div>
            </div>
            <p class="pr-notes">{{ s.notes }}</p>
          </div>
        </div>
      </template>
    </div>
  </template>
  <template v-else>
    <div class="pr-flat-header">
      <span class="pr-col-header" style="margin-left:auto">Salary Replaced after 30 yrs</span>
    </div>
    <div v-for="s in filtered" :key="s.abbr" class="pr-card" @click="toggle(s.abbr)">
      <div class="pr-card-row">
        <span class="pr-rank">#{{ s.rank }}</span>
        <span class="pr-abbr" :style="{ color: tierColor(s.tier), borderColor: tierColor(s.tier) + '50' }">{{ s.abbr }}</span>
        <div class="pr-card-info">
          <div class="pr-card-name">{{ s.name }}</div>
          <div class="pr-card-meta">
            <span>×{{ s.multiplier }}</span>
            <span :style="{ color: colaColors[s.colaType] }">{{ colaLabels[s.colaType] }}</span>
            <span>EE: {{ s.empContrib }}</span>
          </div>
        </div>
        <span class="pr-replace" :style="{ color: tierColor(s.tier) }">{{ s.replace30 }}</span>
      </div>
      <div v-if="expanded === s.abbr" class="pr-detail">
        <div class="pr-grades">
          <div v-for="c in CRITERIA" :key="c.key" class="pr-grade-item">
            <span class="pr-grade-label">{{ c.label }}</span>
            <span class="pr-grade-badge" :style="{ background: gradeColors[s.grades[c.key]] + '20', color: gradeColors[s.grades[c.key]] }">{{ s.grades[c.key] }}</span>
          </div>
        </div>
        <div class="pr-stats">
          <div><span>Multiplier</span><strong>{{ s.multiplier }}</strong></div>
          <div><span>30-Yr Replace</span><strong :style="{color: tierColor(s.tier)}">{{ s.replace30 }}</strong></div>
          <div><span>You Pay</span><strong>{{ s.empContrib }}</strong></div>
          <div><span>COLA</span><strong :style="{color: colaColors[s.colaType]}">{{ s.cola }}</strong></div>
          <div><span>Retire Age</span><strong>{{ s.retireAge }}</strong></div>
          <div><span>Vesting</span><strong>{{ s.vesting }}</strong></div>
          <div><span>FAS Period</span><strong>{{ s.fas }}</strong></div>
          <div><span>Social Security</span><strong>{{ s.ss }}</strong></div>
          <div><span>Protection</span><strong>{{ s.protection }}</strong></div>
          <div><span>Retiree Health</span><strong>{{ s.health }}</strong></div>
        </div>
        <p class="pr-notes">{{ s.notes }}</p>
      </div>
    </div>
  </template>
</template>

<style scoped>
.pr-criteria { margin: 1.5rem 0; padding: 0; border-radius: 8px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); }
.pr-criteria[open] { padding-bottom: 1rem; }
.pr-criteria-toggle { padding: 1rem 1.2rem; font-size: .95rem; font-weight: 600; cursor: pointer; list-style: none; display: flex; align-items: center; gap: .5rem; }
.pr-criteria-toggle::-webkit-details-marker { display: none; }
.pr-criteria-toggle::before { content: '▶'; font-size: .65rem; color: var(--vp-c-text-3); transition: transform .15s; }
.pr-criteria[open] > .pr-criteria-toggle::before { transform: rotate(90deg); }
.pr-criteria-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: .5rem; padding: 0 1.2rem; }
.pr-crit-item { padding: .6rem .8rem; border-radius: 6px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.pr-crit-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: .25rem; }
.pr-crit-label { font-weight: 600; font-size: .85rem; }
.pr-crit-weight { font-size: .75rem; color: var(--vp-c-text-3); font-family: monospace; }
.pr-crit-desc { font-size: .75rem; color: var(--vp-c-text-2); line-height: 1.4; }
.pr-crit-note { margin-top: .8rem; padding: 0 1.2rem; font-size: .75rem; color: var(--vp-c-text-3); font-style: italic; }

.pr-filters { margin: 1rem 0; }
.pr-tier-chips { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .6rem; }
.pr-chip { padding: .3rem .7rem; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: .8rem; font-weight: 600; cursor: pointer; font-family: monospace; transition: .15s; }
.pr-chip:hover { background: var(--vp-c-bg-mute); }
.pr-chip-on { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.pr-controls { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
.pr-search { padding: .4rem .7rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: .85rem; width: 180px; outline: none; }
.pr-search:focus { border-color: var(--vp-c-brand-1); }
.pr-sort { padding: .35rem .7rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: .78rem; cursor: pointer; font-family: monospace; }
.pr-sort-on { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.pr-updated { margin-left: auto; font-size: .72rem; color: var(--vp-c-text-3); font-family: monospace; white-space: nowrap; }

.pr-tier-section { margin-bottom: .5rem; }
.pr-tier-header { display: flex; align-items: center; gap: .75rem; padding: .7rem 1rem; border-left: 4px solid; background: var(--vp-c-bg-soft); border-radius: 0 6px 6px 0; margin-bottom: 2px; position: sticky; top: 0; z-index: 5; backdrop-filter: blur(8px); }
.pr-tier-badge { font-family: monospace; font-size: 1.1rem; font-weight: 700; }
.pr-tier-desc { font-size: .72rem; color: var(--vp-c-text-3); font-style: italic; }

.pr-card { padding: .7rem 1rem; border-bottom: 1px solid var(--vp-c-divider-light); cursor: pointer; transition: background .1s; }
.pr-card:hover { background: var(--vp-c-bg-soft); }
.pr-card-row { display: flex; align-items: center; gap: .6rem; }
.pr-rank { font-family: monospace; font-size: .75rem; color: var(--vp-c-text-3); width: 2rem; text-align: right; flex-shrink: 0; }
.pr-abbr { font-family: monospace; font-size: .95rem; font-weight: 700; width: 2.5rem; height: 2.5rem; display: flex; align-items: center; justify-content: center; border-radius: 7px; border: 2px solid; flex-shrink: 0; }
.pr-card-info { flex: 1; min-width: 0; }
.pr-card-name { font-size: .9rem; font-weight: 600; }
.pr-card-meta { display: flex; gap: .6rem; font-size: .72rem; color: var(--vp-c-text-3); font-family: monospace; flex-wrap: wrap; }
.pr-col-header { font-size: .65rem; color: var(--vp-c-text-3); font-family: monospace; text-transform: uppercase; letter-spacing: .3px; text-align: right; line-height: 1.3; flex-shrink: 0; }
.pr-flat-header { display: flex; padding: .5rem 1rem; border-bottom: 1px solid var(--vp-c-divider-light); background: var(--vp-c-bg-soft); }
.pr-replace { font-family: monospace; font-size: .95rem; font-weight: 700; flex-shrink: 0; }

.pr-detail { margin-top: .8rem; padding-top: .6rem; border-top: 1px solid var(--vp-c-divider-light); }
.pr-grades { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; }
.pr-grade-item { display: flex; align-items: center; gap: .3rem; }
.pr-grade-label { font-size: .68rem; color: var(--vp-c-text-3); }
.pr-grade-badge { font-family: monospace; font-size: .72rem; font-weight: 700; padding: .15rem .4rem; border-radius: 4px; }
.pr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: .4rem; margin-bottom: .6rem; }
.pr-stats > div { padding: .4rem .6rem; background: var(--vp-c-bg-soft); border-radius: 5px; }
.pr-stats span { display: block; font-size: .65rem; text-transform: uppercase; letter-spacing: .5px; color: var(--vp-c-text-3); font-family: monospace; }
.pr-stats strong { font-size: .82rem; }
.pr-notes { font-size: .8rem; line-height: 1.6; color: var(--vp-c-text-2); margin: 0; }
</style>
