---
title: "Retirement Projections — User Guide"
description: How to use PenPublic's retirement projection tool for income modeling, readiness scoring, Monte Carlo simulation, healthcare gap analysis, and what-if scenarios
tags: ['projections', 'retirement', 'Monte Carlo', 'healthcare', 'COLA', '457b', 'IRA', 'readiness', 'guide']
order: 12
---

# Retirement Projections — User Guide

The **Projections** tab is PenPublic's most comprehensive retirement planning tool. It takes everything from the [Calculator](./calculators-guide) and [Compare](./compare-guide) tabs and goes deeper: a 0–100 readiness score, actionable improvement items, stacked income charts, Monte Carlo simulation, what-if age comparisons, COLA purchasing power projections, 457(b) optimization, Roth vs Traditional IRA analysis, and a full healthcare gap calculator.

Think of it as a retirement stress test — designed to surface the gaps *before* they become problems.

---

## Your Numbers (Inputs)

The input panel accepts everything the Compare page does, plus several projection-specific fields:

### Shared Inputs
- **Annual Salary**, **Current Age**, **Retirement Age** — same as Compare
- **401(k) %**, **Employer Match %**, **Existing 401(k)**, **Expected Return %** — used for Monte Carlo simulation of a private-sector 401(k)
- **457(b) %** — your deferred compensation contribution rate
- **Pension System** — which formula to use for the pension calculation

### Projection-Specific Inputs
- **IRA Balance** — current balance in your Traditional or Roth IRA
- **IRA Annual Contribution** — how much you contribute each year (default: $7,000, the 2024 limit)
- **Life Expectancy** — used for readiness scoring and lifetime calculations (default: 92)
- **Tax Rate Now** — your current combined federal + state marginal tax rate
- **Retirement Tax Rate** — your expected tax rate in retirement (usually lower)
- **HC Coverage** — healthcare family size: Single, Couple, or Family
- **HC Plan** — healthcare plan tier: Bronze, Silver, or Gold

::: tip Import from Compare
If you've already set up numbers on the Compare tab, click **Import from Compare Page** to pull all shared inputs over automatically. A green "Imported" chip confirms the transfer.
:::

---

## Retirement Readiness Score

The readiness score is a **0–100 composite score** displayed as a ring gauge. It evaluates how well-prepared you are across multiple dimensions:

### How the Score is Calculated

Each dimension contributes points up to a maximum. The transparent breakdown table shows every component:

| Component | What It Measures | Max Points |
|-----------|-----------------|------------|
| Replacement Ratio | What % of your working salary your total retirement income replaces | 30 |
| Pension Strength | Annual pension as a share of pre-retirement salary | 20 |
| Supplemental Savings | 457(b) balance at retirement relative to salary | 15 |
| Healthcare Readiness | Whether you've accounted for the pre-Medicare gap | 10 |
| Longevity Buffer | Whether income sources last beyond life expectancy | 10 |
| Diversification | Whether income comes from multiple streams (pension, 457b, IRA, SS) | 10 |
| Tax Efficiency | Whether you're using tax-advantaged accounts effectively | 5 |

### Score Ranges

- **90–100:** Excellent — you're well prepared
- **80–89:** Strong — on track
- **65–79:** Good — some room to improve
- **50–64:** Fair — review the action items
- **Below 50:** Needs attention — significant gaps

### Custom Target Income

By default, the readiness score targets 80% of your working salary. If you have a specific income target in mind (e.g., $80,000/year), enter it in the **Custom target income** field and the score recalculates instantly.

---

## Action Items: How To Improve Your Score

If your score isn't perfect, the **Action Items** section provides specific, prioritized steps to improve it. Each item includes an icon, a recommendation, and the estimated impact. Examples:

- *"Increase 457(b) to 10% — adds $X/yr in retirement income"*
- *"Open a Roth IRA — diversifies tax treatment"*
- *"Consider working to 63 — adds X points to your benefit factor"*

These aren't generic advice — they're calculated from your specific inputs.

---

## Income Sources Over Time (Stacked Chart)

The stacked area chart shows where your retirement income comes from, year by year, for 30 years of retirement:

- **Green:** Pension (the guaranteed floor)
- **Orange:** Social Security
- **Blue:** 457(b) deferred compensation
- **Purple:** IRA (if you have one)
- **Dashed line:** Total income

This visualization makes it obvious that the pension forms the *foundation* of income, with Social Security and supplemental savings layered on top. The pension area never shrinks — it's the guaranteed floor that everything else is built on.

---

## Monte Carlo Simulation

This is one of the most powerful features. The Monte Carlo section runs **1,000+ simulated investment outcomes** for a private-sector 401(k) to show the range of possible results, then overlays your guaranteed pension as a flat green line.

### The Fan Chart

The chart displays:

- **Green line (thick):** Your guaranteed pension — a single certain outcome
- **Red line (solid):** The median (50th percentile) 401(k) outcome
- **Darker band:** The 25th–75th percentile range (middle 50% of outcomes)
- **Lighter band:** The 10th–90th percentile range (80% of outcomes)

The spread of the red bands shows *volatility* — the uncertainty inherent in market-based retirement. The green line has zero spread because a pension has zero market risk.

### Balance Percentiles

A table showing your 401(k) balance at retirement across five percentile scenarios:
- 10th percentile (worst case)
- 25th percentile (below average)
- 50th percentile (median)
- 75th percentile (above average)
- 90th percentile (best case)

### Risk Assessment

- **Risk of inadequate income** — the percentage of simulations where the 401(k) produces insufficient retirement income. Below 10% is considered safe; above 20% is a red flag.
- **Pension equivalent (present value)** — the lump sum a 401(k) would need to match the pension's guaranteed income stream.

### Resimulate

The Monte Carlo uses a **seed number** for reproducibility. Click **Resimulate** to generate a fresh set of random outcomes. The seed is shown so you can share or compare runs.

---

## Sequence of Returns Risk

This red-toned card answers a terrifying question: *"What if a market crash hits right before I retire?"*

The table models a major crash (e.g., -38% like 2008) hitting at different points before retirement:

- **1 year before retirement** — the worst case; no time to recover
- **3 years before** — partial recovery but still devastating
- **5 years before** — better, but the balance never fully recovers
- **No crash baseline** — for comparison

Each row shows the post-crash 401(k) balance, the resulting annual income, and the income lost per year. The pension, as always, is unaffected.

This section is called "sequence of returns risk" because *when* losses happen matters as much as *how much* you lose. A 38% crash at age 61 is catastrophically worse than the same crash at age 35.

---

## Scenario Comparison: Retire at X vs Y

Use the **slider** to pick an alternate retirement age and see both scenarios side by side:

- Years of service at each age
- Benefit factor percentage
- Annual pension
- Total income (pension + 457b + SS)
- Replacement ratio
- Lifetime total income
- Healthcare gap years

### Break-Even Age

The blue info card calculates the **break-even age** — the age at which the later retirement scenario's cumulative income catches up to the earlier one. If the earlier scenario wins for life, it says so.

This helps answer the classic question: *"Is it worth working three more years?"* Sometimes the answer is a clear yes (if you'd cross a benefit factor threshold); sometimes the break-even age is past life expectancy, making early retirement the better financial choice.

---

## COLA Purchasing Power

COLA (Cost-of-Living Adjustment) is the annual increase to your pension. This section charts your pension's **purchasing power** over 30 years:

- **Green line:** Your pension with COLA applied — does it keep up with inflation?
- **Red dashed line:** What happens with zero COLA (purchasing power erosion)

The chart baseline is 100% (your first-year purchasing power). If the green line stays above 100%, your COLA is beating inflation. If it dips below, inflation is winning.

Snapshot values at Year 10, 20, and 30 show the nominal pension amount and purchasing power percentage.

::: info COLA Varies by System
CalPERS PEPRA has a 2% simple (non-compounding) COLA, which doesn't fully keep up with the 3% long-term inflation assumption. CalPERS Classic has a 2% compounding COLA. Federal FERS has partial CPI-W adjustment. The chart reflects whichever system you selected.
:::

---

## 457(b) Optimizer

The 457(b) is the most tax-efficient savings vehicle available to government workers. This table shows what happens at different contribution rates (0% through 15%+):

| Column | Meaning |
|--------|---------|
| **Rate** | Contribution percentage |
| **Annual** | Dollar amount contributed per year |
| **Mo. Cost*** | After-tax cost to your take-home pay (less than the full amount because contributions are pre-tax) |
| **Balance** | Projected balance at retirement |
| **Income** | Annual withdrawal at 4% |
| **Mo. Income** | Monthly withdrawal |

Your current contribution rate is highlighted in green. This makes it easy to see: *"If I bump from 6% to 10%, it only costs me $X/month now but adds $Y/year in retirement."*

The asterisk note explains that the monthly cost column reflects the tax savings — a 10% contribution doesn't reduce your paycheck by 10% because you save on taxes.

---

## Roth vs Traditional IRA

This section runs a side-by-side comparison of Roth and Traditional IRA strategies, personalized to your tax rates:

**Traditional IRA:**
- Tax break now (deductible contribution)
- Taxed on withdrawal in retirement
- Better when current tax rate > retirement tax rate

**Roth IRA:**
- No tax break now
- Tax-free withdrawals in retirement
- Better when retirement tax rate ≥ current tax rate

The tool shows the real monthly cost, balance at retirement, annual withdrawal, tax on withdrawal, and after-tax income for each option. A recommendation card at the bottom tells you which is better for your situation and by how much per year.

::: tip Age 50+ Catch-Up
If you're 50 or older, the IRA section notes the catch-up contribution limit (currently $8,000/year instead of $7,000).
:::

---

## Healthcare Gap Analysis

If you retire before age 65, you have a **healthcare gap** — the years between retirement and Medicare eligibility. This is one of the most commonly overlooked retirement expenses.

The healthcare section calculates:

- **Gap years** — how many years you need to bridge (e.g., retire at 58 = 7-year gap)
- **Starting premium** — estimated monthly premium based on your coverage type and plan tier
- **Total cost (flat)** — what you'd pay if premiums stayed constant
- **Total cost (6% inflation)** — the realistic number, accounting for healthcare cost inflation
- **ACA subsidy eligibility** — if your retirement income is low enough, you may qualify for Affordable Care Act subsidies; the tool estimates your FPL percentage and potential subsidy

### Year-by-Year Schedule

An expandable table shows the monthly premium, inflation-adjusted premium, and annual cost for each year of the gap. This is useful for budgeting.

### Coverage Options

A list of strategies for bridging the gap, including:
- **COBRA** — employer plan continuation (18 months, expensive)
- **ACA Marketplace** — individual plans with possible subsidies
- **Employer retiree health** — if your agency offers it (increasingly rare)
- **Spousal coverage** — if your spouse has employer insurance

---

## Sharing Your Projection

Click **Share This Projection** to copy a URL that encodes all inputs. The URL includes every parameter — salary, age, pension system, 457(b) rate, IRA balance, healthcare settings, and more. Anyone who opens the link sees the exact same projection.

---

## Common Questions

**Why does the readiness score penalize me for no IRA?** Diversification is a scored component. Having income from multiple sources (pension, 457b, IRA, SS) reduces risk — if any one source has issues, the others compensate. An IRA adds a layer of flexibility.

**Is the Monte Carlo realistic?** The simulation uses a 16% annual volatility assumption (roughly the historical standard deviation of a 60/40 stock/bond portfolio) with the expected return you specify. Real-world outcomes depend on your actual asset allocation.

**Should I trust the healthcare cost estimate?** The estimates are based on national average marketplace premiums by age, family size, and plan tier. Your actual premiums depend on your state, county, health status, and available plans. Use the "Custom $/mo" field to enter your own estimate if you have one.

**What if I have a pension AND a 401(k)?** If you're already in the public sector, the 401(k) inputs are mainly used for the Monte Carlo comparison (showing what a private-sector equivalent would look like). Your real retirement income is the pension + 457(b) + IRA + SS path.

---

## Related Tools

- [Pension Calculators](./calculators-guide) — calculate your exact pension benefit for any supported system
- [Private vs Public Comparison](./compare-guide) — side-by-side comparison with recession simulation
- [California Pension Formulas](./california-formulas) — every CalPERS and CalSTRS formula explained
- [New York Pension Formulas](./new-york-formulas) — ERS, PFRS, NYSTRS, and NYCERS formulas by tier
- [D.C. & Federal Pension Formulas](./dc-federal-formulas) — FERS, CSRS, and D.C. local formulas
