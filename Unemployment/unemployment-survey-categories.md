---
title: The Unemployment Numbers, Broken Down — Which Survey Measures What
description: Six federal programs produce the monthly labor picture. Only one of them can produce an unemployment rate.
date: 2026-08-30
---

# The Unemployment Numbers, Broken Down — Which Survey Measures What

*Why the headline rate is one of six measures, and why none of them share a denominator*

*By Penny | August 30, 2026*

---

## Key Takeaways

**Thesis: The monthly labor picture comes from six separate federal programs, not one. They use different samples, different reference concepts, and different revision schedules — and only one of them can produce an unemployment rate at all.**

- **[Only the CPS produces an unemployment rate](#the-surveys)** — a household survey of about 60,000 eligible households [[1]](#source-1), and the sole source of all six U measures [[11]](#source-11)
  * The payroll jobs number in the same headline comes from a different survey covering about 119,000 businesses [[1]](#source-1)
  * This is why payrolls and household employment routinely disagree for months at a time
- **[The six rates don't share a denominator](#the-six-rates)** — U-4 adds discouraged workers to the numerator *and* the denominator; U-6 adds involuntary part-timers to the numerator only [[11]](#source-11)
- **[Marginally attached is the hinge category](#category-definitions)** — wants a job, available for one, looked in the past 12 months but not the past 4 weeks; splits into discouraged workers and everyone else [[11]](#source-11)
- **[Every program revises on a different schedule](#the-surveys)** — CPS sample estimates are never revised at all, while CES runs a three-stage preliminary cycle plus an annual benchmark to unemployment insurance records [[1]](#source-1)
  * LAUS re-estimates entire state series annually, so a rate from three years ago can still move [[8]](#source-8)
  * UI claims revise the prior week at every Thursday release, almost always upward [[10]](#source-10)
- **[Each survey has a coverage hole](#the-surveys)** — CES counts jobs, not people, and excludes the self-employed entirely; UI claims miss anyone who never files or already exhausted benefits; CPS sees no employer at all
  * At a 6 percent unemployment rate, the 90 percent confidence interval on the monthly *change* in the number unemployed is about plus or minus 425,000 [[1]](#source-1)
- **[Most of the value is in derived measures](#what-you-can-derive-from-this-data)** — the recipiency rate, the Beveridge curve, and prime-age participation all require combining series that no single release publishes together
- **[Plot the spreads, not the levels](#two-things-to-watch-when-charting-these)** — six near-parallel lines show you the business cycle six times over; U-6 minus U-3 is the measure that actually says something new

---

## The Surveys

### CPS: Current Population Survey

A household survey of about 60,000 eligible households, conducted by the Census Bureau for BLS [[1]](#source-1). The reference period is the week containing the 12th of the month, and results appear in the A tables of the monthly Employment Situation release [[1]](#source-1).

This is the only source of an unemployment rate. It produces all six U measures, the labor force level, household employment, the participation rate, the employment-population ratio, unemployment duration, reason for unemployment, marginally attached and discouraged workers, part time for economic reasons, and every demographic cut of those [[2]](#source-2).

**Includes:** anyone working for pay or profit regardless of whether an employer files payroll — the self-employed, unpaid family workers putting in 15 hours or more, farm and domestic workers, gig and informal workers, and people with a job but not at work due to vacation, illness, weather, or a strike. It counts *people*, once each, no matter how many jobs they hold.

**Excludes:** active-duty military, the institutionalized population in prisons, nursing homes, long-term care, and psychiatric facilities, and anyone under 16 [[11]](#source-11).

**Limitations:** it sees no employer, so there is no industry detail, no wage data by sector, and no job counts. Sampling error is larger than most readers assume — at an unemployment rate around 6 percent, the 90 percent confidence interval on the monthly change in the number unemployed is roughly plus or minus 425,000 [[1]](#source-1). The marginally attached and discouraged categories rest on especially small samples and are noisy month to month. And nothing below the state level is reliable at monthly frequency.

**Revision behavior:** CPS sample estimates are not revised. Only the seasonally adjusted values change, when BLS reestimates seasonal factors at year end and rewrites the previous five years.

### CES: Current Employment Statistics

An establishment payroll survey of about 119,000 businesses and government agencies, representing roughly 622,000 individual worksites [[1]](#source-1). The reference period is the pay period including the 12th, and results appear in the B tables of the same release [[1]](#source-1).

It produces nonfarm payroll employment, average weekly hours, and average hourly earnings, all by industry [[3]](#source-3). It produces no unemployment measure of any kind. The monthly jobs number that leads the news is CES; the unemployment rate in the same headline is CPS. Two surveys, two concepts, one press release.

**Includes:** employees on nonfarm payroll records who received pay for any part of the pay period, even one hour. It counts *jobs*, so a person holding two payroll jobs is counted twice.

**Excludes:** the self-employed and unincorporated self-employed, unpaid family workers, agricultural workers, private household workers, the military, and anyone on unpaid leave for an entire pay period.

**Limitations:** no demographics whatsoever — no age, sex, race, or education, which is why every demographic labor statistic you have ever seen came from the CPS and not from here. The birth/death model imputes employment at firms too new to appear in the sampling frame, and that imputation is least reliable exactly at economic turning points, when firm formation and failure rates break from their historical pattern.

**Revision behavior:** this is where the real preliminary cycle lives — a first preliminary estimate, a second preliminary the following month, a final sample-based estimate two months out, then an annual benchmark that replaces sample-based estimates with universe counts of payroll employment from unemployment insurance administrative records [[1]](#source-1). For state and area estimates, the benchmark replaces an 18-month span running from April of the year before the benchmark year through September of the benchmark year [[4]](#source-4). Five years of seasonally adjusted data are recalculated and replaced with every benchmark revision, and BLS treats the benchmark difference itself as a rough proxy for total survey error [[13]](#source-13).

### QCEW: Quarterly Census of Employment and Wages

Not a survey. An administrative census of every employer covered by unemployment insurance, published quarterly with a lag of roughly five months.

It produces employment and wage counts down to the county and detailed industry level, and it is the benchmark universe that CES is adjusted to each year [[5]](#source-5).

**Includes:** employers subject to state unemployment insurance law plus federal civilian employees, roughly 95 percent of U.S. jobs.

**Excludes:** the self-employed, most agricultural workers on small farms, railroad employees covered under a separate federal system, some nonprofit and religious organization staff, and the military.

**Limitations:** a lag of roughly five to six months, no demographic detail, and it counts jobs rather than people. State UI coverage rules differ at the margins, so cross-state comparisons of the excluded categories are not clean.

### JOLTS: Job Openings and Labor Turnover Survey

An establishment survey of roughly 21,000 establishments, monthly, producing job openings, hires, quits, layoffs and discharges, and other separations [[6]](#source-6).

This is the demand side of the market, and it has no CPS equivalent — the quits rate in particular is the best available read on worker confidence. JOLTS weighted employment is benchmarked so that it equals CES employment, and the program runs a birth/death model built from QCEW establishment activity and projected forward with CES to cover new firms that haven't yet reached the sampling frame [[7]](#source-7).

**Includes:** nonfarm establishments, the same scope as CES. A job opening has a narrow definition: a specific position exists, work could start within 30 days, and the employer is actively recruiting from outside the establishment.

**Excludes:** agriculture and the self-employed. Positions to be filled by internal transfer, promotion, or recall of a laid-off worker are not counted as openings.

**Limitations:** roughly 21,000 establishments is a small sample for the number of cuts published, so industry-level quits and layoffs carry wide error bands. Because it is benchmarked to CES, it inherits CES scope and CES revisions.

### LAUS: Local Area Unemployment Statistics

Not a survey either. A modeling program that produces state, metro, and county unemployment rates using CPS, CES, and UI claims as inputs, because CPS sample sizes are far too small to support direct estimates below the national level [[8]](#source-8).

**Includes:** modeled unemployment rates for all states, metro areas, counties, and cities of 25,000 or more.

**Excludes:** nothing conceptually, and that is the trap. County figures are largely disaggregations of state totals rather than independent measurements, so a county rate is closer to an allocation than a survey result.

**Limitations:** substate estimates rely on a disaggregation method rather than direct sampling. The published rates are also not comparable to the level estimates in the state alternative-measures files, which use forward population controls instead of the model-based LAUS controls [[8]](#source-8).

**Revision behavior:** LAUS re-estimates entire state and area series annually. A California county rate from three years ago is not necessarily the number that was published three years ago.

### UI Claims

Administrative records from state unemployment insurance offices, published weekly by the Department of Labor rather than BLS, every Thursday at 8:30 a.m. Eastern [[9]](#source-9). Initial and continued claims come first from the ETA 538 advance report, which counts claims by the state liable for payment. The following week they are revised using the ETA 539, which counts claimants by state of residence instead [[10]](#source-10).

It produces the insured unemployment rate, which runs well below U-3 because it counts only people currently drawing benefits rather than everyone searching.

**Includes:** people who filed a claim and were found eligible under their state's rules.

**Excludes:** the self-employed and gig workers, new entrants and reentrants without sufficient recent work history, most people who quit voluntarily or were fired for cause, anyone who has exhausted benefits, and everyone eligible who simply never files.

**Limitations:** eligibility rules, benefit duration, and take-up rates vary by state and shift over time, so the claims level reflects unemployment policy as much as it reflects the labor market. The insured unemployment rate is not a version of U-3 and should never be charted on the same axis as one without saying so.

**Revision behavior:** the prior week is revised at every release, almost always upward [[10]](#source-10).

### Which Variable Lives Where

| Variable | Program |
|---|---|
| Unemployment rate, U-1 to U-6 | CPS only |
| Duration and reason for unemployment | CPS only |
| Marginally attached, discouraged, involuntary part time | CPS only |
| Participation rate, employment-population ratio | CPS only |
| Payroll jobs, hours, earnings | CES |
| County-level employment and wages | QCEW |
| Openings, hires, quits, layoffs | JOLTS |
| State and county unemployment rates | LAUS |
| Insured unemployment rate | UI claims |

---

## The Population Tree

Everything from here down is CPS. It starts from the civilian noninstitutional population, age 16 and over, which excludes active-duty military and people in institutions such as prisons and nursing homes [[11]](#source-11).

<div class="lf-tree">
<svg width="100%" viewBox="0 0 680 446" role="img" xmlns="http://www.w3.org/2000/svg">
<title>CPS labor force classification with U-rate membership</title>
<desc>Each population category is labeled with which of the six alternative measures U-1 through U-6 it contributes to.</desc>
<defs><marker id="lf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>

<g class="n n-gray"><rect x="40" y="24" width="600" height="44" rx="8"/><text class="th" x="340" y="46" text-anchor="middle" dominant-baseline="central">Civilian noninstitutional population, age 16+</text></g>

<path d="M340 68 V84 H210 V96" class="arr" fill="none" marker-end="url(#lf-arrow)"/>
<path d="M340 68 V84 H520 V96" class="arr" fill="none" marker-end="url(#lf-arrow)"/>

<g class="n n-teal"><rect x="40" y="100" width="340" height="72" rx="8"/><text class="th" x="210" y="122" text-anchor="middle" dominant-baseline="central">Civilian labor force</text><text class="ts" x="210" y="142" text-anchor="middle" dominant-baseline="central">employed + unemployed</text><text class="ts" x="210" y="160" text-anchor="middle" dominant-baseline="central">denominator for U-1 to U-3</text></g>

<g class="n n-purple"><rect x="400" y="100" width="240" height="72" rx="8"/><text class="th" x="520" y="122" text-anchor="middle" dominant-baseline="central">Not in labor force</text><text class="ts" x="520" y="142" text-anchor="middle" dominant-baseline="central">did not look for work</text><text class="ts" x="520" y="160" text-anchor="middle" dominant-baseline="central">outside the U-3 base</text></g>

<path d="M210 172 V188 H121 V200" class="arr" fill="none" marker-end="url(#lf-arrow)"/>
<path d="M210 172 V188 H299 V200" class="arr" fill="none" marker-end="url(#lf-arrow)"/>
<line x1="520" y1="172" x2="520" y2="200" class="arr" marker-end="url(#lf-arrow)"/>

<g class="n n-teal"><rect x="40" y="204" width="162" height="72" rx="8"/><text class="th" x="121" y="226" text-anchor="middle" dominant-baseline="central">Employed</text><text class="ts" x="121" y="246" text-anchor="middle" dominant-baseline="central">worked 1+ hour</text><text class="ts" x="121" y="264" text-anchor="middle" dominant-baseline="central">not in any U rate</text></g>

<g class="n n-teal"><rect x="218" y="204" width="162" height="72" rx="8"/><text class="th" x="299" y="226" text-anchor="middle" dominant-baseline="central">Unemployed</text><text class="ts" x="299" y="246" text-anchor="middle" dominant-baseline="central">looked past 4 weeks</text><text class="ts" x="299" y="264" text-anchor="middle" dominant-baseline="central">U-1 through U-6</text></g>

<g class="n n-purple"><rect x="398" y="204" width="242" height="222" rx="12"/><text class="th" x="519" y="230" text-anchor="middle" dominant-baseline="central">Marginally attached</text><text class="ts" x="519" y="248" text-anchor="middle" dominant-baseline="central">wants job, looked past year</text></g>

<g class="n n-gray"><rect x="418" y="266" width="202" height="68" rx="8"/><text class="th" x="519" y="288" text-anchor="middle" dominant-baseline="central">Discouraged workers</text><text class="ts" x="519" y="306" text-anchor="middle" dominant-baseline="central">job-market reason</text><text class="ts" x="519" y="322" text-anchor="middle" dominant-baseline="central">U-4, U-5, U-6</text></g>

<g class="n n-gray"><rect x="418" y="344" width="202" height="68" rx="8"/><text class="th" x="519" y="366" text-anchor="middle" dominant-baseline="central">Other attached</text><text class="ts" x="519" y="384" text-anchor="middle" dominant-baseline="central">school, family, health</text><text class="ts" x="519" y="400" text-anchor="middle" dominant-baseline="central">U-5 and U-6 only</text></g>

<line x1="121" y1="276" x2="121" y2="304" class="arr" marker-end="url(#lf-arrow)"/>

<g class="n n-teal"><rect x="40" y="306" width="162" height="72" rx="8"/><text class="th" x="121" y="328" text-anchor="middle" dominant-baseline="central">Involuntary PT</text><text class="ts" x="121" y="348" text-anchor="middle" dominant-baseline="central">economic reasons</text><text class="ts" x="121" y="366" text-anchor="middle" dominant-baseline="central">U-6 only</text></g>
</svg>
</div>

---

## Category Definitions

**Unemployed.** No job during the reference week, available for work, and actively searched in the prior four weeks. Passive methods such as reading job ads do not count. People on temporary layoff awaiting recall are counted as unemployed with no search requirement [[11]](#source-11).

**Marginally attached.** Not working and not looking, but wants a job, is available for one, and looked sometime in the recent past, using a 12-month window [[11]](#source-11). This is a subset of not-in-labor-force, and it splits two ways:

- **Discouraged workers** — stopped looking for job-market reasons: believes no work is available, could not find work, lacks schooling or training, thinks employers see them as too young or too old, or other discrimination [[11]](#source-11)
- **Other marginally attached** — stopped looking for non-market reasons: school, family responsibilities, ill health, transportation [[11]](#source-11)

**Part time for economic reasons.** Working 1 to 34 hours because of slack work or business conditions, or because only part-time work was available [[11]](#source-11). These people are fully counted as employed in the official rate. Part time for noneconomic reasons — school, childcare, preference — never enters any of the six measures.

---

## The Six Rates

All six are produced solely from the CPS [[11]](#source-11).

| Rate | Numerator | Denominator |
|---|---|---|
| U-1 | Unemployed 15 weeks or longer | Labor force |
| U-2 | Job losers + completed temporary jobs | Labor force |
| U-3 | All unemployed (official rate) | Labor force |
| U-4 | Unemployed + discouraged | Labor force + discouraged |
| U-5 | Unemployed + all marginally attached | Labor force + marginally attached |
| U-6 | Unemployed + marginally attached + involuntary part time | Labor force + marginally attached |

U-1 and U-2 are always below U-3. U-4, U-5, and U-6 are always above it [[11]](#source-11). Note the asymmetry in U-6: it adds involuntary part-time workers to the numerator but not the denominator, because those workers already sit inside the labor force count.

### What's Behind U-1 and U-2

**Duration of unemployment.** Under 5 weeks, 5 to 14, 15 to 26, and 27 weeks and over. U-1 draws on the last two buckets [[11]](#source-11).

**Reason for unemployment.** Job losers on temporary layoff, job losers not on layoff plus completed temporary jobs, job leavers who quit, reentrants who worked before but had been out of the labor force, and new entrants who never worked. U-2 uses the first two [[11]](#source-11).

---

## What You Can Derive From This Data

Very little of what's actually useful appears in any single release. These are the measures worth building.

### From the CPS Alone

**Slack, three ways.** U-6 minus U-3 is the standard measure of labor market slack. U-1 divided by U-3 gives the long-term share of unemployment, which tends to keep climbing well after the headline rate has peaked and turned. U-5 minus U-4 isolates the marginally attached who are *not* discouraged, which moves for reasons closer to caregiving and schooling than to job availability.

**Prime-age participation and employment-population ratio.** Restricting to ages 25 to 54 strips out both the aging of the population and the education-driven decline in young-adult participation. If you are trying to answer whether people are actually working, this is the series to use, not the headline participation rate.

**Any U measure at any demographic cut.** BLS publishes the six rates only as national aggregates, but every one of them is a per-record classification, so all six can be reconstructed at any age, sex, education, or state slice from CPS basic monthly microdata. Expect to run your own seasonal adjustment, since there is no published seasonally adjusted age-specific U-6 to check against.

**Labor force flows.** CPS households are interviewed across multiple months, so records can be matched to produce transitions between employment, unemployment, and not-in-labor-force. This answers the question a falling U-3 cannot: whether the rate dropped because people found work or because they stopped looking.

### Across Surveys

**The recipiency rate.** Continued claims divided by CPS unemployed tells you what share of unemployed people the safety net actually reaches. It has trended down for decades and it varies enormously by state, which makes it one of the more consequential numbers almost nobody charts.

**The Beveridge curve.** JOLTS job openings rate plotted against U-3. Movement along the curve is a normal cyclical adjustment; a shift of the whole curve suggests a change in matching efficiency between workers and jobs.

**The jobs-workers gap.** JOLTS openings plus CES employment, measured against the CPS labor force. This is the cleanest single read on whether labor demand exceeds available supply.

**The household-payroll divergence.** CPS employment against CES payroll employment. Since CES counts jobs and excludes the self-employed while CPS counts people and includes them, a persistent gap points at multiple jobholding, self-employment, or a measurement problem in one of the two — and figuring out which is a genuinely open question most months.

**JOLTS turnover against CES change.** Hires minus total separations should approximate the monthly change in payroll employment. When the two diverge, one of the models is under strain, usually the birth/death imputation.

### For Revision Analysis

**Benchmark error as survey error.** BLS itself treats the annual CES benchmark difference as a rough proxy for total survey error [[13]](#source-13). Tracking that difference over time gives you a direct measure of how much confidence the monthly payroll print deserves.

**Preliminary-to-final drift.** Because CES publishes three vintages of every month before the benchmark, the direction and magnitude of the drift between them is itself a series. It tends to run persistently one way during turning points, which makes it a real-time signal rather than just noise.

Note that this last category applies to CES and not to CPS. Since CPS sample estimates are never revised, there is no preliminary-to-final drift to measure — the only vintage history is seasonal factor updates.

---

## Two Things to Watch When Charting These

**Mind the seasonal adjustment.** The alternative measures are published in table A-15 of the Employment Situation release, seasonally adjusted. The underlying marginally attached and discouraged levels appear in table A-16, not seasonally adjusted [[12]](#source-12). Mixing an adjusted rate with an unadjusted level will not reconcile, and the discrepancy looks like a data error rather than what it is.

**Plot the spreads, not the levels.** Six near-parallel lines mostly show you the business cycle six times over. The differences carry the information:

- **U-6 minus U-3** is the standard measure of labor market slack
- **U-1 divided by U-3** gives the long-term share of unemployment
- **U-5 minus U-4** isolates the marginally attached who are not discouraged

And if you put series from more than one program on the same chart, mark which revision regime each line follows. A CPS line and a CES line that appear to diverge over the most recent three months may only be showing you that one of them hasn't finished revising yet.

---

## Sources

<a id="source-1"></a>**1.** [U.S. Bureau of Labor Statistics — Employment Situation Technical Note](https://www.bls.gov/news.release/empsit.tn.htm) — CPS sample of about 60,000 eligible households; CES sample of about 119,000 businesses representing roughly 622,000 worksites; A tables vs. B tables; annual benchmark to unemployment insurance administrative records

<a id="source-2"></a>**2.** [U.S. Bureau of Labor Statistics — Current Population Survey](https://www.bls.gov/cps/) — Program home page; scope of published labor force, employment, and unemployment measures

<a id="source-3"></a>**3.** [U.S. Bureau of Labor Statistics — Current Employment Statistics (National)](https://www.bls.gov/ces/) — Nonfarm payroll employment, average weekly hours, and average hourly earnings by industry

<a id="source-4"></a>**4.** [U.S. Bureau of Labor Statistics — CES State and Area Questions and Answers](https://www.bls.gov/sae/questions-and-answers.htm) — 18-month benchmark replacement period running April of the prior year through September of the benchmark year; benchmarks applied to not seasonally adjusted estimates

<a id="source-5"></a>**5.** [U.S. Bureau of Labor Statistics — Quarterly Census of Employment and Wages](https://www.bls.gov/cew/) — Administrative census of UI-covered employers; county and detailed industry employment and wage counts

<a id="source-6"></a>**6.** [U.S. Bureau of Labor Statistics — Job Openings and Labor Turnover Survey](https://www.bls.gov/jlt/) — Job openings, hires, quits, layoffs and discharges, and other separations

<a id="source-7"></a>**7.** [U.S. Bureau of Labor Statistics — JOLTS Technical Note](https://www.bls.gov/news.release/jolts.tn.htm) — JOLTS weighted employment benchmarked to equal CES employment; birth/death model built from QCEW activity and projected forward using CES

<a id="source-8"></a>**8.** [U.S. Bureau of Labor Statistics — Local Area Unemployment Statistics](https://www.bls.gov/lau/) — Model-based state, metro, and county unemployment rates; annual re-estimation of historical series

<a id="source-9"></a>**9.** [U.S. Department of Labor, ETA — Unemployment Insurance Weekly Claims Data](https://oui.doleta.gov/unemploy/claims.asp) — Weekly release schedule, Thursday 8:30 a.m. Eastern; state-level claims data

<a id="source-10"></a>**10.** [U.S. Department of Labor — Unemployment Insurance Weekly Claims News Release](https://www.dol.gov/ui/data.pdf) — ETA 538 advance report counts claims by liable state; ETA 539 revision the following week counts claimants by state of residence; prior week routinely revised upward

<a id="source-11"></a>**11.** [U.S. Bureau of Labor Statistics — Concepts and Definitions (CPS)](https://www.bls.gov/cps/definitions.htm) — Definitions of unemployed, marginally attached, discouraged, part time for economic reasons; U-1 through U-6 formulas and denominators

<a id="source-12"></a>**12.** [U.S. Bureau of Labor Statistics — Employment Situation Release Archive](https://www.bls.gov/news.release/empsit.toc.htm) — Table A-15 alternative measures (seasonally adjusted); table A-16 persons not in the labor force (not seasonally adjusted)

<a id="source-13"></a>**13.** [U.S. Bureau of Labor Statistics — Monthly Employment Situation Report: Quick Guide to Methods and Measurement Issues](https://www.bls.gov/bls/empsitquickguide.htm) — Sampling error at 1.6 standard errors for a 90 percent interval; benchmark re-anchoring to QCEW March counts; five years of seasonally adjusted data recalculated with each benchmark

---

*This explainer is based on published federal statistical documentation. We encourage readers to review the cited sources directly, particularly before using any of these series in analysis.*

*[PenPublic](https://penpublic.com) — Your guide to public sector careers.*

<style>
.lf-tree { margin: 24px 0; }
.lf-tree text.th { font-size: 14px; font-weight: 500; }
.lf-tree text.ts { font-size: 12px; }
.lf-tree .n rect { stroke-width: 0.5; }
.lf-tree .arr { stroke: var(--vp-c-text-2, #666); stroke-width: 1.5; fill: none; }

.lf-tree .n-gray rect { fill: #F1EFE8; stroke: #5F5E5A; }
.lf-tree .n-gray text { fill: #444441; }
.lf-tree .n-gray text.ts { fill: #5F5E5A; }
.lf-tree .n-teal rect { fill: #E1F5EE; stroke: #0F6E56; }
.lf-tree .n-teal text { fill: #085041; }
.lf-tree .n-teal text.ts { fill: #0F6E56; }
.lf-tree .n-purple rect { fill: #EEEDFE; stroke: #534AB7; }
.lf-tree .n-purple text { fill: #3C3489; }
.lf-tree .n-purple text.ts { fill: #534AB7; }

html.dark .lf-tree .n-gray rect { fill: #444441; stroke: #B4B2A9; }
html.dark .lf-tree .n-gray text { fill: #D3D1C7; }
html.dark .lf-tree .n-gray text.ts { fill: #B4B2A9; }
html.dark .lf-tree .n-teal rect { fill: #085041; stroke: #5DCAA5; }
html.dark .lf-tree .n-teal text { fill: #9FE1CB; }
html.dark .lf-tree .n-teal text.ts { fill: #5DCAA5; }
html.dark .lf-tree .n-purple rect { fill: #3C3489; stroke: #AFA9EC; }
html.dark .lf-tree .n-purple text { fill: #CECBF6; }
html.dark .lf-tree .n-purple text.ts { fill: #AFA9EC; }
</style>
