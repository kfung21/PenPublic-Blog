# JavaScript Guide

This guide covers using the PenPublic API with JavaScript for web applications, Node.js scripts, and modern frameworks like React and Vue.

## Quick Start

### Browser (Vanilla JavaScript)

```javascript
// Basic API client
class PenPublicAPI {
  constructor(apiKey, baseUrl = 'https://api.penpublic.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Initialize
const api = new PenPublicAPI('pp_live_your_api_key');

// Example usage
async function searchJobs() {
  const jobs = await api.get('/api/v1/jobs', {
    state: 'CA',
    min_salary: 80000,
    limit: 50
  });
  
  console.log(`Found ${jobs.pagination.total} jobs`);
  return jobs.data;
}
```

### Node.js

```bash
npm install axios dotenv
```

```javascript
// penpublic-client.js
const axios = require('axios');
require('dotenv').config();

class PenPublicClient {
  constructor(apiKey = process.env.PENPUBLIC_API_KEY) {
    this.apiKey = apiKey;
    this.baseURL = process.env.PENPUBLIC_BASE_URL || 'https://api.penpublic.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      this.handleError.bind(this)
    );
  }
  
  async handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 60;
        console.log(`Rate limited. Retry after ${retryAfter} seconds`);
      }
      
      throw new Error(data.error || `API error: ${status}`);
    }
    throw error;
  }
  
  async get(endpoint, params = {}) {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }
  
  // Convenience methods
  async searchJobs(filters = {}) {
    return this.get('/api/v1/jobs', filters);
  }
  
  async getJob(jobId) {
    return this.get(`/api/v1/jobs/${jobId}`);
  }
  
  async getMarketConcentration(state = 'CA') {
    return this.get('/api/v1/intelligence/market-concentration', { state });
  }
  
  async getAgencyVelocity(state = 'CA', limit = 20) {
    return this.get('/api/v1/intelligence/agency-velocity', { state, limit });
  }
  
  async getSalaryInsights(state = 'CA', groupBy = 'job_type') {
    return this.get('/api/v1/intelligence/salary-insights', { state, group_by: groupBy });
  }
}

module.exports = PenPublicClient;
```

## React Integration

### 1. React Hook for API Calls

```javascript
// hooks/usePenPublic.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_PENPUBLIC_URL || 'https://api.penpublic.com';
const API_KEY = process.env.REACT_APP_PENPUBLIC_KEY;

export function usePenPublic(endpoint, params = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);
  
  useEffect(() => {
    if (!options.manual) {
      fetchData();
    }
  }, [fetchData, options.manual]);
  
  return { data, loading, error, refetch: fetchData };
}

// Usage in component
function JobSearch() {
  const [filters, setFilters] = useState({ state: 'CA', min_salary: 60000 });
  const { data, loading, error, refetch } = usePenPublic('/api/v1/jobs', filters);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Found {data.pagination.total} jobs</h2>
      {data.data.map(job => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  );
}
```

### 2. Complete React Dashboard

```javascript
// components/PenPublicDashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function PenPublicDashboard() {
  const [state, setState] = useState('CA');
  const [marketData, setMarketData] = useState(null);
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, [state]);
  
  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [market, agencies] = await Promise.all([
        api.get('/api/v1/intelligence/market-concentration', { state }),
        api.get('/api/v1/intelligence/agency-velocity', { state, limit: 10 })
      ]);
      
      setMarketData(market);
      setAgencyData(agencies);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            PenPublic Dashboard - {state}
          </h1>
          <select 
            value={state} 
            onChange={(e) => setState(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            title="Total Jobs" 
            value={marketData.summary.totalJobs.toLocaleString()}
            icon="📊"
          />
          <SummaryCard 
            title="Agencies Hiring" 
            value={marketData.summary.uniqueAgencies}
            icon="🏢"
          />
          <SummaryCard 
            title="Cities" 
            value={marketData.summary.uniqueCities}
            icon="📍"
          />
          <SummaryCard 
            title="Avg Salary" 
            value={`$${Math.round(marketData.summary.avgSalaryRange.max / 1000)}k`}
            icon="💰"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Concentration Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Top Cities by Jobs</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.marketConcentration.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobCount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Agency Velocity Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Top Hiring Agencies</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agencyData.topHiringAgencies.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.agencyName.substring(0, 20)}...`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="jobCount"
                >
                  {agencyData.topHiringAgencies.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Agency Table */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Agency Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Potential
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agencyData.topHiringAgencies.map((agency, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agency.agencyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.jobCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${agency.hiringCategory === 'Aggressive' ? 'bg-red-100 text-red-800' : 
                          agency.hiringCategory === 'Active' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {agency.hiringCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.contractPotential}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
```

## Vue.js Integration

### 1. Vue Composable

```javascript
// composables/usePenPublic.js
import { ref, computed, watch } from 'vue';

const API_BASE_URL = import.meta.env.VITE_PENPUBLIC_URL || 'https://api.penpublic.com';
const API_KEY = import.meta.env.VITE_PENPUBLIC_KEY;

export function usePenPublic() {
  const loading = ref(false);
  const error = ref(null);
  
  async function request(endpoint, params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    request,
    
    // Convenience methods
    searchJobs: (filters) => request('/api/v1/jobs', filters),
    getJob: (id) => request(`/api/v1/jobs/${id}`),
    getMarketConcentration: (state) => request('/api/v1/intelligence/market-concentration', { state }),
    getAgencyVelocity: (state, limit) => request('/api/v1/intelligence/agency-velocity', { state, limit }),
    getSalaryInsights: (state, groupBy) => request('/api/v1/intelligence/salary-insights', { state, group_by: groupBy })
  };
}
```

### 2. Vue Component Example

```vue
<!-- JobSearch.vue -->
<template>
  <div class="job-search">
    <div class="filters">
      <input 
        v-model="filters.state" 
        placeholder="State (e.g., CA)"
        @change="search"
      />
      <input 
        v-model.number="filters.min_salary" 
        type="number"
        placeholder="Min Salary"
        @change="search"
      />
      <input 
        v-model="filters.agency" 
        placeholder="Agency name"
        @change="search"
      />
      <button @click="search" :disabled="loading">
        {{ loading ? 'Searching...' : 'Search' }}
      </button>
    </div>
    
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-if="jobs" class="results">
      <h2>Found {{ jobs.pagination.total }} jobs</h2>
      
      <div class="job-grid">
        <JobCard 
          v-for="job in jobs.data" 
          :key="job.job_id"
          :job="job"
        />
      </div>
      
      <Pagination 
        :current="page"
        :total="jobs.pagination.totalPages"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { usePenPublic } from '@/composables/usePenPublic';
import JobCard from './JobCard.vue';
import Pagination from './Pagination.vue';

const { loading, error, searchJobs } = usePenPublic();

const filters = reactive({
  state: 'CA',
  min_salary: 60000,
  agency: ''
});

const page = ref(1);
const jobs = ref(null);

async function search() {
  try {
    jobs.value = await searchJobs({
      ...filters,
      page: page.value,
      limit: 50
    });
  } catch (err) {
    console.error('Search failed:', err);
  }
}

function changePage(newPage) {
  page.value = newPage;
  search();
}

onMounted(() => {
  search();
});
</script>
```

## Advanced Examples

### 1. Real-time Job Monitor

```javascript
// jobMonitor.js
class JobMonitor {
  constructor(apiClient, config = {}) {
    this.api = apiClient;
    this.config = {
      pollInterval: 300000, // 5 minutes
      notifications: true,
      ...config
    };
    this.lastCheck = {};
    this.subscribers = [];
  }
  
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  notify(event) {
    this.subscribers.forEach(callback => callback(event));
    
    if (this.config.notifications && 'Notification' in window) {
      new Notification('PenPublic Alert', {
        body: event.message,
        icon: '/favicon.ico'
      });
    }
  }
  
  async checkForUpdates(criteria) {
    try {
      const response = await this.api.searchJobs(criteria);
      const jobs = response.data;
      
      // Check for new jobs
      const cacheKey = JSON.stringify(criteria);
      if (this.lastCheck[cacheKey]) {
        const previousIds = new Set(this.lastCheck[cacheKey].map(j => j.job_id));
        const newJobs = jobs.filter(job => !previousIds.has(job.job_id));
        
        if (newJobs.length > 0) {
          this.notify({
            type: 'new_jobs',
            count: newJobs.length,
            jobs: newJobs,
            message: `${newJobs.length} new job(s) matching your criteria!`
          });
        }
      }
      
      this.lastCheck[cacheKey] = jobs;
      return jobs;
    } catch (error) {
      console.error('Monitor check failed:', error);
      throw error;
    }
  }
  
  start(criteria) {
    // Request notification permission
    if (this.config.notifications && 'Notification' in window) {
      Notification.requestPermission();
    }
    
    // Initial check
    this.checkForUpdates(criteria);
    
    // Set up polling
    this.intervalId = setInterval(() => {
      this.checkForUpdates(criteria);
    }, this.config.pollInterval);
    
    return () => this.stop();
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Usage
const monitor = new JobMonitor(api, {
  pollInterval: 600000, // 10 minutes
  notifications: true
});

// Subscribe to updates
const unsubscribe = monitor.subscribe(event => {
  console.log('Job update:', event);
  if (event.type === 'new_jobs') {
    updateUI(event.jobs);
  }
});

// Start monitoring
monitor.start({
  state: 'CA',
  min_salary: 100000,
  agency: 'Technology'
});
```

### 2. Data Export Utilities

```javascript
// exportUtils.js
class PenPublicExporter {
  constructor(apiClient) {
    this.api = apiClient;
  }
  
  async exportToCSV(data, filename = 'penpublic_export.csv') {
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
  }
  
  convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  }
  
  async exportToJSON(data, filename = 'penpublic_export.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
  
  async generateReport(state = 'CA') {
    console.log('Generating comprehensive report...');
    
    try {
      // Fetch all data
      const [jobs, market, agencies, salaries] = await Promise.all([
        this.api.searchJobs({ state, limit: 1000 }),
        this.api.getMarketConcentration(state),
        this.api.getAgencyVelocity(state, 50),
        this.api.getSalaryInsights(state)
      ]);
      
      // Create workbook-like structure
      const report = {
        metadata: {
          state,
          generatedAt: new Date().toISOString(),
          totalJobs: jobs.pagination.total
        },
        summary: market.summary,
        jobs: jobs.data,
        marketConcentration: market.marketConcentration,
        topAgencies: agencies.topHiringAgencies,
        salaryInsights: salaries.salaryInsights
      };
      
      // Export as JSON
      await this.exportToJSON(report, `penpublic_report_${state}_${Date.now()}.json`);
      
      // Also export individual CSVs
      await this.exportToCSV(jobs.data, `jobs_${state}.csv`);
      await this.exportToCSV(agencies.topHiringAgencies, `agencies_${state}.csv`);
      
      console.log('Report generated successfully');
      return report;
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    }
  }
}

// Usage
const exporter = new PenPublicExporter(api);

// Export current view
document.getElementById('export-csv').addEventListener('click', async () => {
  const jobs = await api.searchJobs({ state: 'CA', limit: 500 });
  exporter.exportToCSV(jobs.data, 'california_jobs.csv');
});

// Generate full report
document.getElementById('generate-report').addEventListener('click', async () => {
  await exporter.generateReport('CA');
});
```

### 3. Caching and Performance

```javascript
// cachedApi.js
class CachedPenPublicAPI extends PenPublicAPI {
  constructor(apiKey, options = {}) {
    super(apiKey, options.baseUrl);
    this.cache = new Map();
    this.cacheTime = options.cacheTime || 300000; // 5 minutes default
  }
  
  getCacheKey(endpoint, params) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }
  
  async get(endpoint, params = {}) {
    const key = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(key);
    
    // Check if cached and not expired
    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      console.log('Returning cached data for:', key);
      return cached.data;
    }
    
    // Fetch fresh data
    const data = await super.get(endpoint, params);
    
    // Cache the result
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    this.cleanCache();
    
    return data;
  }
  
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTime * 2) {
        this.cache.delete(key);
      }
    }
  }
  
  clearCache() {
    this.cache.clear();
  }
}

// IndexedDB for persistent caching
class PersistentPenPublicAPI extends PenPublicAPI {
  constructor(apiKey, options = {}) {
    super(apiKey, options.baseUrl);
    this.dbName = 'PenPublicCache';
    this.storeName = 'apiResponses';
    this.cacheTime = options.cacheTime || 3600000; // 1 hour default
    this.initDB();
  }
  
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }
  
  async get(endpoint, params = {}) {
    await this.initDB();
    
    const key = `${endpoint}:${JSON.stringify(params)}`;
    
    // Try to get from cache
    const cached = await this.getFromCache(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      console.log('Using cached data:', key);
      return cached.data;
    }
    
    // Fetch fresh data
    const data = await super.get(endpoint, params);
    
    // Store in cache
    await this.storeInCache(key, data);
    
    return data;
  }
  
  async getFromCache(key) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }
  
  async storeInCache(key, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.put({
        id: key,
        data,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
```

### 4. TypeScript Support

```typescript
// penpublic.d.ts
export interface Job {
  job_id: string;
  job_name: string;
  agency_name: string;
  agency_type: string;
  state: string;
  city: string;
  region: string;
  department: string;
  job_type: string;
  salary_annual_min: number;
  salary_annual_max: number;
  closing_date: string;
  job_url: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsResponse {
  data: Job[];
  pagination: Pagination;
}

export interface MarketSummary {
  totalJobs: number;
  uniqueAgencies: number;
  uniqueCities: number;
  avgSalaryRange: {
    min: number;
    max: number;
  };
}

export interface MarketConcentration {
  region: string;
  city: string;
  jobCount: number;
  marketShare: number;
  concentrationLevel: 'High' | 'Medium' | 'Low';
}

export interface Agency {
  agencyName: string;
  agencyType: string;
  jobCount: number;
  marketShare: number;
  avgSalaryRange: {
    min: number;
    max: number;
  };
  departments: number;
  hiringCategory: 'Aggressive' | 'Active' | 'Moderate';
  contractPotential: string;
}

// Client interface
export interface IPenPublicClient {
  searchJobs(filters?: JobFilters): Promise<JobsResponse>;
  getJob(jobId: string): Promise<Job>;
  getMarketConcentration(state: string): Promise<MarketConcentrationResponse>;
  getAgencyVelocity(state: string, limit?: number): Promise<AgencyVelocityResponse>;
  getSalaryInsights(state: string, groupBy?: string): Promise<SalaryInsightsResponse>;
}

// Typed client implementation
export class PenPublicClient implements IPenPublicClient {
  constructor(apiKey: string, baseUrl?: string);
  
  async searchJobs(filters?: JobFilters): Promise<JobsResponse>;
  async getJob(jobId: string): Promise<Job>;
  async getMarketConcentration(state: string): Promise<MarketConcentrationResponse>;
  async getAgencyVelocity(state: string, limit?: number): Promise<AgencyVelocityResponse>;
  async getSalaryInsights(state: string, groupBy?: string): Promise<SalaryInsightsResponse>;
}
```

## Error Handling and Retry Logic

```javascript
// robustClient.js
class RobustPenPublicClient extends PenPublicAPI {
  constructor(apiKey, options = {}) {
    super(apiKey, options.baseUrl);
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 30000;
  }
  
  async get(endpoint, params = {}, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle specific status codes
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
        
        if (retryCount < this.maxRetries) {
          await this.delay(retryAfter * 1000);
          return this.get(endpoint, params, retryCount + 1);
        }
        
        throw new Error('Rate limit exceeded after retries');
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle network errors with retry
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        console.log(`Retrying after error: ${error.message}`);
        await this.delay(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.get(endpoint, params, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  isRetryableError(error) {
    return error.message.includes('network') || 
           error.message.includes('timeout') ||
           error.message.includes('503');
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage with error handling
async function safeApiCall() {
  const client = new RobustPenPublicClient('pp_live_key', {
    maxRetries: 3,
    retryDelay: 2000,
    timeout: 30000
  });
  
  try {
    const jobs = await client.searchJobs({ state: 'CA', limit: 100 });
    console.log('Success:', jobs);
  } catch (error) {
    console.error('Failed after retries:', error);
    // Show user-friendly error message
    showError('Unable to fetch jobs. Please try again later.');
  }
}
```

## Browser Extension Example

```javascript
// chrome-extension/background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ apiKey: '' });
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'searchPenPublic',
    title: 'Search PenPublic for "%s"',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'searchPenPublic') {
    const { apiKey } = await chrome.storage.sync.get(['apiKey']);
    
    if (!apiKey) {
      chrome.tabs.create({ url: 'options.html' });
      return;
    }
    
    // Search for selected text
    const searchTerm = info.selectionText;
    chrome.tabs.create({
      url: `popup.html?search=${encodeURIComponent(searchTerm)}`
    });
  }
});

// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const { apiKey } = await chrome.storage.sync.get(['apiKey']);
  
  if (!apiKey) {
    document.getElementById('content').innerHTML = 
      '<p>Please set your API key in the extension options.</p>';
    return;
  }
  
  const api = new PenPublicAPI(apiKey);
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  
  if (searchTerm) {
    try {
      const results = await api.searchJobs({ 
        agency: searchTerm,
        limit: 10 
      });
      
      displayResults(results.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
});
```

## Next Steps

- Review the [API Overview](./) for complete endpoint documentation
- See [Excel/VBA Integration](./api-excel) for spreadsheet automation
- Check out [Python examples](./api-python) for data science workflows
- Check out [JavaScript examples](./api-javascript) for data science workflows
- Contact support@penpublic.com for assistance