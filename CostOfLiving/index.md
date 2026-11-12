---
title: Cost of Living
order: 4
---

# Cost of Living and Wages

The jobs numbers say who is working. These say what a paycheck buys. Prices and pay are shown as percent changes, because the raw numbers only ever go up. Hover a chart for exact numbers.

## Pay vs. prices since 2020

The one chart to look at first. Both lines start at zero in January 2020, just before the pandemic. When the prices line is above the pay line, the average paycheck buys less than it did then.

<LaborChart series="CES0500000003,CPIAUCSL" transform="since:2020-01" title="Hourly pay and consumer prices" />

## What a paycheck buys

Hourly pay divided by prices, compared with a year earlier. Above zero, pay is beating inflation. Below zero, people with jobs are falling behind.

<LaborChart real="CES0500000003/CPIAUCSL" real-label="Pay after inflation" transform="yoy" title="Pay after inflation, change from a year earlier" />

The same measure for non-managers goes back to 1965.

<LaborChart real="AHETPI/CPIAUCSL" real-label="Pay after inflation, non-managers" transform="yoy" title="Pay after inflation for non-managers" />

## Inflation

How much more things cost than a year ago. This is the inflation rate in the news. The second line leaves out food and energy, which swing the most.

<LaborChart series="CPIAUCSL,CPILFESL" transform="yoy" title="Consumer prices, change from a year earlier" />

## Rent, groceries, and gas vs. pay

The costs people notice most, each measured from January 2020 against hourly pay.

<LaborChart series="CES0500000003,CUSR0000SEHA,CUSR0000SAF11,CUSR0000SETB01" transform="since:2020-01" title="Hourly pay vs. rent, groceries, and gasoline" />

## Housing

Shelter is the largest part of most budgets. It covers rent and the rent-equivalent cost of owning a home. It does not include home prices or mortgage rates.

<LaborChart series="CUSR0000SAH1,CUSR0000SEHA" transform="yoy" title="Housing and rent, change from a year earlier" />

## About the data

Prices are the Consumer Price Index from the Bureau of Labor Statistics, seasonally adjusted. Pay is average hourly earnings from the same employer survey as the [payroll jobs numbers](/Unemployment/). Both are pulled through [ALFRED](https://alfred.stlouisfed.org/).

Hourly pay for all private workers starts in 2006. The non-manager series starts in 1964 and covers about four out of five private workers.

These are national averages. Your own rent and pay can be far from them, and the price index does not capture home prices or interest rates.

A missing month in a year-over-year line means BLS never published the month it would be compared against. October 2025 is one, because of the federal government shutdown.
