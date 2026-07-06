# =============================================================
# demo_warning.ps1 - Dispara eventos de tipo WARNING
# Simula situaciones degradadas que requieren revision
# Uso: .\demo_warning.ps1
# =============================================================

$BASE_URL = "https://erp-sunat-frontend.onrender.com/api/demo/eventos"
$areas = @("AUTH", "BASE_DATOS", "MEMORIA", "DISCO", "RED", "INCIDENCIAS", "SERVIDOR")

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Yellow
Write-Host "  ERP-SUNAT | Demo Eventos: WARNING" -ForegroundColor Yellow
Write-Host "  Simula situaciones degradadas que requieren revision" -ForegroundColor Yellow
Write-Host "=============================================================" -ForegroundColor Yellow
Write-Host ""

foreach ($area in $areas) {
    Write-Host "  [WARN] Disparando evento en area: $area ..." -ForegroundColor Yellow -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/warning?area=$area" -Method Post -ContentType "application/json"
        Write-Host " OK" -ForegroundColor Green
        Write-Host "         Metrica: $($response.grafana_metric)" -ForegroundColor DarkGray
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "  Listo! Revisa los logs de Render para ver los eventos [WARNING]" -ForegroundColor Yellow
Write-Host "  En Grafana busca: eventos_clasificados_total{nivel='WARNING'}" -ForegroundColor DarkGray
Write-Host ""
