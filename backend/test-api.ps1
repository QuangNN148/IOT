# PowerShell Script to test API endpoints
# Run: .\test-api.ps1

$BASE_URL = "http://localhost:5000/api"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IoT Project API Testing Script (PowerShell)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get | ConvertTo-Json
Write-Host ""

# Test 2: Get Profile
Write-Host "[TEST 2] Get Profile" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/profile" -Method Get | ConvertTo-Json
Write-Host ""

# Test 3: Get Latest Sensor
Write-Host "[TEST 3] Get Latest Sensor Data" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/sensors/latest" -Method Get | ConvertTo-Json
Write-Host ""

# Test 4: Get Sensor History (limit 5)
Write-Host "[TEST 4] Get Sensor History (5 records)" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/sensors/history?limit=5" -Method Get | ConvertTo-Json -Depth 5
Write-Host ""

# Test 5: Get Latest Actions
Write-Host "[TEST 5] Get Latest Actions" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/actions/latest" -Method Get | ConvertTo-Json -Depth 5
Write-Host ""

# Test 6: Get Action History (limit 5)
Write-Host "[TEST 6] Get Action History (5 records)" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/actions/history?limit=5" -Method Get | ConvertTo-Json -Depth 5
Write-Host ""

# Test 7: Get Device State - Light
Write-Host "[TEST 7] Get Device State - Light" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/actions/state/Light" -Method Get | ConvertTo-Json
Write-Host ""

# Test 8: Control Device - Turn ON Light
Write-Host "[TEST 8] Turn ON Light (led1)" -ForegroundColor Yellow
$body = @{
    device = "led1"
    action = "on"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/control" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json
Write-Host ""

Start-Sleep -Seconds 2

# Test 9: Control Device - Turn OFF Light
Write-Host "[TEST 9] Turn OFF Light (led1)" -ForegroundColor Yellow
$body = @{
    device = "led1"
    action = "off"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/control" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json
Write-Host ""

# Test 10: Search Sensor History
Write-Host "[TEST 10] Search Sensor History (keyword: 27)" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/sensors/history?search=27&limit=3" -Method Get | ConvertTo-Json -Depth 5
Write-Host ""

# Test 11: Filter Action History by Device
Write-Host "[TEST 11] Filter Actions by Light" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/actions/history?deviceFilter=Light&limit=3" -Method Get | ConvertTo-Json -Depth 5
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
