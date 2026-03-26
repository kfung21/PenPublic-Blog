# Python SDK Guide

This guide shows how to use the PenPublic API with Python for data analysis, automation, and integration into your data science workflows.

## Installation

First, install required packages:

```bash
pip install requests pandas matplotlib seaborn
```

For Jupyter notebook users:
```bash
pip install jupyter plotly
```

## Quick Start

### Basic Configuration

```python
import requests
import pandas as pd
import json
from datetime import datetime
import time

class PenPublicAPI:
    def __init__(self, api_key, base_url="https://api.penpublic.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get(self, endpoint, params=None):
        """Make GET request with automatic retry and error handling"""
        url = f"{self.base_url}{endpoint}"
        
        for attempt in range(3):
            try:
                response = self.session.get(url, params=params)
                
                if response.status_code == 429:  # Rate limited
                    retry_after = int(response.headers.get('Retry-After', 60))
                    print(f"Rate limited. Waiting {retry_after} seconds...")
                    time.sleep(retry_after)
                    continue
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == 2:  # Last attempt
                    raise
                print(f"Request failed, retrying... ({e})")
                time.sleep(2 ** attempt)  # Exponential backoff

# Initialize client
api = PenPublicAPI("pp_live_your_api_key_here")
```

## Core Functions

### 1. Job Search and Analysis

```python
def search_jobs(api, state="CA", min_salary=None, agency=None, limit=1000):
    """
    Search for jobs with filters and return as DataFrame
    """
    all_jobs = []
    page = 1
    
    while True:
        params = {
            "state": state,
            "page": page,
            "limit": min(limit, 100)  # API max is 100 per page
        }
        
        if min_salary:
            params["min_salary"] = min_salary
        if agency:
            params["agency"] = agency
        
        response = api.get("/api/v1/jobs", params)
        jobs = response.get("data", [])
        all_jobs.extend(jobs)
        
        # Check if more pages
        pagination = response.get("pagination", {})
        if page >= pagination.get("totalPages", 1) or len(all_jobs) >= limit:
            break
        
        page += 1
        time.sleep(0.1)  # Be nice to the API
    
    # Convert to DataFrame
    df = pd.DataFrame(all_jobs[:limit])
    
    # Convert salary columns to numeric
    if not df.empty:
        df['salary_annual_min'] = pd.to_numeric(df['salary_annual_min'], errors='coerce')
        df['salary_annual_max'] = pd.to_numeric(df['salary_annual_max'], errors='coerce')
    
    return df

# Example usage
jobs_df = search_jobs(api, state="CA", min_salary=80000)
print(f"Found {len(jobs_df)} jobs")
print(jobs_df[['job_name', 'agency_name', 'salary_annual_min', 'salary_annual_max']].head())
```

### 2. Market Intelligence Functions

```python
def get_market_concentration(api, state="CA"):
    """Get market concentration analysis"""
    response = api.get("/api/v1/intelligence/market-concentration", {"state": state})
    
    # Convert to DataFrame for easy analysis
    concentration_df = pd.DataFrame(response['marketConcentration'])
    
    # Add insights
    print("Market Insights:")
    for insight in response.get('insights', []):
        print(f"• {insight}")
    
    return concentration_df, response['summary']

def get_top_agencies(api, state="CA", limit=20):
    """Get top hiring agencies"""
    response = api.get("/api/v1/intelligence/agency-velocity", 
                      {"state": state, "limit": limit})
    
    agencies_df = pd.DataFrame(response['topHiringAgencies'])
    
    # Extract salary ranges
    agencies_df['avg_min_salary'] = agencies_df['avgSalaryRange'].apply(lambda x: x['min'])
    agencies_df['avg_max_salary'] = agencies_df['avgSalaryRange'].apply(lambda x: x['max'])
    
    return agencies_df

def get_salary_insights(api, state="CA", group_by="job_type"):
    """Get salary analysis by category"""
    response = api.get("/api/v1/intelligence/salary-insights",
                      {"state": state, "group_by": group_by})
    
    salary_df = pd.DataFrame(response['salaryInsights'])
    
    # Flatten nested salary data
    salary_df['avg_min'] = salary_df['avgSalaryRange'].apply(lambda x: x['min'])
    salary_df['avg_max'] = salary_df['avgSalaryRange'].apply(lambda x: x['max'])
    salary_df['lowest'] = salary_df['salarySpread'].apply(lambda x: x['lowest'])
    salary_df['highest'] = salary_df['salarySpread'].apply(lambda x: x['highest'])
    
    return salary_df
```

## Data Analysis Examples

### 1. Comprehensive Market Analysis

```python
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_state_market(api, state="CA"):
    """
    Comprehensive analysis of a state's job market
    """
    # Set up plotting
    plt.style.use('seaborn-v0_8')
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # 1. Market Concentration
    concentration_df, summary = get_market_concentration(api, state)
    top_10 = concentration_df.head(10)
    
    axes[0, 0].barh(top_10['city'], top_10['jobCount'])
    axes[0, 0].set_xlabel('Number of Jobs')
    axes[0, 0].set_title('Top 10 Cities by Job Count')
    axes[0, 0].invert_yaxis()
    
    # 2. Agency Analysis
    agencies_df = get_top_agencies(api, state, limit=10)
    
    axes[0, 1].scatter(agencies_df['jobCount'], 
                       agencies_df['avg_max_salary'],
                       s=agencies_df['marketShare']*20,
                       alpha=0.6)
    axes[0, 1].set_xlabel('Number of Jobs Posted')
    axes[0, 1].set_ylabel('Average Max Salary')
    axes[0, 1].set_title('Agency Size vs Salary (bubble size = market share)')
    
    # Add agency labels
    for idx, row in agencies_df.head(5).iterrows():
        axes[0, 1].annotate(row['agencyName'][:20], 
                           (row['jobCount'], row['avg_max_salary']),
                           fontsize=8)
    
    # 3. Salary Distribution by Job Type
    salary_df = get_salary_insights(api, state, "job_type")
    
    salary_data = salary_df.head(10).sort_values('avg_max', ascending=True)
    y_pos = range(len(salary_data))
    
    axes[1, 0].barh(y_pos, salary_data['avg_max'] - salary_data['avg_min'],
                    left=salary_data['avg_min'], alpha=0.8)
    axes[1, 0].set_yticks(y_pos)
    axes[1, 0].set_yticklabels(salary_data['category'])
    axes[1, 0].set_xlabel('Salary Range ($)')
    axes[1, 0].set_title('Salary Ranges by Job Type')
    
    # 4. Geographic Hotspots
    hotspots_response = api.get("/api/v1/intelligence/geographic-hotspots",
                               {"state": state, "min_jobs": 50})
    hotspots_df = pd.DataFrame(hotspots_response['hotspots'])
    
    top_hotspots = hotspots_df.head(15)
    colors = ['red' if x == 'High' else 'orange' if x == 'Medium' else 'green' 
              for x in top_hotspots['opportunityRating']]
    
    axes[1, 1].scatter(top_hotspots['jobShare'], 
                      top_hotspots['uniqueAgencies'],
                      s=top_hotspots['jobCount']/10,
                      c=colors, alpha=0.6)
    axes[1, 1].set_xlabel('Job Market Share (%)')
    axes[1, 1].set_ylabel('Number of Unique Agencies')
    axes[1, 1].set_title('Market Share vs Agency Diversity')
    
    # Add city labels for top 5
    for idx, row in top_hotspots.head(5).iterrows():
        axes[1, 1].annotate(row['city'], 
                           (row['jobShare'], row['uniqueAgencies']),
                           fontsize=8)
    
    plt.tight_layout()
    plt.suptitle(f'{state} Government Job Market Analysis', 
                 fontsize=16, y=1.02)
    
    # Print summary statistics
    print(f"\n{state} Market Summary:")
    print(f"Total Jobs: {summary['totalJobs']:,}")
    print(f"Unique Agencies: {summary['uniqueAgencies']}")
    print(f"Average Salary Range: ${summary['avgSalaryRange']['min']:,} - ${summary['avgSalaryRange']['max']:,}")
    
    return fig

# Run analysis
fig = analyze_state_market(api, "CA")
plt.show()
```

### 2. Contract Opportunity Finder

```python
def find_contract_opportunities(api, state="CA", min_job_threshold=100):
    """
    Identify agencies with high contract potential
    """
    # Get agency data
    agencies_df = get_top_agencies(api, state, limit=50)
    
    # Filter for high-volume hiring
    opportunities = agencies_df[agencies_df['jobCount'] >= min_job_threshold].copy()
    
    # Calculate opportunity score
    opportunities['opportunity_score'] = (
        opportunities['jobCount'] * 0.4 +  # Volume weight
        opportunities['marketShare'] * 10 +  # Market presence
        (opportunities['departments'] * 5)   # Department diversity
    )
    
    # Categorize contract potential
    opportunities['contract_size'] = pd.cut(
        opportunities['jobCount'],
        bins=[0, 200, 500, 1000, 10000],
        labels=['$5M-$20M', '$20M-$50M', '$50M-$100M', '$100M+']
    )
    
    # Sort by opportunity
    opportunities = opportunities.sort_values('opportunity_score', ascending=False)
    
    # Create visualization
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # Top opportunities
    top_10 = opportunities.head(10)
    ax1.barh(range(len(top_10)), top_10['opportunity_score'])
    ax1.set_yticks(range(len(top_10)))
    ax1.set_yticklabels(top_10['agencyName'].str[:30])
    ax1.set_xlabel('Opportunity Score')
    ax1.set_title('Top 10 Contract Opportunities')
    ax1.invert_yaxis()
    
    # Contract size distribution
    contract_dist = opportunities['contract_size'].value_counts()
    ax2.pie(contract_dist.values, labels=contract_dist.index, autopct='%1.1f%%')
    ax2.set_title('Distribution of Contract Sizes')
    
    plt.tight_layout()
    
    return opportunities[['agencyName', 'agencyType', 'jobCount', 'marketShare',
                         'hiringCategory', 'contractPotential', 'opportunity_score']]

# Find opportunities
opportunities_df = find_contract_opportunities(api, "CA")
print("\nTop Contract Opportunities:")
print(opportunities_df.head(10))
```

### 3. Salary Trend Analysis

```python
def analyze_salary_trends(api, state="CA"):
    """
    Comprehensive salary analysis across dimensions
    """
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # 1. By Job Type
    job_type_df = get_salary_insights(api, state, "job_type")
    job_type_df = job_type_df.sort_values('avg_max', ascending=False).head(15)
    
    axes[0, 0].barh(job_type_df['category'], job_type_df['avg_max'], 
                    alpha=0.7, label='Max')
    axes[0, 0].barh(job_type_df['category'], job_type_df['avg_min'], 
                    alpha=0.7, label='Min')
    axes[0, 0].set_xlabel('Average Salary ($)')
    axes[0, 0].set_title('Salary by Job Type')
    axes[0, 0].legend()
    axes[0, 0].invert_yaxis()
    
    # 2. By Agency Type
    agency_type_df = get_salary_insights(api, state, "agency_type")
    
    x = range(len(agency_type_df))
    width = 0.35
    
    axes[0, 1].bar([i - width/2 for i in x], agency_type_df['avg_min'], 
                   width, label='Avg Min', alpha=0.7)
    axes[0, 1].bar([i + width/2 for i in x], agency_type_df['avg_max'], 
                   width, label='Avg Max', alpha=0.7)
    axes[0, 1].set_xticks(x)
    axes[0, 1].set_xticklabels(agency_type_df['category'], rotation=45)
    axes[0, 1].set_ylabel('Salary ($)')
    axes[0, 1].set_title('Salary by Agency Type')
    axes[0, 1].legend()
    
    # 3. By City (Top 10)
    city_df = get_salary_insights(api, state, "city")
    city_df = city_df.sort_values('jobCount', ascending=False).head(10)
    
    # Calculate salary midpoint for sorting
    city_df['salary_mid'] = (city_df['avg_min'] + city_df['avg_max']) / 2
    city_df = city_df.sort_values('salary_mid', ascending=True)
    
    axes[1, 0].scatter(city_df['jobCount'], city_df['salary_mid'], 
                      s=100, alpha=0.6)
    
    for idx, row in city_df.iterrows():
        axes[1, 0].annotate(row['category'], 
                           (row['jobCount'], row['salary_mid']),
                           fontsize=8, ha='right')
    
    axes[1, 0].set_xlabel('Number of Jobs')
    axes[1, 0].set_ylabel('Average Salary Midpoint ($)')
    axes[1, 0].set_title('Salary vs Job Volume by City')
    
    # 4. Premium Level Distribution
    all_insights = []
    for group in ['job_type', 'agency_type', 'city']:
        df = get_salary_insights(api, state, group)
        all_insights.extend(df['premiumLevel'].tolist())
    
    premium_counts = pd.Series(all_insights).value_counts()
    colors = {'Premium': 'gold', 'High': 'silver', 'Standard': 'bronze'}
    
    axes[1, 1].pie(premium_counts.values, labels=premium_counts.index, 
                   autopct='%1.1f%%',
                   colors=[colors.get(x, 'gray') for x in premium_counts.index])
    axes[1, 1].set_title('Distribution of Salary Premium Levels')
    
    plt.tight_layout()
    plt.suptitle(f'{state} Salary Analysis', fontsize=16, y=1.02)
    
    # Calculate insights
    print(f"\nSalary Insights for {state}:")
    print(f"Highest paying job type: {job_type_df.iloc[0]['category']} "
          f"(${job_type_df.iloc[0]['avg_max']:,.0f})")
    print(f"Highest paying city: {city_df.iloc[-1]['category']} "
          f"(${city_df.iloc[-1]['salary_mid']:,.0f})")
    print(f"Total premium positions: {premium_counts.get('Premium', 0)} categories")
    
    return fig

# Run analysis
salary_fig = analyze_salary_trends(api, "CA")
plt.show()
```

## Automation Examples

### 1. Weekly Report Generator

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def generate_weekly_report(api, state="CA", email_to=None):
    """
    Generate and optionally email a weekly report
    """
    # Get data
    summary = api.get("/api/v1/summary/weekly", {"state": state})
    agencies_df = get_top_agencies(api, state, limit=10)
    concentration_df, _ = get_market_concentration(api, state)
    
    # Create report
    report = f"""
    PenPublic Weekly Report - {state}
    Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
    
    EXECUTIVE SUMMARY
    ================
    Total Opportunities: {summary['summary']['totalOpportunities']:,}
    Agencies Hiring: {summary['summary']['agenciesHiring']}
    Average Salary Range: ${summary['summary']['avgSalaryRange']['min']:,} - ${summary['summary']['avgSalaryRange']['max']:,}
    
    TOP HIRING AGENCY
    ================
    {summary['highlights']['topHiringAgency']['name']}
    Jobs Posted: {summary['highlights']['topHiringAgency']['jobCount']}
    
    HIGHEST PAYING POSITIONS
    =======================
    """
    
    for job in summary['highlights']['highestPayingJobs']:
        report += f"\n• {job['jobName']}"
        report += f"\n  Agency: {job['agency']}"
        report += f"\n  Max Salary: ${job['maxSalary']:,}"
        report += "\n"
    
    report += "\nACTION ITEMS\n============\n"
    for item in summary['actionItems']:
        report += f"• {item}\n"
    
    # Save report
    filename = f"weekly_report_{state}_{datetime.now().strftime('%Y%m%d')}.txt"
    with open(filename, 'w') as f:
        f.write(report)
    
    # Create visualizations
    fig = analyze_state_market(api, state)
    fig.savefig(f"weekly_charts_{state}_{datetime.now().strftime('%Y%m%d')}.png", 
                dpi=150, bbox_inches='tight')
    
    # Send email if requested
    if email_to:
        send_report_email(email_to, report, filename)
    
    print(f"Report generated: {filename}")
    return report

def send_report_email(to_email, report_text, attachment_path):
    """Send report via email"""
    # Email configuration (update with your settings)
    from_email = "your-email@example.com"
    password = "your-app-password"
    
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = f"PenPublic Weekly Report - {datetime.now().strftime('%Y-%m-%d')}"
    
    msg.attach(MIMEText(report_text, 'plain'))
    
    # Attach file
    with open(attachment_path, "rb") as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 
                       f"attachment; filename= {attachment_path}")
        msg.attach(part)
    
    # Send email
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, password)
    server.send_message(msg)
    server.quit()

# Generate report
report = generate_weekly_report(api, "CA")
```

### 2. Real-time Dashboard with Streamlit

```python
# save as penpublic_dashboard.py
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(page_title="PenPublic Dashboard", layout="wide")

# Initialize API (use secrets in production)
if 'api' not in st.session_state:
    api_key = st.text_input("Enter API Key:", type="password")
    if api_key:
        st.session_state.api = PenPublicAPI(api_key)
        st.rerun()
    else:
        st.stop()

api = st.session_state.api

# Sidebar
st.sidebar.title("PenPublic Dashboard")
state = st.sidebar.selectbox("Select State:", ["CA", "NY", "TX", "FL"])
refresh = st.sidebar.button("Refresh Data")

# Main layout
st.title(f"Government Jobs Analysis - {state}")

# Metrics row
col1, col2, col3, col4 = st.columns(4)

with st.spinner("Loading data..."):
    # Get summary
    summary = api.get("/api/v1/summary/weekly", {"state": state})['summary']
    
    col1.metric("Total Jobs", f"{summary['totalOpportunities']:,}")
    col2.metric("Agencies Hiring", summary['agenciesHiring'])
    col3.metric("Avg Min Salary", f"${summary['avgSalaryRange']['min']:,}")
    col4.metric("Avg Max Salary", f"${summary['avgSalaryRange']['max']:,}")

# Charts
col1, col2 = st.columns(2)

with col1:
    st.subheader("Top Hiring Agencies")
    agencies_df = get_top_agencies(api, state, limit=10)
    
    fig = px.bar(agencies_df, x='jobCount', y='agencyName', 
                 orientation='h', title="Jobs by Agency",
                 labels={'jobCount': 'Number of Jobs', 'agencyName': 'Agency'})
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.subheader("Geographic Distribution")
    concentration_df, _ = get_market_concentration(api, state)
    
    fig = px.pie(concentration_df.head(10), values='jobCount', 
                 names='city', title="Jobs by City")
    st.plotly_chart(fig, use_container_width=True)

# Detailed table
st.subheader("Job Search")
with st.form("search_form"):
    col1, col2, col3 = st.columns(3)
    with col1:
        min_salary = st.number_input("Min Salary", value=0, step=10000)
    with col2:
        agency_filter = st.text_input("Agency (partial match)")
    with col3:
        limit = st.number_input("Max Results", value=100, max_value=1000)
    
    search = st.form_submit_button("Search")

if search:
    jobs_df = search_jobs(api, state, min_salary, agency_filter, limit)
    st.dataframe(jobs_df[['job_name', 'agency_name', 'city', 
                         'salary_annual_min', 'salary_annual_max']])
    
    # Download button
    csv = jobs_df.to_csv(index=False)
    st.download_button("Download CSV", csv, "jobs_export.csv", "text/csv")
```

### 3. Automated Monitoring Script

```python
import schedule
import time
from datetime import datetime

class JobMonitor:
    def __init__(self, api, config):
        self.api = api
        self.config = config
        self.last_check = {}
    
    def check_new_opportunities(self, state, criteria):
        """Check for new jobs matching criteria"""
        jobs_df = search_jobs(self.api, state, 
                            min_salary=criteria.get('min_salary'),
                            agency=criteria.get('agency'))
        
        # Filter for recent posts
        if 'posted_date' in jobs_df.columns:
            jobs_df['posted_date'] = pd.to_datetime(jobs_df['posted_date'])
            recent = jobs_df[jobs_df['posted_date'] >= datetime.now() - pd.Timedelta(days=7)]
            
            if len(recent) > 0:
                self.notify_new_jobs(recent, criteria)
        
        return len(jobs_df)
    
    def check_agency_changes(self, state):
        """Monitor significant agency hiring changes"""
        agencies_df = get_top_agencies(self.api, state)
        
        # Compare with last check
        key = f"agencies_{state}"
        if key in self.last_check:
            prev_df = self.last_check[key]
            
            # Find agencies with significant changes
            merged = agencies_df.merge(prev_df, on='agencyName', 
                                     suffixes=('_new', '_old'))
            merged['change'] = merged['jobCount_new'] - merged['jobCount_old']
            
            significant = merged[abs(merged['change']) > 50]
            if len(significant) > 0:
                self.notify_agency_changes(significant)
        
        self.last_check[key] = agencies_df
    
    def notify_new_jobs(self, jobs_df, criteria):
        """Send notification about new jobs"""
        print(f"\n🔔 NEW JOBS ALERT - {datetime.now()}")
        print(f"Found {len(jobs_df)} new jobs matching criteria:")
        print(f"  Min Salary: ${criteria.get('min_salary', 0):,}")
        if criteria.get('agency'):
            print(f"  Agency: {criteria['agency']}")
        
        print("\nTop 5 new positions:")
        for _, job in jobs_df.head().iterrows():
            print(f"  • {job['job_name']} at {job['agency_name']}")
            print(f"    ${job['salary_annual_min']:,.0f} - ${job['salary_annual_max']:,.0f}")
    
    def notify_agency_changes(self, changes_df):
        """Send notification about agency changes"""
        print(f"\n📊 AGENCY ACTIVITY ALERT - {datetime.now()}")
        print("Significant hiring changes detected:")
        
        for _, agency in changes_df.iterrows():
            change = agency['change']
            direction = "↑" if change > 0 else "↓"
            print(f"  {direction} {agency['agencyName']}: "
                  f"{abs(change)} jobs ({change:+.0f})")
    
    def run_daily_check(self):
        """Run all daily checks"""
        print(f"\nRunning daily check at {datetime.now()}")
        
        for monitor in self.config['monitors']:
            state = monitor['state']
            
            # Check new opportunities
            if 'job_criteria' in monitor:
                self.check_new_opportunities(state, monitor['job_criteria'])
            
            # Check agency changes
            if monitor.get('track_agencies', True):
                self.check_agency_changes(state)
        
        print("Daily check complete.")

# Configuration
monitor_config = {
    'monitors': [
        {
            'state': 'CA',
            'job_criteria': {
                'min_salary': 100000,
                'agency': 'Health'
            },
            'track_agencies': True
        }
    ]
}

# Initialize monitor
monitor = JobMonitor(api, monitor_config)

# Schedule daily runs
schedule.every().day.at("09:00").do(monitor.run_daily_check)

# Run scheduler
print("Job monitor started. Press Ctrl+C to stop.")
monitor.run_daily_check()  # Run once immediately

while True:
    schedule.run_pending()
    time.sleep(60)
```

## Advanced Features

### 1. Data Export and Integration

```python
def export_to_multiple_formats(data_dict, base_filename):
    """Export data in multiple formats"""
    # Excel with multiple sheets
    with pd.ExcelWriter(f"{base_filename}.xlsx", engine='openpyxl') as writer:
        for sheet_name, df in data_dict.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)
    
    # JSON for web apps
    combined_json = {}
    for name, df in data_dict.items():
        combined_json[name] = df.to_dict('records')
    
    with open(f"{base_filename}.json", 'w') as f:
        json.dump(combined_json, f, indent=2)
    
    # Parquet for big data tools
    for name, df in data_dict.items():
        df.to_parquet(f"{base_filename}_{name}.parquet")
    
    print(f"Exported data to {base_filename}.[xlsx|json|parquet]")

# Example usage
data_to_export = {
    'jobs': search_jobs(api, "CA", limit=1000),
    'agencies': get_top_agencies(api, "CA", limit=50),
    'market_concentration': get_market_concentration(api, "CA")[0],
    'salary_insights': get_salary_insights(api, "CA")
}

export_to_multiple_formats(data_to_export, "penpublic_export_20250115")
```

### 2. Predictive Analytics

```python
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

def predict_hiring_trends(api, state="CA"):
    """Simple predictive model for hiring trends"""
    # Get historical data (would need multiple time periods in real scenario)
    agencies_df = get_top_agencies(api, state, limit=100)
    
    # Prepare features
    le = LabelEncoder()
    agencies_df['agency_type_encoded'] = le.fit_transform(agencies_df['agencyType'])
    
    # Simple model: predict job count based on features
    features = ['marketShare', 'avg_min_salary', 'departments', 'agency_type_encoded']
    X = agencies_df[features]
    y = agencies_df['jobCount']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Make predictions
    agencies_df['predicted_growth'] = model.predict(X) * 1.1  # 10% growth assumption
    agencies_df['growth_potential'] = agencies_df['predicted_growth'] - agencies_df['jobCount']
    
    # Identify high-growth agencies
    high_growth = agencies_df.nlargest(10, 'growth_potential')
    
    print("Agencies with Highest Growth Potential:")
    for _, agency in high_growth.iterrows():
        print(f"{agency['agencyName']}: +{agency['growth_potential']:.0f} jobs")
    
    return high_growth
```

## Error Handling Best Practices

```python
class PenPublicAPIError(Exception):
    """Custom exception for API errors"""
    pass

def safe_api_call(func):
    """Decorator for safe API calls"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                raise PenPublicAPIError("Rate limit exceeded. Please try again later.")
            elif e.response.status_code == 401:
                raise PenPublicAPIError("Invalid API key.")
            else:
                raise PenPublicAPIError(f"API error: {e}")
        except requests.exceptions.ConnectionError:
            raise PenPublicAPIError("Connection error. Please check your internet connection.")
        except Exception as e:
            raise PenPublicAPIError(f"Unexpected error: {e}")
    return wrapper

# Use with API methods
@safe_api_call
def get_jobs_safely(api, **