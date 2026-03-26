# PenPublic API Overview

The PenPublic API provides programmatic access to government job postings data, market intelligence, and hiring insights. This RESTful API enables you to integrate government job market data directly into your applications, reports, and analysis tools.

## Availability
- **Documentation**: See language-specific guides for [Excel/VBA](./api-excel), [Python](./api-python), and [JavaScript](./api-javascript)

## Getting Started

### Base URL
```
https://api.penpublic.com
```

### Authentication

All API requests require an API key in the request header:

```
X-API-Key: pp_live_xY3kL9mN...
```

### Rate Limits

| Plan | Daily Limit | Use Case |
|------|------------|----------|
| Basic | 1,000 requests | Individual analysts, small teams |
| Professional | 10,000 requests | Departments, regular reporting |
| Enterprise | 100,000 requests | Large organizations, apps |

## Available Endpoints

### Core Data Access

#### Search Jobs
```
GET /api/v1/jobs
```
Search and filter government job postings with pagination support.

**Key Features:**
- Filter by state, agency, salary range
- Paginated results (up to 1,000 per page)
- Full job details including salary, location, department

#### Get Job Details
```
GET /api/v1/jobs/{job_id}
```
Retrieve complete details for a specific job posting.

### Intelligence Endpoints

#### Market Concentration
```
GET /api/v1/intelligence/market-concentration
```
Analyze job distribution across geographic areas to identify hotspots and underserved markets.

**Insights Provided:**
- Regional job concentration
- Market share by city
- Concentration ratios
- Population-adjusted metrics

#### Agency Velocity
```
GET /api/v1/intelligence/agency-velocity
```
Track hiring activity and identify agencies with aggressive recruitment.

**Insights Provided:**
- Top hiring agencies
- Hiring velocity trends
- Department-level breakdowns
- Contract potential estimates

#### Salary Insights
```
GET /api/v1/intelligence/salary-insights
```
Analyze compensation trends across different dimensions.

**Group By Options:**
- Job type
- Agency type
- City
- Department

#### Geographic Hotspots
```
GET /api/v1/intelligence/geographic-hotspots
```
Identify cities and regions with high job concentrations relative to population.

**Metrics Included:**
- Jobs per capita
- Concentration scores
- Regional rankings
- Opportunity ratings

#### Weekly Summary
```
GET /api/v1/summary/weekly
```
Get pre-computed weekly insights and trending data.

## Response Format

All responses are returned in JSON format with consistent structure:

### Successful Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 2456,
    "totalPages": 25
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Rate limit exceeded",
  "code": 429,
  "limit": 1000,
  "reset": "Daily at 00:00 UTC"
}
```

## Common Use Cases

### 1. Contractor Market Research
Find agencies with high hiring velocity to identify potential contract opportunities:
- Use `/api/v1/intelligence/agency-velocity` to find aggressive hiring patterns
- Cross-reference with `/api/v1/jobs` to understand specific needs
- Estimate contract values based on hiring volume

### 2. Geographic Expansion Planning
Identify optimal locations for business expansion:
- Use `/api/v1/intelligence/geographic-hotspots` to find high-opportunity areas
- Analyze market concentration to avoid oversaturated regions
- Compare salary ranges across locations

### 3. Competitive Intelligence
Track government hiring trends and budget signals:
- Monitor weekly summaries for trend changes
- Analyze department-level hiring patterns
- Identify emerging skill demands

### 4. Salary Benchmarking
Understand compensation trends for government positions:
- Compare salaries across agencies and locations
- Identify premium-paying departments
- Track salary trend changes over time

## Best Practices

### Caching
- Cache market intelligence endpoints for 1-4 hours
- Cache job search results for 15-30 minutes
- Always respect `Cache-Control` headers

### Pagination
- Use pagination for large result sets
- Default page size is 100, maximum is 1,000
- Always check `totalPages` in response

### Error Handling
- Implement exponential backoff for rate limits
- Check for 4xx errors before retrying
- Monitor your daily usage to avoid limits


## Next Steps

Choose your preferred programming language or tool:
- [Excel/VBA Integration Guide](./api-excel) - For analysts and Excel power users
- [Python SDK Guide](./api-python) - For data scientists and automation
- [JavaScript Guide](./api-javascript) - For web applications and Node.js
