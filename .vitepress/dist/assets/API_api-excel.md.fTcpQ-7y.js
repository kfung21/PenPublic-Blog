import{_ as a,o as n,c as p,ag as e}from"./chunks/framework.Ds6Eueu6.js";const d=JSON.parse('{"title":"Excel/VBA Integration Guide","description":"","frontmatter":{},"headers":[],"relativePath":"API/api-excel.md","filePath":"API/api-excel.md","lastUpdated":1751675960000}'),t={name:"API/api-excel.md"};function l(o,s,i,u,r,c){return n(),p("div",null,s[0]||(s[0]=[e(`<h1 id="excel-vba-integration-guide" tabindex="-1">Excel/VBA Integration Guide <a class="header-anchor" href="#excel-vba-integration-guide" aria-label="Permalink to &quot;Excel/VBA Integration Guide&quot;">​</a></h1><p>This guide shows how to integrate PenPublic API data directly into Excel using VBA macros. Perfect for analysts who want to automate government job market research without leaving Excel.</p><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><ol><li><strong>Excel 2010 or later</strong> (Windows recommended)</li><li><strong>PenPublic API key</strong></li></ol><h2 id="getting-started-in-vba" tabindex="-1">Getting Started in VBA <a class="header-anchor" href="#getting-started-in-vba" aria-label="Permalink to &quot;Getting Started in VBA&quot;">​</a></h2><p>Here&#39;s the simplest way to test the API and get your first data:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub HelloPenPublic()</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/jobs&quot;, &quot;state=CA&amp;limit=1&quot;)</span></span>
<span class="line"><span>    Range(&quot;A1&quot;).Value = response</span></span>
<span class="line"><span>    MsgBox &quot;Done! Check cell A1&quot;</span></span>
<span class="line"><span>End Sub</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Function MakeAPICall(endpoint As String, params As String) As String</span></span>
<span class="line"><span>    Dim http As Object</span></span>
<span class="line"><span>    Dim url As String</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Const API_KEY = &quot;YOUR_KEY_HERE&quot;  &#39; &lt;-- UPDATE THIS LINE ONLY!</span></span>
<span class="line"><span>    Const BASE_URL = &quot;https://d1-subscription-api.kevtfung.workers.dev&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Set http = CreateObject(&quot;MSXML2.XMLHTTP&quot;)</span></span>
<span class="line"><span>    url = BASE_URL &amp; endpoint</span></span>
<span class="line"><span>    If params &lt;&gt; &quot;&quot; Then url = url &amp; &quot;?&quot; &amp; params</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    http.Open &quot;GET&quot;, url, False</span></span>
<span class="line"><span>    http.setRequestHeader &quot;X-API-Key&quot;, API_KEY</span></span>
<span class="line"><span>    http.send</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MakeAPICall = http.responseText</span></span>
<span class="line"><span>End Function</span></span></code></pre></div><p><strong>Quick Start Steps:</strong></p><ol><li>Open Excel and press <code>Alt+F11</code> to open VBA editor</li><li>Insert → Module</li><li>Paste the code above</li><li>Replace <code>YOUR_KEY_HERE</code> with your actual API key</li><li>Press <code>F5</code> to run <code>HelloPenPublic</code></li><li>Check cell A1 for your first API response!</li></ol><h2 id="core-functions" tabindex="-1">Core Functions <a class="header-anchor" href="#core-functions" aria-label="Permalink to &quot;Core Functions&quot;">​</a></h2><h3 id="extract-value-from-api-response-no-json-parser-needed" tabindex="-1">Extract Value from API Response (No JSON Parser Needed!) <a class="header-anchor" href="#extract-value-from-api-response-no-json-parser-needed" aria-label="Permalink to &quot;Extract Value from API Response (No JSON Parser Needed!)&quot;">​</a></h3><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Function ExtractValue(json As String, fieldName As String) As String</span></span>
<span class="line"><span>    Dim startPos As Long</span></span>
<span class="line"><span>    Dim endPos As Long</span></span>
<span class="line"><span>    Dim searchStr As String</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Look for &quot;fieldName&quot;:&quot;value&quot; or &quot;fieldName&quot;:value</span></span>
<span class="line"><span>    searchStr = &quot;&quot;&quot;&quot; &amp; fieldName &amp; &quot;&quot;&quot;:&quot;</span></span>
<span class="line"><span>    startPos = InStr(json, searchStr)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    If startPos = 0 Then</span></span>
<span class="line"><span>        ExtractValue = &quot;&quot;</span></span>
<span class="line"><span>        Exit Function</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    startPos = startPos + Len(searchStr)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Check if value is string (starts with quote)</span></span>
<span class="line"><span>    If Mid(json, startPos, 1) = &quot;&quot;&quot;&quot; Then</span></span>
<span class="line"><span>        startPos = startPos + 1</span></span>
<span class="line"><span>        endPos = InStr(startPos, json, &quot;&quot;&quot;&quot;)</span></span>
<span class="line"><span>    Else</span></span>
<span class="line"><span>        &#39; Number or boolean - find comma or }</span></span>
<span class="line"><span>        endPos = InStr(startPos, json, &quot;,&quot;)</span></span>
<span class="line"><span>        If endPos = 0 Then endPos = InStr(startPos, json, &quot;}&quot;)</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    If endPos &gt; startPos Then</span></span>
<span class="line"><span>        ExtractValue = Mid(json, startPos, endPos - startPos)</span></span>
<span class="line"><span>    Else</span></span>
<span class="line"><span>        ExtractValue = &quot;&quot;</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>End Function</span></span></code></pre></div><h2 id="practical-examples" tabindex="-1">Practical Examples <a class="header-anchor" href="#practical-examples" aria-label="Permalink to &quot;Practical Examples&quot;">​</a></h2><h3 id="_1-simple-job-search" tabindex="-1">1. Simple Job Search <a class="header-anchor" href="#_1-simple-job-search" aria-label="Permalink to &quot;1. Simple Job Search&quot;">​</a></h3><p>Get jobs and display key fields:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub GetJobs()</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    Dim jobsData As String</span></span>
<span class="line"><span>    Dim jobs As Variant</span></span>
<span class="line"><span>    Dim i As Long</span></span>
<span class="line"><span>    Dim row As Long</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Clear sheet</span></span>
<span class="line"><span>    Cells.Clear</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Headers</span></span>
<span class="line"><span>    Range(&quot;A1:G1&quot;).Value = Array(&quot;Job Title&quot;, &quot;Agency&quot;, &quot;City&quot;, &quot;Min Salary&quot;, &quot;Max Salary&quot;, &quot;Type&quot;, &quot;Department&quot;)</span></span>
<span class="line"><span>    Range(&quot;A1:G1&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get data</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/jobs&quot;, &quot;state=CA&amp;limit=50&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Extract just the data array</span></span>
<span class="line"><span>    Dim dataStart As Long, dataEnd As Long</span></span>
<span class="line"><span>    dataStart = InStr(response, &quot;&quot;&quot;data&quot;&quot;:[&quot;) + 8</span></span>
<span class="line"><span>    dataEnd = InStr(dataStart, response, &quot;]&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    If dataStart &gt; 8 And dataEnd &gt; dataStart Then</span></span>
<span class="line"><span>        jobsData = Mid(response, dataStart, dataEnd - dataStart)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Split by },{ to separate jobs</span></span>
<span class="line"><span>        jobs = Split(jobsData, &quot;},{&quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Process each job</span></span>
<span class="line"><span>        row = 2</span></span>
<span class="line"><span>        For i = 0 To UBound(jobs)</span></span>
<span class="line"><span>            If i &lt;= 50 Then  &#39; Limit to 50 rows</span></span>
<span class="line"><span>                Cells(row, 1).Value = ExtractValue(jobs(i), &quot;job_name&quot;)</span></span>
<span class="line"><span>                Cells(row, 2).Value = ExtractValue(jobs(i), &quot;agency_name&quot;)</span></span>
<span class="line"><span>                Cells(row, 3).Value = ExtractValue(jobs(i), &quot;city&quot;)</span></span>
<span class="line"><span>                Cells(row, 4).Value = Val(ExtractValue(jobs(i), &quot;salary_annual_min&quot;))</span></span>
<span class="line"><span>                Cells(row, 5).Value = Val(ExtractValue(jobs(i), &quot;salary_annual_max&quot;))</span></span>
<span class="line"><span>                Cells(row, 6).Value = ExtractValue(jobs(i), &quot;job_type&quot;)</span></span>
<span class="line"><span>                Cells(row, 7).Value = ExtractValue(jobs(i), &quot;department&quot;)</span></span>
<span class="line"><span>                row = row + 1</span></span>
<span class="line"><span>            End If</span></span>
<span class="line"><span>        Next i</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Format</span></span>
<span class="line"><span>        Range(&quot;D:E&quot;).NumberFormat = &quot;$#,##0&quot;</span></span>
<span class="line"><span>        Columns(&quot;A:G&quot;).AutoFit</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        MsgBox &quot;Loaded &quot; &amp; row - 2 &amp; &quot; jobs&quot;</span></span>
<span class="line"><span>    Else</span></span>
<span class="line"><span>        MsgBox &quot;No jobs found&quot;</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h3 id="_2-market-summary" tabindex="-1">2. Market Summary <a class="header-anchor" href="#_2-market-summary" aria-label="Permalink to &quot;2. Market Summary&quot;">​</a></h3><p>Get quick market statistics:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub GetMarketSummary()</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    Dim ws As Worksheet</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Create new sheet</span></span>
<span class="line"><span>    On Error Resume Next</span></span>
<span class="line"><span>    Set ws = Sheets(&quot;Market Summary&quot;)</span></span>
<span class="line"><span>    If ws Is Nothing Then</span></span>
<span class="line"><span>        Set ws = Sheets.Add</span></span>
<span class="line"><span>        ws.Name = &quot;Market Summary&quot;</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>    On Error GoTo 0</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Cells.Clear</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get market concentration data</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/intelligence/market-concentration&quot;, &quot;state=CA&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Extract summary data</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Value = &quot;California Market Summary&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Font.Bold = True</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Font.Size = 14</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A3&quot;).Value = &quot;Total Jobs:&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;B3&quot;).Value = Val(ExtractValue(response, &quot;totalJobs&quot;))</span></span>
<span class="line"><span>    ws.Range(&quot;B3&quot;).NumberFormat = &quot;#,##0&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A4&quot;).Value = &quot;Unique Agencies:&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;B4&quot;).Value = Val(ExtractValue(response, &quot;uniqueAgencies&quot;))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A5&quot;).Value = &quot;Unique Cities:&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;B5&quot;).Value = Val(ExtractValue(response, &quot;uniqueCities&quot;))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get top agencies</span></span>
<span class="line"><span>    ws.Range(&quot;A8&quot;).Value = &quot;Top Hiring Agencies&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;A8&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/intelligence/agency-velocity&quot;, &quot;state=CA&amp;limit=10&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Headers</span></span>
<span class="line"><span>    ws.Range(&quot;A9:D9&quot;).Value = Array(&quot;Agency&quot;, &quot;Jobs&quot;, &quot;Avg Max Salary&quot;, &quot;Category&quot;)</span></span>
<span class="line"><span>    ws.Range(&quot;A9:D9&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Parse agencies (simplified)</span></span>
<span class="line"><span>    Dim agencyData As String</span></span>
<span class="line"><span>    Dim agencies As Variant</span></span>
<span class="line"><span>    Dim row As Integer</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    agencyData = Mid(response, InStr(response, &quot;topHiringAgencies&quot;) + 20)</span></span>
<span class="line"><span>    agencies = Split(agencyData, &quot;agencyName&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    row = 10</span></span>
<span class="line"><span>    For i = 1 To UBound(agencies)</span></span>
<span class="line"><span>        If row &lt; 20 Then</span></span>
<span class="line"><span>            ws.Cells(row, 1).Value = ExtractValue(agencies(i), &quot;&quot;)</span></span>
<span class="line"><span>            ws.Cells(row, 2).Value = Val(ExtractValue(agencies(i), &quot;jobCount&quot;))</span></span>
<span class="line"><span>            ws.Cells(row, 3).Value = Val(ExtractValue(agencies(i), &quot;max&quot;))</span></span>
<span class="line"><span>            ws.Cells(row, 4).Value = ExtractValue(agencies(i), &quot;hiringCategory&quot;)</span></span>
<span class="line"><span>            row = row + 1</span></span>
<span class="line"><span>        End If</span></span>
<span class="line"><span>    Next i</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Columns(&quot;A:D&quot;).AutoFit</span></span>
<span class="line"><span>    ws.Range(&quot;C10:C20&quot;).NumberFormat = &quot;$#,##0&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MsgBox &quot;Market summary loaded!&quot;</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h3 id="_3-search-with-user-input" tabindex="-1">3. Search with User Input <a class="header-anchor" href="#_3-search-with-user-input" aria-label="Permalink to &quot;3. Search with User Input&quot;">​</a></h3><p>Interactive job search:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub SearchJobsInteractive()</span></span>
<span class="line"><span>    Dim state As String</span></span>
<span class="line"><span>    Dim minSalary As String</span></span>
<span class="line"><span>    Dim agency As String</span></span>
<span class="line"><span>    Dim params As String</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get user input</span></span>
<span class="line"><span>    state = InputBox(&quot;Enter state code (e.g., CA):&quot;, &quot;State&quot;, &quot;CA&quot;)</span></span>
<span class="line"><span>    minSalary = InputBox(&quot;Minimum salary (leave blank for all):&quot;, &quot;Min Salary&quot;, &quot;&quot;)</span></span>
<span class="line"><span>    agency = InputBox(&quot;Agency name (partial match, leave blank for all):&quot;, &quot;Agency&quot;, &quot;&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Build parameters</span></span>
<span class="line"><span>    params = &quot;state=&quot; &amp; state &amp; &quot;&amp;limit=50&quot;</span></span>
<span class="line"><span>    If minSalary &lt;&gt; &quot;&quot; Then params = params &amp; &quot;&amp;min_salary=&quot; &amp; minSalary</span></span>
<span class="line"><span>    If agency &lt;&gt; &quot;&quot; Then params = params &amp; &quot;&amp;agency=&quot; &amp; agency</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get data</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/jobs&quot;, params)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Quick count of results</span></span>
<span class="line"><span>    Dim jobCount As Long</span></span>
<span class="line"><span>    jobCount = Len(response) - Len(Replace(response, &quot;&quot;&quot;job_id&quot;&quot;&quot;, &quot;&quot;))</span></span>
<span class="line"><span>    jobCount = jobCount / 8  &#39; Rough estimate</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    If MsgBox(&quot;Found approximately &quot; &amp; jobCount &amp; &quot; jobs. Load them?&quot;, vbYesNo) = vbYes Then</span></span>
<span class="line"><span>        &#39; Parse and display results</span></span>
<span class="line"><span>        Call GetJobs  &#39; Reuse the GetJobs function</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h3 id="_4-weekly-dashboard" tabindex="-1">4. Weekly Dashboard <a class="header-anchor" href="#_4-weekly-dashboard" aria-label="Permalink to &quot;4. Weekly Dashboard&quot;">​</a></h3><p>Simple dashboard with key metrics:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub CreateDashboard()</span></span>
<span class="line"><span>    Dim ws As Worksheet</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Create dashboard sheet</span></span>
<span class="line"><span>    On Error Resume Next</span></span>
<span class="line"><span>    Set ws = Sheets(&quot;Dashboard&quot;)</span></span>
<span class="line"><span>    If ws Is Nothing Then</span></span>
<span class="line"><span>        Set ws = Sheets.Add</span></span>
<span class="line"><span>        ws.Name = &quot;Dashboard&quot;</span></span>
<span class="line"><span>    End If</span></span>
<span class="line"><span>    On Error GoTo 0</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Cells.Clear</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Title</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Value = &quot;PenPublic Dashboard - &quot; &amp; Date</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Font.Size = 16</span></span>
<span class="line"><span>    ws.Range(&quot;A1&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get weekly summary</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/summary/weekly&quot;, &quot;state=CA&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Key metrics</span></span>
<span class="line"><span>    ws.Range(&quot;A3&quot;).Value = &quot;This Week&#39;s Summary&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;A3&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A4&quot;).Value = &quot;Total Jobs:&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;B4&quot;).Value = Val(ExtractValue(response, &quot;totalOpportunities&quot;))</span></span>
<span class="line"><span>    ws.Range(&quot;B4&quot;).NumberFormat = &quot;#,##0&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A5&quot;).Value = &quot;Agencies Hiring:&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;B5&quot;).Value = Val(ExtractValue(response, &quot;agenciesHiring&quot;))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get geographic hotspots</span></span>
<span class="line"><span>    ws.Range(&quot;A8&quot;).Value = &quot;Top Cities&quot;</span></span>
<span class="line"><span>    ws.Range(&quot;A8&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/intelligence/geographic-hotspots&quot;, &quot;state=CA&amp;min_jobs=100&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Range(&quot;A9:C9&quot;).Value = Array(&quot;City&quot;, &quot;Jobs&quot;, &quot;Opportunity&quot;)</span></span>
<span class="line"><span>    ws.Range(&quot;A9:C9&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Simple parsing for top 5 cities</span></span>
<span class="line"><span>    Dim cityData As String</span></span>
<span class="line"><span>    Dim pos As Long, row As Integer</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    row = 10</span></span>
<span class="line"><span>    pos = 1</span></span>
<span class="line"><span>    Do While pos &gt; 0 And row &lt; 15</span></span>
<span class="line"><span>        pos = InStr(pos, response, &quot;&quot;&quot;city&quot;&quot;:&quot;)</span></span>
<span class="line"><span>        If pos &gt; 0 Then</span></span>
<span class="line"><span>            ws.Cells(row, 1).Value = ExtractValue(Mid(response, pos - 50, 200), &quot;city&quot;)</span></span>
<span class="line"><span>            ws.Cells(row, 2).Value = Val(ExtractValue(Mid(response, pos - 50, 200), &quot;jobCount&quot;))</span></span>
<span class="line"><span>            ws.Cells(row, 3).Value = ExtractValue(Mid(response, pos - 50, 200), &quot;opportunityRating&quot;)</span></span>
<span class="line"><span>            row = row + 1</span></span>
<span class="line"><span>            pos = pos + 1</span></span>
<span class="line"><span>        End If</span></span>
<span class="line"><span>    Loop</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ws.Columns(&quot;A:C&quot;).AutoFit</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Add refresh button</span></span>
<span class="line"><span>    ws.Range(&quot;E1&quot;).Value = &quot;REFRESH&quot;</span></span>
<span class="line"><span>    With ws.Range(&quot;E1&quot;)</span></span>
<span class="line"><span>        .Interior.Color = RGB(0, 176, 80)</span></span>
<span class="line"><span>        .Font.Color = RGB(255, 255, 255)</span></span>
<span class="line"><span>        .Font.Bold = True</span></span>
<span class="line"><span>        .HorizontalAlignment = xlCenter</span></span>
<span class="line"><span>    End With</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MsgBox &quot;Dashboard created!&quot;</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h3 id="_5-multi-state-comparison" tabindex="-1">5. Multi-State Comparison <a class="header-anchor" href="#_5-multi-state-comparison" aria-label="Permalink to &quot;5. Multi-State Comparison&quot;">​</a></h3><p>Compare job markets across states:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub CompareStates()</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    Dim states As Variant</span></span>
<span class="line"><span>    Dim i As Integer</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; States to compare</span></span>
<span class="line"><span>    states = Array(&quot;CA&quot;, &quot;NY&quot;, &quot;TX&quot;, &quot;FL&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Clear sheet</span></span>
<span class="line"><span>    Cells.Clear</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Headers</span></span>
<span class="line"><span>    Range(&quot;A1&quot;).Value = &quot;State Comparison&quot;</span></span>
<span class="line"><span>    Range(&quot;A1&quot;).Font.Bold = True</span></span>
<span class="line"><span>    Range(&quot;A1&quot;).Font.Size = 14</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Range(&quot;A3:D3&quot;).Value = Array(&quot;State&quot;, &quot;Total Jobs&quot;, &quot;Avg Max Salary&quot;, &quot;Top City&quot;)</span></span>
<span class="line"><span>    Range(&quot;A3:D3&quot;).Font.Bold = True</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Get data for each state</span></span>
<span class="line"><span>    For i = 0 To UBound(states)</span></span>
<span class="line"><span>        Application.StatusBar = &quot;Getting data for &quot; &amp; states(i) &amp; &quot;...&quot;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Get summary</span></span>
<span class="line"><span>        response = MakeAPICall(&quot;/api/v1/summary/weekly&quot;, &quot;state=&quot; &amp; states(i))</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        Cells(i + 4, 1).Value = states(i)</span></span>
<span class="line"><span>        Cells(i + 4, 2).Value = Val(ExtractValue(response, &quot;totalOpportunities&quot;))</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Extract average salary (bit hacky but works)</span></span>
<span class="line"><span>        Dim salaryPos As Long</span></span>
<span class="line"><span>        salaryPos = InStr(response, &quot;&quot;&quot;avgSalaryRange&quot;&quot;&quot;)</span></span>
<span class="line"><span>        If salaryPos &gt; 0 Then</span></span>
<span class="line"><span>            Cells(i + 4, 3).Value = Val(ExtractValue(Mid(response, salaryPos, 200), &quot;max&quot;))</span></span>
<span class="line"><span>        End If</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &#39; Get top city</span></span>
<span class="line"><span>        response = MakeAPICall(&quot;/api/v1/intelligence/geographic-hotspots&quot;, &quot;state=&quot; &amp; states(i) &amp; &quot;&amp;min_jobs=50&quot;)</span></span>
<span class="line"><span>        Cells(i + 4, 4).Value = ExtractValue(response, &quot;city&quot;)</span></span>
<span class="line"><span>    Next i</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Format</span></span>
<span class="line"><span>    Range(&quot;B:B&quot;).NumberFormat = &quot;#,##0&quot;</span></span>
<span class="line"><span>    Range(&quot;C:C&quot;).NumberFormat = &quot;$#,##0&quot;</span></span>
<span class="line"><span>    Columns(&quot;A:D&quot;).AutoFit</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    Application.StatusBar = False</span></span>
<span class="line"><span>    MsgBox &quot;Comparison complete!&quot;</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h2 id="tips-and-best-practices" tabindex="-1">Tips and Best Practices <a class="header-anchor" href="#tips-and-best-practices" aria-label="Permalink to &quot;Tips and Best Practices&quot;">​</a></h2><h3 id="_1-error-handling" tabindex="-1">1. Error Handling <a class="header-anchor" href="#_1-error-handling" aria-label="Permalink to &quot;1. Error Handling&quot;">​</a></h3><p>Add basic error handling to your API calls:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Function MakeAPICallSafe(endpoint As String, params As String) As String</span></span>
<span class="line"><span>    On Error GoTo ErrorHandler</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MakeAPICallSafe = MakeAPICall(endpoint, params)</span></span>
<span class="line"><span>    Exit Function</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>ErrorHandler:</span></span>
<span class="line"><span>    MsgBox &quot;API Error: &quot; &amp; Err.Description</span></span>
<span class="line"><span>    MakeAPICallSafe = &quot;&quot;</span></span>
<span class="line"><span>End Function</span></span></code></pre></div><h3 id="_2-status-updates" tabindex="-1">2. Status Updates <a class="header-anchor" href="#_2-status-updates" aria-label="Permalink to &quot;2. Status Updates&quot;">​</a></h3><p>Show progress for long operations:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Application.StatusBar = &quot;Loading data...&quot;</span></span>
<span class="line"><span>&#39; Your code here</span></span>
<span class="line"><span>Application.StatusBar = False</span></span></code></pre></div><h3 id="_3-save-your-work" tabindex="-1">3. Save Your Work <a class="header-anchor" href="#_3-save-your-work" aria-label="Permalink to &quot;3. Save Your Work&quot;">​</a></h3><p>Save as macro-enabled workbook:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub SaveWorkbook()</span></span>
<span class="line"><span>    ActiveWorkbook.SaveAs Filename:=&quot;PenPublic_Analysis_&quot; &amp; Format(Date, &quot;yyyymmdd&quot;) &amp; &quot;.xlsm&quot;, _</span></span>
<span class="line"><span>                         FileFormat:=xlOpenXMLWorkbookMacroEnabled</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h2 id="troubleshooting" tabindex="-1">Troubleshooting <a class="header-anchor" href="#troubleshooting" aria-label="Permalink to &quot;Troubleshooting&quot;">​</a></h2><h3 id="common-issues" tabindex="-1">Common Issues <a class="header-anchor" href="#common-issues" aria-label="Permalink to &quot;Common Issues&quot;">​</a></h3><p><strong>&quot;The remote server returned an error&quot;</strong></p><ul><li>Check your API key is correct</li><li>Verify your internet connection</li><li>You may have hit rate limits (wait a bit and try again)</li></ul><p><strong>Empty or strange results</strong></p><ul><li>The ExtractValue function is simple and may miss some data</li><li>Try adjusting the search parameters</li><li>Check the raw response in a cell to see what you&#39;re getting</li></ul><p><strong>&quot;Type mismatch&quot; errors</strong></p><ul><li>Usually happens when Val() gets non-numeric data</li><li>Add checks before using Val()</li></ul><h3 id="debug-tips" tabindex="-1">Debug Tips <a class="header-anchor" href="#debug-tips" aria-label="Permalink to &quot;Debug Tips&quot;">​</a></h3><p>To see what the API is returning:</p><div class="language-vba vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vba</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Sub DebugAPIResponse()</span></span>
<span class="line"><span>    Dim response As String</span></span>
<span class="line"><span>    response = MakeAPICall(&quot;/api/v1/jobs&quot;, &quot;state=CA&amp;limit=1&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Put in cell to see full response</span></span>
<span class="line"><span>    Range(&quot;A1&quot;).Value = response</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &#39; Or use debug window</span></span>
<span class="line"><span>    Debug.Print response  &#39; View in Immediate Window (Ctrl+G)</span></span>
<span class="line"><span>End Sub</span></span></code></pre></div><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Once you&#39;re comfortable with these examples:</p><ul><li>Try different API endpoints (see API Overview documentation)</li><li>Build your own custom reports</li><li>Add more sophisticated parsing logic</li><li>Create automated daily/weekly reports</li></ul><p>Remember: Start simple, test often, and build up your functionality gradually!</p>`,53)]))}const h=a(t,[["render",l]]);export{d as __pageData,h as default};
