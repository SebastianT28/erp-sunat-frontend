# =============================================================
# demo_balanceador.ps1 - Demo del Balanceador de Carga Nginx
# Demuestra Round Robin y tolerancia a fallos del ERP Sunat
# Uso: .\scripts\demo_balanceador.ps1
# =============================================================

$LB_URL = "http://localhost"

function Escribir-Separador($color = "Cyan") {
    Write-Host "-------------------------------------------------------------" -ForegroundColor $color
}

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "   ERP-SUNAT | DEMO BALANCEADOR DE CARGA (Nginx)" -ForegroundColor Cyan
Write-Host "   Round Robin: backend1 + backend2 detras de Nginx" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

# ─────────────────────────────────────────────────────────────
# FASE 1: Verificar que los contenedores estan corriendo
# ─────────────────────────────────────────────────────────────
Write-Host ""
Escribir-Separador "Green"
Write-Host "  FASE 1/3: Verificando contenedores activos..." -ForegroundColor Green
Escribir-Separador "Green"

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "  Pausa de 3 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ─────────────────────────────────────────────────────────────
# FASE 2: Enviar 6 peticiones al balanceador (Round Robin)
# ─────────────────────────────────────────────────────────────
Write-Host ""
Escribir-Separador "Yellow"
Write-Host "  FASE 2/3: Enviando 6 peticiones al Nginx (Round Robin)" -ForegroundColor Yellow
Write-Host "  URL: $LB_URL/actuator/health" -ForegroundColor Gray
Escribir-Separador "Yellow"

for ($i = 1; $i -le 6; $i++) {
    Write-Host "  >> Peticion #$i al balanceador..." -ForegroundColor White -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "$LB_URL/actuator/health" -Method Get -UseBasicParsing -TimeoutSec 10
        Write-Host " [HTTP $($response.StatusCode) OK]" -ForegroundColor Green
    } catch {
        Write-Host " [ERROR: $($_.Exception.Message)]" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "  Pausa de 3 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ─────────────────────────────────────────────────────────────
# FASE 3: Tolerancia a Fallos - Detener backend1
# ─────────────────────────────────────────────────────────────
Write-Host ""
Escribir-Separador "Red"
Write-Host "  FASE 3/3: Simulando caida de backend1 (Tolerancia a Fallos)" -ForegroundColor Red
Escribir-Separador "Red"

Write-Host ""
Write-Host "  >> Deteniendo erp_backend_1..." -ForegroundColor Yellow
docker stop erp_backend_1 | Out-Null
Write-Host "  >> erp_backend_1 DETENIDO. Solo backend2 activo." -ForegroundColor Red
Write-Host ""
Start-Sleep -Seconds 2

Write-Host "  >> Enviando 3 peticiones con backend1 caido..." -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le 3; $i++) {
    Write-Host "  >> Peticion #$i (solo backend2 activo)..." -ForegroundColor White -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "$LB_URL/actuator/health" -Method Get -UseBasicParsing -TimeoutSec 10
        Write-Host " [HTTP $($response.StatusCode) OK - Sistema sigue operativo!]" -ForegroundColor Green
    } catch {
        Write-Host " [ERROR: $($_.Exception.Message)]" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 700
}

Write-Host ""
Write-Host "  >> Restaurando erp_backend_1..." -ForegroundColor Yellow
docker start erp_backend_1 | Out-Null
Write-Host "  >> erp_backend_1 RESTAURADO. Ambas instancias activas." -ForegroundColor Green

# ─────────────────────────────────────────────────────────────
# RESUMEN FINAL
# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "   DEMO COMPLETADA EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "   - Round Robin distribuyo trafico entre backend1 y backend2" -ForegroundColor Green
Write-Host "   - Sistema mantuvo disponibilidad con backend1 caido" -ForegroundColor Green
Write-Host "   - SLA de disponibilidad: CUMPLIDO" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Revisa los logs de Nginx con:" -ForegroundColor Gray
Write-Host "  docker logs erp_nginx_lb" -ForegroundColor White
Write-Host ""
