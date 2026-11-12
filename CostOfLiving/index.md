---
title: Cost of Living
order: 4
---

# Cost of Living and Wages

The jobs numbers say who is working. These say what a paycheck buys. Housing and pay are in dollars. Hover a chart for exact numbers.

## Home prices vs. income

The median new home, next to what a household earns in a year and what one typical full-time worker earns in a year. All three are in dollars on the same scale.

<LaborChart series="MSPUS,MEHOINUSA646N" annual="LES1252881500Q" annual-label="Full-time worker pay per year" title="Home price vs. household income and full-time worker pay" note="Household income is annual and runs about a year behind" zero />

The same comparison as a single number: how many years of income a median new home costs.

<LaborChart years="MSPUS/MEHOINUSA646N,MSPUS/LES1252881500Q*52" years-labels="Years of household income|Years of one full-time worker's pay" title="Years of income to buy a median new home" zero />

## The monthly payment

Few people pay cash, so the price is half the story. This is the monthly payment on that home with 20 percent down and a 30-year fixed loan at that month's average rate. It covers principal and interest only, not property tax or insurance. Home prices come out once a quarter, so each month uses the latest price available.

<LaborChart payment="MSPUS@MORTGAGE30US" payment-label="Monthly payment" title="Monthly mortgage payment on a median-priced new home" zero />

The same payment as a share of one typical full-time worker's monthly pay, before taxes.

<LaborChart burden="MSPUS@MORTGAGE30US/LES1252881500Q" burden-label="Payment as a share of monthly pay" title="Mortgage payment as a share of a full-time worker's pay" zero />

## Pay vs. prices since 2020

What one typical full-time worker earns in a year, next to what that worker would need to earn to buy what their pay bought in January 2020. When the actual line is on top, pay has beaten prices. When the needed line is on top, the paycheck buys less than it did.

<LaborChart keepup="LES1252881500Q*52/CPIAUCSL@2020-01" title="Full-time worker pay vs. the pay needed to keep up with prices" />

## What a paycheck buys

Hourly pay divided by prices, compared with a year earlier. Above zero, pay is beating inflation. Below zero, people with jobs are falling behind. This is the line that best matches how things feel: watch for stretches below zero.

<LaborChart real="CES0500000003/CPIAUCSL" real-label="Pay after inflation" transform="yoy" title="Pay after inflation, change from a year earlier" />

## Rent, groceries, and gas vs. pay

The costs people notice most. The government publishes these as price indexes, not dollar amounts, so they are shown as the total rise since January 2020 next to the rise in hourly pay. A line at +30% means that item costs 30 percent more than it did then. Anything above the pay line has become harder to afford. Gasoline swings far more than the others, which is why it shapes the mood so much.

<LaborChart series="CES0500000003,CUSR0000SEHA,CUSR0000SAF11,CUSR0000SETB01" transform="since:2020-01" title="Hourly pay vs. rent, groceries, and gasoline" />

## Inflation

How much more things cost than a year ago. This is the inflation rate in the news. The second line leaves out food and energy, which swing the most. When the first line is well above the second, gas and groceries are doing the damage.

<LaborChart series="CPIAUCSL,CPILFESL" transform="yoy" title="Consumer prices, change from a year earlier" />

## Mortgage rates

The rate is the other half of the monthly payment.

<LaborChart series="MORTGAGE30US" title="Average 30-year fixed mortgage rate" zero />

There is no rent chart in dollars. The government measures rent as an index, not a dollar amount, so rent appears further down as a change since 2020.

## Pay after inflation, the long view

The same measure for non-managers goes back to 1965.

<LaborChart real="AHETPI/CPIAUCSL" real-label="Pay after inflation, non-managers" transform="yoy" title="Pay after inflation for non-managers" />

## The bottom line

What the charts above add up to, rewritten from the latest numbers each time the data updates.

<CostSummary />

Two things the averages hide. A raise feels earned and a price increase feels taken, so matching inflation still feels like losing. And prices never came back down. Inflation slowing means prices are rising more slowly, not falling.

## About the data

Hourly pay for all private workers starts in 2006. The non-manager series starts in 1964 and covers about four out of five private workers.

These are national averages. Your own rent, pay, and home prices can be far from them. The home price is for new homes only, which run higher than existing homes.

A missing month in a year-over-year line means BLS never published the month it would be compared against. October 2025 is one, because of the federal government shutdown.

## Data sources

Prices and pay come from the U.S. Bureau of Labor Statistics. Home prices and household income come from the Census Bureau, and mortgage rates from Freddie Mac. We pull all of it through [ALFRED](https://alfred.stlouisfed.org/), the St. Louis Fed's archive. Each link below opens the exact series.

| On this page | Source | Series |
|---|---|---|
| Prices | [Consumer Price Index](https://www.bls.gov/cpi/) | [CPIAUCSL](https://fred.stlouisfed.org/series/CPIAUCSL) |
| Prices without food and energy | Consumer Price Index | [CPILFESL](https://fred.stlouisfed.org/series/CPILFESL) |
| Rent | Consumer Price Index | [CUSR0000SEHA](https://fred.stlouisfed.org/series/CUSR0000SEHA) |
| Groceries | Consumer Price Index | [CUSR0000SAF11](https://fred.stlouisfed.org/series/CUSR0000SAF11) |
| Gasoline | Consumer Price Index | [CUSR0000SETB01](https://fred.stlouisfed.org/series/CUSR0000SETB01) |
| Median new home price | [Census Bureau and HUD, New Residential Sales](https://www.census.gov/construction/nrs/index.html) | [MSPUS](https://fred.stlouisfed.org/series/MSPUS) |
| 30-year mortgage rate | [Freddie Mac, Primary Mortgage Market Survey](https://www.freddiemac.com/pmms) | [MORTGAGE30US](https://fred.stlouisfed.org/series/MORTGAGE30US) |
| Full-time worker pay | [BLS, Current Population Survey earnings](https://www.bls.gov/cps/earnings.htm) | [LES1252881500Q](https://fred.stlouisfed.org/series/LES1252881500Q) |
| Household income | [Census Bureau, Income and Poverty in the United States](https://www.census.gov/topics/income-poverty/income.html) | [MEHOINUSA646N](https://fred.stlouisfed.org/series/MEHOINUSA646N) |
| Hourly pay | [Current Employment Statistics](https://www.bls.gov/ces/) | [CES0500000003](https://fred.stlouisfed.org/series/CES0500000003) |
| Hourly pay, non-managers | Current Employment Statistics | [AHETPI](https://fred.stlouisfed.org/series/AHETPI) |

Pay after inflation is our own calculation: hourly pay divided by the price index. The monthly mortgage payment is also our own calculation from the home price and the mortgage rate. Full-time worker pay per year is median weekly earnings times 52. Recession dates are from the [NBER](https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions).
