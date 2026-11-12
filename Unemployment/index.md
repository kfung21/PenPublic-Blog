---
title: Unemployment
order: 3
---

# Unemployment Data

Every national series we track, monthly, back to the first month it was published. Hover a chart for exact numbers. The range buttons change every chart at once.

## The unemployment rate since 1948

This is the number in the news every month. It is the official rate, called U-3: unemployed people as a share of the labor force, seasonally adjusted. Shaded bands are recessions.

<LaborChart series="UNRATE" title="Unemployment rate (U-3)" />

## People who want a job and don't have one

The official rate only counts people who looked for work in the last four weeks. The second line is everyone else who says they want a job but did not look. They are not counted as unemployed. Add the two lines together for the real number of people who want work.

<LaborChart series="UNEMPLOY,NILFWJN" title="Unemployed, and not in the labor force but want a job" />

## How much of the population is working

A falling unemployment rate can mean people found jobs or stopped looking. These two tell you which. Both are shares of everyone age 16 and over, so nobody drops out of the math.

<LaborChart series="CIVPART,EMRATIO" title="Labor force participation and employment to population" />

## Payroll jobs since 1939

The other headline number. It comes from the employer survey (CES), not the household survey, and it counts jobs, not people. The "jobs added" figure in the news is the change in this line from one month to the next. The latest two months are preliminary.

<LaborChart series="PAYEMS" title="Nonfarm payroll jobs" />

## All six measures, U-1 to U-6

U-3 is one of six. U-1 and U-2 are narrower. U-4 through U-6 add people the official rate leaves out, and BLS has published those three in their current form only since 1994. [See what each one counts.](#what-u-1-to-u-6-mean) Click a name in the legend to hide it.

<LaborChart series="U1RATE,U2RATE,UNRATE,U4RATE,U5RATE,U6RATE" title="Alternative measures of labor underutilization" />

## Seasonally adjusted vs. not

The headline rate is seasonally adjusted. The unadjusted rate is what the survey actually measured that month, and it jumps every winter and again in early summer.

<LaborChart series="UNRATE,UNRATENSA" title="Unemployment rate, adjusted and unadjusted" />

## Labor force headcounts

Labor force plus not in the labor force equals everyone age 16 and over.

<LaborChart series="CLF16OV,CE16OV,LNS15000000" title="Labor force, employed, and not in the labor force" />

## Government jobs

Federal, state, and local combined. This is one slice of the payroll total above.

<LaborChart series="USGOVT" title="Government payroll jobs" />

## How much the numbers get revised

The top panel is the unemployment rate as it stands today. The bars underneath show how far each month has moved from the number first announced. Green means it was revised up, red means down.

<RevisionChart series="UNRATE" />

## About the data

Monthly national series from the Bureau of Labor Statistics, pulled through [ALFRED](https://alfred.stlouisfed.org/), the St. Louis Fed's archive of every published version of each number. Recession dates are from the [NBER](https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions).

## What may be preliminary

**Payroll jobs for the latest two months.** These are first estimates. BLS revises each one in the next two monthly reports, then again once a year when it checks the survey against unemployment insurance tax records.

**The unemployment rate and the other household survey numbers are not preliminary.** The survey results are never revised. Only the seasonal adjustment is recalculated, every January, for the previous five years. That usually moves a month by 0.1 point or not at all. This is why the last five years are drawn dashed.

**The unadjusted rate is final the day it is published.**

**October 2025 is blank for every household survey number.** BLS could not run the survey during the federal government shutdown and says it cannot be collected after the fact. Payroll jobs for that month were published. [Source: BLS statement, via AP](https://www.smdailyjournal.com/business/labor-department-wont-release-full-october-jobs-report-a-casualty-of-the-43-day-federal/article_f2a32a2f-7da3-5ea3-8cc2-2da484e6d7bd.html)

## Latest numbers

<LaborLatest series="UNRATE,U6RATE,CIVPART,EMRATIO,UNEMPLOY,PAYEMS,USGOVT" />

## What U-1 to U-6 mean

All six come from the same household survey. Each one counts a wider group than the one before it. For the full definitions, see [The Unemployment Numbers, Broken Down](/posts/2026-08-30_unemployment-survey-categories#the-six-rates).

| Rate | Numerator | Denominator |
|---|---|---|
| U-1 | Unemployed 15 weeks or longer | Labor force |
| U-2 | Job losers + completed temporary jobs | Labor force |
| U-3 | All unemployed (official rate) | Labor force |
| U-4 | Unemployed + discouraged | Labor force + discouraged |
| U-5 | Unemployed + all marginally attached | Labor force + marginally attached |
| U-6 | Unemployed + marginally attached + involuntary part time | Labor force + marginally attached |

## Read the full explainer

[The Unemployment Numbers, Broken Down](/posts/2026-08-30_unemployment-survey-categories) covers which survey measures what, all six U rates, what you can derive by combining them, and the BLS series IDs for pulling the data yourself.

## Which program produces what

| Variable | Program |
|---|---|
| Unemployment rate, U-1 to U-6 | CPS only |
| Payroll jobs, hours, earnings | CES |
| County-level employment and wages | QCEW |
| Openings, hires, quits, layoffs | JOLTS |
| State and county unemployment rates | LAUS |
| Insured unemployment rate | UI claims |
