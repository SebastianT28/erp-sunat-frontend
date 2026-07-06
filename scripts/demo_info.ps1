# =============================================================
# demo_info.ps1 - Dispara eventos de tipo INFORMACIÓN
# Simula operaciones normales y exitosas en todas las áreas
# Uso: .\demo_info.ps1
# =============================================================

$BASE_URL = "https://erp-sunat-frontend.onrender.com/api/demo/eventos"
$areas = @("AUTH", "BASE_DATOS", "MEMORIA", "DISCO", "RED", "INCIDENCIAS", "SERVIDOR")

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  ERP-SUNAT | Demo Eventos: INFORMACIÓN" -ForegroundColor Cyan
Write-Host "  Simula operaciones normales exitosas del sistema" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($area in $areas) {
    Write-Host "  [INFO] Disparando evento en área: $area ..." -ForegroundColor White -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/info?area=$area" -Method Post -ContentType "application/json"
        Write-Host " OK" -ForegroundColor Green
        Write-Host "         Métrica: $($response.grafana_metric)" -ForegroundColor DarkGray
    } catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "  Listo! Revisa los logs de Render para ver los eventos [INFO]" -ForegroundColor Green
Write-Host "  En Grafana busca: eventos_clasificados_total{nivel='INFO'}" -ForegroundColor DarkGray
Write-Host ""
