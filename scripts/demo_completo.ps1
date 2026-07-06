# =============================================================
# demo_completo.ps1 - Demo completa de los 4 niveles de eventos
# Ideal para presentaciones y demostraciones del sistema ERP-SUNAT
# Uso: .\demo_completo.ps1
# =============================================================

$BASE_URL = "https://erp-sunat-frontend.onrender.com/api/demo/eventos"

function Escribir-Separador($color = "Cyan") {
    Write-Host "-------------------------------------------------------------" -ForegroundColor $color
}

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "   ERP-SUNAT | DEMO COMPLETA - Clasificacion de Eventos" -ForegroundColor Cyan
Write-Host "   Demostracion de los 4 niveles: INFO / WARNING / ERROR / CRITICAL" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Iniciando demo en 3 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# ===========================================================
# FASE 1: INFORMACIÓN
# ===========================================================
Write-Host ""
Escribir-Separador "Green"
Write-Host "  FASE 1/4: Eventos de INFORMACION" -ForegroundColor Green
Write-Host "  Simulando operaciones normales del sistema..." -ForegroundColor Gray
Escribir-Separador "Green"

$areasInfo = @(
    @{area="AUTH";       desc="Login exitoso"},
    @{area="BASE_DATOS"; desc="Consulta completada"},
    @{area="MEMORIA";    desc="Uso normal de heap"},
    @{area="SERVIDOR";   desc="Servidor operando correctamente"}
)

foreach ($item in $areasInfo) {
    Write-Host "  >> [$($item.area)] $($item.desc)..." -ForegroundColor White -NoNewline
    Invoke-RestMethod -Uri "$BASE_URL/info?area=$($item.area)" -Method Post -ContentType "application/json" | Out-Null
    Write-Host " [INFO registrado]" -ForegroundColor Green
    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "  Pausa de 5 segundos antes del proximo nivel..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# ===========================================================
# FASE 2: WARNING
# ===========================================================
Write-Host ""
Escribir-Separador "Yellow"
Write-Host "  FASE 2/4: Eventos de WARNING" -ForegroundColor Yellow
Write-Host "  Simulando situaciones degradadas..." -ForegroundColor Gray
Escribir-Separador "Yellow"

$areasWarning = @(
    @{area="AUTH";       desc="3 intentos de login fallidos"},
    @{area="MEMORIA";    desc="Heap JVM al 80%"},
    @{area="DISCO";      desc="Espacio en disco al 80%"},
    @{area="SERVIDOR";   desc="CPU al 72%"}
)

foreach ($item in $areasWarning) {
    Write-Host "  >> [$($item.area)] $($item.desc)..." -ForegroundColor Yellow -NoNewline
    Invoke-RestMethod -Uri "$BASE_URL/warning?area=$($item.area)" -Method Post -ContentType "application/json" | Out-Null
    Write-Host " [WARNING registrado]" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "  Pausa de 5 segundos antes del proximo nivel..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# ===========================================================
# FASE 3: ERROR
# ===========================================================
Write-Host ""
Escribir-Separador "Red"
Write-Host "  FASE 3/4: Eventos de ERROR" -ForegroundColor Red
Write-Host "  Simulando fallos operacionales..." -ForegroundColor Gray
Escribir-Separador "Red"

$areasError = @(
    @{area="BASE_DATOS"; desc="Timeout en query (5000ms)"},
    @{area="RED";        desc="Conexion con SUNAT OSE fallida"},
    @{area="AUTH";       desc="Cuenta bloqueada por intentos fallidos"},
    @{area="INCIDENCIAS";desc="Fallo al enviar notificacion por email"}
)

foreach ($item in $areasError) {
    Write-Host "  >> [$($item.area)] $($item.desc)..." -ForegroundColor Red -NoNewline
    Invoke-RestMethod -Uri "$BASE_URL/error?area=$($item.area)" -Method Post -ContentType "application/json" | Out-Null
    Write-Host " [ERROR registrado]" -ForegroundColor Red
    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "  Pausa de 5 segundos antes del nivel CRITICO..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# ===========================================================
# FASE 4: CRITICAL
# ===========================================================
Write-Host ""
Escribir-Separador "Magenta"
Write-Host "  FASE 4/4: Eventos CRITICOS" -ForegroundColor Magenta
Write-Host "  Simulando amenazas criticas al sistema..." -ForegroundColor Gray
Escribir-Separador "Magenta"

$areasCritical = @(
    @{area="BASE_DATOS";  desc="Supabase INACCESIBLE"},
    @{area="MEMORIA";     desc="JVM al borde del colapso (99.8%)"},
    @{area="DISCO";       desc="Disco al 95% de capacidad"},
    @{area="SERVIDOR";    desc="Servidor ERP-SUNAT DETENIDO"}
)

foreach ($item in $areasCritical) {
    Write-Host "  >> *** [$($item.area)] $($item.desc) ***..." -ForegroundColor Magenta -NoNewline
    Invoke-RestMethod -Uri "$BASE_URL/critical?area=$($item.area)" -Method Post -ContentType "application/json" | Out-Null
    Write-Host " [CRITICAL registrado]" -ForegroundColor Magenta
    Start-Sleep -Milliseconds 800
}

# ===========================================================
# RESUMEN FINAL
# ===========================================================
Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  DEMO COMPLETADA EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Eventos generados:" -ForegroundColor White
Write-Host "    [INFO]     4 eventos en: AUTH, BASE_DATOS, MEMORIA, SERVIDOR" -ForegroundColor Green
Write-Host "    [WARNING]  4 eventos en: AUTH, MEMORIA, DISCO, SERVIDOR" -ForegroundColor Yellow
Write-Host "    [ERROR]    4 eventos en: BASE_DATOS, RED, AUTH, INCIDENCIAS" -ForegroundColor Red
Write-Host "    [CRITICAL] 4 eventos en: BASE_DATOS, MEMORIA, DISCO, SERVIDOR" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Donde verificar los resultados:" -ForegroundColor White
Write-Host "    1. Render Logs: https://dashboard.render.com" -ForegroundColor Gray
Write-Host "       Buscar: [EVENTO][INFO], [EVENTO][WARNING], [EVENTO][ERROR], [EVENTO][CRITICAL]" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    2. Grafana Cloud > Explore" -ForegroundColor Gray
Write-Host "       Query: eventos_clasificados_total" -ForegroundColor DarkGray
Write-Host ""
