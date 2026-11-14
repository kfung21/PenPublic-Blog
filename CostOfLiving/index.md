---
title: Cost of Living
order: 4
---

# Cost of Living and Wages

The jobs numbers say who is working. These say what a paycheck buys. Housing and pay are in dollars. Hover a chart for exact numbers.

## Home prices vs. income

The median new home, next to what a household earns in a year and what one typical full-time worker earns in a year. All three are in dollars on the same scale.

<LaborChart series="MSPUS,MEHOINUSA646N" annual="LES1252881500Q" annual-label="Full-time worker pay per year" title="Home price vs. household income and full-time worker pay" note="Household income is annual and runs about a year behind" zero />

## Interest rates

The federal funds rate is the rate the Federal Reserve sets. Mortgage rates are not set by the Fed, but they tend to move in the same direction. When these rise, the same house costs more each month even if its price does not change.

<LaborChart series="FEDFUNDS,MORTGAGE30US" title="Federal funds rate and the 30-year mortgage rate" zero />

## Inflation

How much more things cost than a year ago. This is the inflation rate in the news. The second line leaves out food and energy, which swing the most. When the first line is well above the second, gas and groceries are doing the damage.

<LaborChart series="CPIAUCSL,CPILFESL" transform="yoy" title="Consumer prices, change from a year earlier" />

## The monthly payment

Price and rate together. This is the monthly payment on that home with 20 percent down and a 30-year fixed loan at that month's average rate. It covers principal and interest only, not property tax or insurance. Home prices come out once a quarter, so each month uses the latest price available.

<LaborChart payment="MSPUS@MORTGAGE30US" payment-label="Monthly payment" title="Monthly mortgage payment on a median-priced new home" zero />

The same payment as a share of one typical full-time worker's monthly pay, before taxes.

<LaborChart burden="MSPUS@MORTGAGE30US/LES1252881500Q" burden-label="Payment as a share of monthly pay" title="Mortgage payment as a share of a full-time worker's pay" zero />

## Pay vs. prices since 2020

What one typical full-time worker earns in a year, next to what that worker would need to earn to buy what their pay bought in January 2020. When the actual line is on top, pay has beaten prices. When the needed line is on top, the paycheck buys less than it did.

<LaborChart keepup="LES1252881500Q*52/CPIAUCSL@2020-01" title="Full-time worker pay vs. the pay needed to keep up with prices" />

## The bottom line

The page in a few sentences, rewritten from the latest numbers each time the data updates. It also covers rent, groceries, and gas, which are only published as price indexes and so have no dollar chart.

<CostSummary />

Two things the averages hide. A raise feels earned and a price increase feels taken, so matching inflation still feels like losing. And prices never came back down. Inflation slowing means prices are rising more slowly, not falling.

## About the data

These are national averages. Your own rent, pay, and home prices can be far from them. The home price is for new homes only, which run higher than existing homes.

A break in a line means that month or quarter was never published. Late 2025 has some, because of the federal government shutdown.

## Data sources

Prices and pay come from the U.S. Bureau of Labor Statistics. Home prices and household income come from the Census Bureau, mortgage rates from Freddie Mac, and the federal funds rate from the Federal Reserve. We pull all of it through [ALFRED](https://alfred.stlouisfed.org/), the St. Louis Fed's archive. Each link below opens the exact series.

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
| Federal funds rate | [Federal Reserve Board, H.15 Selected Interest Rates](https://www.federalreserve.gov/releases/h15/) | [FEDFUNDS](https://fred.stlouisfed.org/series/FEDFUNDS) |
| Hourly pay | [Current Employment Statistics](https://www.bls.gov/ces/) | [CES0500000003](https://fred.stlouisfed.org/series/CES0500000003) |

The monthly mortgage payment is our own calculation from the home price and the mortgage rate. Full-time worker pay per year is median weekly earnings times 52. Recession dates are from the [NBER](https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions).
