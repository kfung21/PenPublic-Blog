---
title: Cost of Living
order: 4
---

# Cost of Living and Wages

The jobs numbers say who is working. These say what a paycheck buys.

## The short version

<CostSummary />

Two things the averages hide. A raise feels earned and a price increase feels taken, so matching inflation still feels like losing. And prices never came back down. Inflation slowing means prices are rising more slowly, not falling.

The charts below show each of these. Prices and pay are drawn as percent changes, because the raw numbers only ever go up. Hover a chart for exact numbers.

## Housing in dollars

What it costs each month to buy a median-priced new home. This assumes 20 percent down and a 30-year fixed loan at that month's average rate. It covers principal and interest only, not property tax or insurance.

<LaborChart payment="MSPUS@MORTGAGE30US" payment-label="Monthly payment" title="Monthly mortgage payment on a median-priced new home" zero />

The payment depends on two things: the price and the rate.

<LaborChart series="MSPUS" title="Median price of a new home sold" zero />

<LaborChart series="MORTGAGE30US" title="Average 30-year fixed mortgage rate" zero />

There is no rent chart in dollars. The government measures rent as an index, not a dollar amount, so rent appears further down as a change since 2020.

## Pay vs. prices since 2020

Both lines start at zero in January 2020, just before the pandemic. The gap between them is how much more, or less, the average paycheck buys than it did then. Look at 2021 and 2022: prices caught up to pay and passed it, and it took years for pay to pull ahead again.

<LaborChart series="CES0500000003,CPIAUCSL" transform="since:2020-01" title="Hourly pay and consumer prices" />

## What a paycheck buys

Hourly pay divided by prices, compared with a year earlier. Above zero, pay is beating inflation. Below zero, people with jobs are falling behind. This is the line that best matches how things feel: watch for stretches below zero.

<LaborChart real="CES0500000003/CPIAUCSL" real-label="Pay after inflation" transform="yoy" title="Pay after inflation, change from a year earlier" />

The same measure for non-managers goes back to 1965.

<LaborChart real="AHETPI/CPIAUCSL" real-label="Pay after inflation, non-managers" transform="yoy" title="Pay after inflation for non-managers" />

## Inflation

How much more things cost than a year ago. This is the inflation rate in the news. The second line leaves out food and energy, which swing the most. When the first line is well above the second, gas and groceries are doing the damage.

<LaborChart series="CPIAUCSL,CPILFESL" transform="yoy" title="Consumer prices, change from a year earlier" />

## Rent, groceries, and gas vs. pay

The costs people notice most, each measured from January 2020 against hourly pay. Anything above the pay line has become harder to afford. Gasoline swings far more than the others, which is why it shapes the mood so much.

<LaborChart series="CES0500000003,CUSR0000SEHA,CUSR0000SAF11,CUSR0000SETB01" transform="since:2020-01" title="Hourly pay vs. rent, groceries, and gasoline" />

## About the data

Hourly pay for all private workers starts in 2006. The non-manager series starts in 1964 and covers about four out of five private workers.

These are national averages. Your own rent, pay, and home prices can be far from them. The home price is for new homes only, which run higher than existing homes.

A missing month in a year-over-year line means BLS never published the month it would be compared against. October 2025 is one, because of the federal government shutdown.

## Data sources

Prices and pay come from the U.S. Bureau of Labor Statistics. Home prices come from the Census Bureau and HUD, and mortgage rates from Freddie Mac. We pull all of it through [ALFRED](https://alfred.stlouisfed.org/), the St. Louis Fed's archive. Each link below opens the exact series.

| On this page | Source | Series |
|---|---|---|
| Prices | [Consumer Price Index](https://www.bls.gov/cpi/) | [CPIAUCSL](https://fred.stlouisfed.org/series/CPIAUCSL) |
| Prices without food and energy | Consumer Price Index | [CPILFESL](https://fred.stlouisfed.org/series/CPILFESL) |
| Rent | Consumer Price Index | [CUSR0000SEHA](https://fred.stlouisfed.org/series/CUSR0000SEHA) |
| Groceries | Consumer Price Index | [CUSR0000SAF11](https://fred.stlouisfed.org/series/CUSR0000SAF11) |
| Gasoline | Consumer Price Index | [CUSR0000SETB01](https://fred.stlouisfed.org/series/CUSR0000SETB01) |
| Median new home price | [Census Bureau and HUD, New Residential Sales](https://www.census.gov/construction/nrs/index.html) | [MSPUS](https://fred.stlouisfed.org/series/MSPUS) |
| 30-year mortgage rate | [Freddie Mac, Primary Mortgage Market Survey](https://www.freddiemac.com/pmms) | [MORTGAGE30US](https://fred.stlouisfed.org/series/MORTGAGE30US) |
| Hourly pay | [Current Employment Statistics](https://www.bls.gov/ces/) | [CES0500000003](https://fred.stlouisfed.org/series/CES0500000003) |
| Hourly pay, non-managers | Current Employment Statistics | [AHETPI](https://fred.stlouisfed.org/series/AHETPI) |

Pay after inflation is our own calculation: hourly pay divided by the price index. The monthly mortgage payment is also our own calculation from the home price and the mortgage rate. Recession dates are from the [NBER](https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions).
