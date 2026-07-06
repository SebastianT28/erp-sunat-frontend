# =============================================================
# demo_critical.ps1 - Dispara eventos de tipo CRITICAL
# Simula amenazas que ponen en riesgo la disponibilidad del sistema
# Uso: .\demo_critical.ps1
# =============================================================

$BASE_URL = "https://erp-sunat-frontend.onrender.com/api/demo/eventos"
$areas = @("AUTH", "BASE_DATOS", "MEMORIA", "DISCO", "RED", "INCIDENCIAS", "SERVIDOR")

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Magenta
Write-Host "  ERP-SUNAT | Demo Eventos: CRITICAL" -ForegroundColor Magenta
Write-Host "  Simula amenazas criticas a la disponibilidad del sistema" -ForegroundColor Magenta
Write-Host "=============================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  ADVERTENCIA: Estos eventos generaran alertas criticas en Grafana." -ForegroundColor DarkYellow
Write-Host ""

foreach ($area in $areas) {
    Write-Host "  [CRITICAL] Disparando evento en area: $area ..." -ForegroundColor Magenta -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/critical?area=$area" -Method Post -ContentType "application/json"
        Write-Host " OK" -ForegroundColor Green
        Write-Host "             Metrica: $($response.grafana_metric)" -ForegroundColor DarkGray
    } catch {
        Write-Host " FALLO: $($_.Exception.Message)" -ForegroundColor DarkRed
    }
    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "  Listo! Revisa los logs de Render para ver los eventos [CRITICAL]" -ForegroundColor Magenta
Write-Host "  En Grafana busca: eventos_clasificados_total{nivel='CRITICAL'}" -ForegroundColor DarkGray
Write-Host ""
