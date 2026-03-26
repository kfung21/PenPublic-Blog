# Excel/VBA Integration Guide

This guide shows how to integrate PenPublic API data directly into Excel using VBA macros. Perfect for analysts who want to automate government job market research without leaving Excel.

## Prerequisites

1. **Excel 2010 or later** (Windows recommended)
2. **PenPublic API key** 

## Getting Started in VBA

Here's the simplest way to test the API and get your first data:

```vba
Sub HelloPenPublic()
    Dim response As String
    response = MakeAPICall("/api/v1/jobs", "state=CA&limit=1")
    Range("A1").Value = response
    MsgBox "Done! Check cell A1"
End Sub

Function MakeAPICall(endpoint As String, params As String) As String
    Dim http As Object
    Dim url As String
    
    Const API_KEY = "YOUR_KEY_HERE"  ' <-- UPDATE THIS LINE ONLY!
    Const BASE_URL = "https://d1-subscription-api.kevtfung.workers.dev"
    
    Set http = CreateObject("MSXML2.XMLHTTP")
    url = BASE_URL & endpoint
    If params <> "" Then url = url & "?" & params
    
    http.Open "GET", url, False
    http.setRequestHeader "X-API-Key", API_KEY
    http.send
    
    MakeAPICall = http.responseText
End Function
```

**Quick Start Steps:**
1. Open Excel and press `Alt+F11` to open VBA editor
2. Insert → Module
3. Paste the code above
4. Replace `YOUR_KEY_HERE` with your actual API key
5. Press `F5` to run `HelloPenPublic`
6. Check cell A1 for your first API response!

## Core Functions

### Extract Value from API Response (No JSON Parser Needed!)

```vba
Function ExtractValue(json As String, fieldName As String) As String
    Dim startPos As Long
    Dim endPos As Long
    Dim searchStr As String
    
    ' Look for "fieldName":"value" or "fieldName":value
    searchStr = """" & fieldName & """:"
    startPos = InStr(json, searchStr)
    
    If startPos = 0 Then
        ExtractValue = ""
        Exit Function
    End If
    
    startPos = startPos + Len(searchStr)
    
    ' Check if value is string (starts with quote)
    If Mid(json, startPos, 1) = """" Then
        startPos = startPos + 1
        endPos = InStr(startPos, json, """")
    Else
        ' Number or boolean - find comma or }
        endPos = InStr(startPos, json, ",")
        If endPos = 0 Then endPos = InStr(startPos, json, "}")
    End If
    
    If endPos > startPos Then
        ExtractValue = Mid(json, startPos, endPos - startPos)
    Else
        ExtractValue = ""
    End If
End Function
```

## Practical Examples

### 1. Simple Job Search

Get jobs and display key fields:

```vba
Sub GetJobs()
    Dim response As String
    Dim jobsData As String
    Dim jobs As Variant
    Dim i As Long
    Dim row As Long
    
    ' Clear sheet
    Cells.Clear
    
    ' Headers
    Range("A1:G1").Value = Array("Job Title", "Agency", "City", "Min Salary", "Max Salary", "Type", "Department")
    Range("A1:G1").Font.Bold = True
    
    ' Get data
    response = MakeAPICall("/api/v1/jobs", "state=CA&limit=50")
    
    ' Extract just the data array
    Dim dataStart As Long, dataEnd As Long
    dataStart = InStr(response, """data"":[") + 8
    dataEnd = InStr(dataStart, response, "]")
    
    If dataStart > 8 And dataEnd > dataStart Then
        jobsData = Mid(response, dataStart, dataEnd - dataStart)
        
        ' Split by },{ to separate jobs
        jobs = Split(jobsData, "},{")
        
        ' Process each job
        row = 2
        For i = 0 To UBound(jobs)
            If i <= 50 Then  ' Limit to 50 rows
                Cells(row, 1).Value = ExtractValue(jobs(i), "job_name")
                Cells(row, 2).Value = ExtractValue(jobs(i), "agency_name")
                Cells(row, 3).Value = ExtractValue(jobs(i), "city")
                Cells(row, 4).Value = Val(ExtractValue(jobs(i), "salary_annual_min"))
                Cells(row, 5).Value = Val(ExtractValue(jobs(i), "salary_annual_max"))
                Cells(row, 6).Value = ExtractValue(jobs(i), "job_type")
                Cells(row, 7).Value = ExtractValue(jobs(i), "department")
                row = row + 1
            End If
        Next i
        
        ' Format
        Range("D:E").NumberFormat = "$#,##0"
        Columns("A:G").AutoFit
        
        MsgBox "Loaded " & row - 2 & " jobs"
    Else
        MsgBox "No jobs found"
    End If
End Sub
```

### 2. Market Summary

Get quick market statistics:

```vba
Sub GetMarketSummary()
    Dim response As String
    Dim ws As Worksheet
    
    ' Create new sheet
    On Error Resume Next
    Set ws = Sheets("Market Summary")
    If ws Is Nothing Then
        Set ws = Sheets.Add
        ws.Name = "Market Summary"
    End If
    On Error GoTo 0
    
    ws.Cells.Clear
    
    ' Get market concentration data
    response = MakeAPICall("/api/v1/intelligence/market-concentration", "state=CA")
    
    ' Extract summary data
    ws.Range("A1").Value = "California Market Summary"
    ws.Range("A1").Font.Bold = True
    ws.Range("A1").Font.Size = 14
    
    ws.Range("A3").Value = "Total Jobs:"
    ws.Range("B3").Value = Val(ExtractValue(response, "totalJobs"))
    ws.Range("B3").NumberFormat = "#,##0"
    
    ws.Range("A4").Value = "Unique Agencies:"
    ws.Range("B4").Value = Val(ExtractValue(response, "uniqueAgencies"))
    
    ws.Range("A5").Value = "Unique Cities:"
    ws.Range("B5").Value = Val(ExtractValue(response, "uniqueCities"))
    
    ' Get top agencies
    ws.Range("A8").Value = "Top Hiring Agencies"
    ws.Range("A8").Font.Bold = True
    
    response = MakeAPICall("/api/v1/intelligence/agency-velocity", "state=CA&limit=10")
    
    ' Headers
    ws.Range("A9:D9").Value = Array("Agency", "Jobs", "Avg Max Salary", "Category")
    ws.Range("A9:D9").Font.Bold = True
    
    ' Parse agencies (simplified)
    Dim agencyData As String
    Dim agencies As Variant
    Dim row As Integer
    
    agencyData = Mid(response, InStr(response, "topHiringAgencies") + 20)
    agencies = Split(agencyData, "agencyName")
    
    row = 10
    For i = 1 To UBound(agencies)
        If row < 20 Then
            ws.Cells(row, 1).Value = ExtractValue(agencies(i), "")
            ws.Cells(row, 2).Value = Val(ExtractValue(agencies(i), "jobCount"))
            ws.Cells(row, 3).Value = Val(ExtractValue(agencies(i), "max"))
            ws.Cells(row, 4).Value = ExtractValue(agencies(i), "hiringCategory")
            row = row + 1
        End If
    Next i
    
    ws.Columns("A:D").AutoFit
    ws.Range("C10:C20").NumberFormat = "$#,##0"
    
    MsgBox "Market summary loaded!"
End Sub
```

### 3. Search with User Input

Interactive job search:

```vba
Sub SearchJobsInteractive()
    Dim state As String
    Dim minSalary As String
    Dim agency As String
    Dim params As String
    Dim response As String
    
    ' Get user input
    state = InputBox("Enter state code (e.g., CA):", "State", "CA")
    minSalary = InputBox("Minimum salary (leave blank for all):", "Min Salary", "")
    agency = InputBox("Agency name (partial match, leave blank for all):", "Agency", "")
    
    ' Build parameters
    params = "state=" & state & "&limit=50"
    If minSalary <> "" Then params = params & "&min_salary=" & minSalary
    If agency <> "" Then params = params & "&agency=" & agency
    
    ' Get data
    response = MakeAPICall("/api/v1/jobs", params)
    
    ' Quick count of results
    Dim jobCount As Long
    jobCount = Len(response) - Len(Replace(response, """job_id""", ""))
    jobCount = jobCount / 8  ' Rough estimate
    
    If MsgBox("Found approximately " & jobCount & " jobs. Load them?", vbYesNo) = vbYes Then
        ' Parse and display results
        Call GetJobs  ' Reuse the GetJobs function
    End If
End Sub
```

### 4. Weekly Dashboard

Simple dashboard with key metrics:

```vba
Sub CreateDashboard()
    Dim ws As Worksheet
    Dim response As String
    
    ' Create dashboard sheet
    On Error Resume Next
    Set ws = Sheets("Dashboard")
    If ws Is Nothing Then
        Set ws = Sheets.Add
        ws.Name = "Dashboard"
    End If
    On Error GoTo 0
    
    ws.Cells.Clear
    
    ' Title
    ws.Range("A1").Value = "PenPublic Dashboard - " & Date
    ws.Range("A1").Font.Size = 16
    ws.Range("A1").Font.Bold = True
    
    ' Get weekly summary
    response = MakeAPICall("/api/v1/summary/weekly", "state=CA")
    
    ' Key metrics
    ws.Range("A3").Value = "This Week's Summary"
    ws.Range("A3").Font.Bold = True
    
    ws.Range("A4").Value = "Total Jobs:"
    ws.Range("B4").Value = Val(ExtractValue(response, "totalOpportunities"))
    ws.Range("B4").NumberFormat = "#,##0"
    
    ws.Range("A5").Value = "Agencies Hiring:"
    ws.Range("B5").Value = Val(ExtractValue(response, "agenciesHiring"))
    
    ' Get geographic hotspots
    ws.Range("A8").Value = "Top Cities"
    ws.Range("A8").Font.Bold = True
    
    response = MakeAPICall("/api/v1/intelligence/geographic-hotspots", "state=CA&min_jobs=100")
    
    ws.Range("A9:C9").Value = Array("City", "Jobs", "Opportunity")
    ws.Range("A9:C9").Font.Bold = True
    
    ' Simple parsing for top 5 cities
    Dim cityData As String
    Dim pos As Long, row As Integer
    
    row = 10
    pos = 1
    Do While pos > 0 And row < 15
        pos = InStr(pos, response, """city"":")
        If pos > 0 Then
            ws.Cells(row, 1).Value = ExtractValue(Mid(response, pos - 50, 200), "city")
            ws.Cells(row, 2).Value = Val(ExtractValue(Mid(response, pos - 50, 200), "jobCount"))
            ws.Cells(row, 3).Value = ExtractValue(Mid(response, pos - 50, 200), "opportunityRating")
            row = row + 1
            pos = pos + 1
        End If
    Loop
    
    ws.Columns("A:C").AutoFit
    
    ' Add refresh button
    ws.Range("E1").Value = "REFRESH"
    With ws.Range("E1")
        .Interior.Color = RGB(0, 176, 80)
        .Font.Color = RGB(255, 255, 255)
        .Font.Bold = True
        .HorizontalAlignment = xlCenter
    End With
    
    MsgBox "Dashboard created!"
End Sub
```

### 5. Multi-State Comparison

Compare job markets across states:

```vba
Sub CompareStates()
    Dim response As String
    Dim states As Variant
    Dim i As Integer
    
    ' States to compare
    states = Array("CA", "NY", "TX", "FL")
    
    ' Clear sheet
    Cells.Clear
    
    ' Headers
    Range("A1").Value = "State Comparison"
    Range("A1").Font.Bold = True
    Range("A1").Font.Size = 14
    
    Range("A3:D3").Value = Array("State", "Total Jobs", "Avg Max Salary", "Top City")
    Range("A3:D3").Font.Bold = True
    
    ' Get data for each state
    For i = 0 To UBound(states)
        Application.StatusBar = "Getting data for " & states(i) & "..."
        
        ' Get summary
        response = MakeAPICall("/api/v1/summary/weekly", "state=" & states(i))
        
        Cells(i + 4, 1).Value = states(i)
        Cells(i + 4, 2).Value = Val(ExtractValue(response, "totalOpportunities"))
        
        ' Extract average salary (bit hacky but works)
        Dim salaryPos As Long
        salaryPos = InStr(response, """avgSalaryRange""")
        If salaryPos > 0 Then
            Cells(i + 4, 3).Value = Val(ExtractValue(Mid(response, salaryPos, 200), "max"))
        End If
        
        ' Get top city
        response = MakeAPICall("/api/v1/intelligence/geographic-hotspots", "state=" & states(i) & "&min_jobs=50")
        Cells(i + 4, 4).Value = ExtractValue(response, "city")
    Next i
    
    ' Format
    Range("B:B").NumberFormat = "#,##0"
    Range("C:C").NumberFormat = "$#,##0"
    Columns("A:D").AutoFit
    
    Application.StatusBar = False
    MsgBox "Comparison complete!"
End Sub
```

## Tips and Best Practices

### 1. Error Handling

Add basic error handling to your API calls:

```vba
Function MakeAPICallSafe(endpoint As String, params As String) As String
    On Error GoTo ErrorHandler
    
    MakeAPICallSafe = MakeAPICall(endpoint, params)
    Exit Function
    
ErrorHandler:
    MsgBox "API Error: " & Err.Description
    MakeAPICallSafe = ""
End Function
```

### 2. Status Updates

Show progress for long operations:

```vba
Application.StatusBar = "Loading data..."
' Your code here
Application.StatusBar = False
```

### 3. Save Your Work

Save as macro-enabled workbook:

```vba
Sub SaveWorkbook()
    ActiveWorkbook.SaveAs Filename:="PenPublic_Analysis_" & Format(Date, "yyyymmdd") & ".xlsm", _
                         FileFormat:=xlOpenXMLWorkbookMacroEnabled
End Sub
```

## Troubleshooting

### Common Issues

**"The remote server returned an error"**
- Check your API key is correct
- Verify your internet connection
- You may have hit rate limits (wait a bit and try again)

**Empty or strange results**
- The ExtractValue function is simple and may miss some data
- Try adjusting the search parameters
- Check the raw response in a cell to see what you're getting

**"Type mismatch" errors**
- Usually happens when Val() gets non-numeric data
- Add checks before using Val()

### Debug Tips

To see what the API is returning:

```vba
Sub DebugAPIResponse()
    Dim response As String
    response = MakeAPICall("/api/v1/jobs", "state=CA&limit=1")
    
    ' Put in cell to see full response
    Range("A1").Value = response
    
    ' Or use debug window
    Debug.Print response  ' View in Immediate Window (Ctrl+G)
End Sub
```

## Next Steps

Once you're comfortable with these examples:
- Try different API endpoints (see API Overview documentation)
- Build your own custom reports
- Add more sophisticated parsing logic
- Create automated daily/weekly reports

Remember: Start simple, test often, and build up your functionality gradually!