# =============================================================
# demo_error.ps1 - Dispara eventos de tipo ERROR
# Simula fallos operacionales que necesitan atención
# Uso: .\demo_error.ps1
# =============================================================

$BASE_URL = "https://erp-sunat-frontend.onrender.com/api/demo/eventos"
$areas = @("AUTH", "BASE_DATOS", "MEMORIA", "DISCO", "RED", "INCIDENCIAS", "SERVIDOR")

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Red
Write-Host "  ERP-SUNAT | Demo Eventos: ERROR" -ForegroundColor Red
Write-Host "  Simula fallos operacionales que necesitan atención" -ForegroundColor Red
Write-Host "=============================================================" -ForegroundColor Red
Write-Host ""

foreach ($area in $areas) {
    Write-Host "  [ERROR] Disparando evento en área: $area ..." -ForegroundColor Red -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/error?area=$area" -Method Post -ContentType "application/json"
        Write-Host " OK" -ForegroundColor Green
        Write-Host "          Métrica: $($response.grafana_metric)" -ForegroundColor DarkGray
    } catch {
        Write-Host " FALLO: $($_.Exception.Message)" -ForegroundColor DarkRed
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "  Listo! Revisa los logs de Render para ver los eventos [ERROR]" -ForegroundColor Red
Write-Host "  En Grafana busca: eventos_clasificados_total{nivel='ERROR'}" -ForegroundColor DarkGray
Write-Host ""
