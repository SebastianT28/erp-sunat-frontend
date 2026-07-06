package com.example.sunaterp.monitoring.controller;

import com.example.sunaterp.monitoring.service.EventClassificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controlador REST público para disparar eventos de demo del sistema ERP-SUNAT.
 * Permite demostrar los 4 niveles de clasificación de eventos en Render Logs
 * y en Grafana Cloud (métricas OTLP).
 *
 * NOTA: Estos endpoints son PÚBLICOS (sin JWT) para facilitar demostraciones.
 * Base path: /api/demo/eventos
 */
@RestController
@RequestMapping("/api/demo/eventos")
public class DemoEventController {

    private final EventClassificationService eventService;

    public DemoEventController(EventClassificationService eventService) {
        this.eventService = eventService;
    }

    // =========================================================
    // INFORMACIÓN - Operaciones normales del sistema
    // =========================================================

    @PostMapping("/info")
    public ResponseEntity<Map<String, Object>> dispararInfo(
            @RequestParam(defaultValue = "GENERAL") String area,
            @RequestParam(defaultValue = "Operación completada exitosamente") String mensaje) {

        // Escenarios de información por área
        switch (area.toUpperCase()) {
            case "AUTH"         -> eventService.logInfo("AUTH", "Login exitoso para el usuario: admin@sunat.gob.pe desde IP 192.168.1.10");
            case "BASE_DATOS"   -> eventService.logInfo("BASE_DATOS", "Consulta completada en 42ms. Registros obtenidos: 1,250 de tabla 'incidencias'");
            case "MEMORIA"      -> eventService.logInfo("MEMORIA", "Uso de heap JVM: 210MB / 512MB (41%). Estado: NORMAL");
            case "DISCO"        -> eventService.logInfo("DISCO", "Espacio en disco disponible: 18GB / 20GB (90% libre). Estado: NORMAL");
            case "RED"          -> eventService.logInfo("RED", "Conexión a Supabase establecida correctamente. Latencia: 28ms");
            case "INCIDENCIAS"  -> eventService.logInfo("INCIDENCIAS", "Nueva incidencia #INC-0042 creada por usuario 'jlopez'. Área: Logística");
            case "SERVIDOR"     -> eventService.logInfo("SERVIDOR", "Servidor ERP-SUNAT iniciado correctamente. Puerto: 10000. Tiempo de arranque: 141s");
            default             -> eventService.logInfo("SISTEMA", mensaje);
        }

        return ResponseEntity.ok(buildResponse("INFO", area, "Evento de información registrado en Render Logs y Grafana"));
    }

    // =========================================================
    // WARNING - Situaciones degradadas que deben revisarse
    // =========================================================

    @PostMapping("/warning")
    public ResponseEntity<Map<String, Object>> dispararWarning(
            @RequestParam(defaultValue = "GENERAL") String area,
            @RequestParam(defaultValue = "Situación degradada detectada") String mensaje) {

        switch (area.toUpperCase()) {
            case "AUTH"         -> eventService.logWarning("AUTH", "3 intentos de login fallidos para el usuario 'mperez' desde IP 203.0.113.45 en los últimos 5 minutos");
            case "BASE_DATOS"   -> eventService.logWarning("BASE_DATOS", "Pool de conexiones HikariCP al 75% de capacidad: 15/20 conexiones activas. Considere revisar queries lentas");
            case "MEMORIA"      -> eventService.logWarning("MEMORIA", "Uso de heap JVM: 410MB / 512MB (80%). GC ejecutado 12 veces en el último minuto. Monitorear tendencia");
            case "DISCO"        -> eventService.logWarning("DISCO", "Espacio en disco disponible: 4GB / 20GB (20% libre). Se recomienda limpieza de logs antiguos");
            case "RED"          -> eventService.logWarning("RED", "Latencia elevada detectada hacia Supabase: 850ms (umbral: 500ms). Posible congestión de red");
            case "INCIDENCIAS"  -> eventService.logWarning("INCIDENCIAS", "15 incidencias abiertas sin resolver en las últimas 24 horas. Revisar carga del equipo de soporte");
            case "SERVIDOR"     -> eventService.logWarning("SERVIDOR", "CPU del servidor al 72%. Carga promedio (1min): 2.8 / 4 cores. Monitorear incremento");
            default             -> eventService.logWarning("SISTEMA", mensaje);
        }

        return ResponseEntity.ok(buildResponse("WARNING", area, "Evento de advertencia registrado en Render Logs y Grafana"));
    }

    // =========================================================
    // ERROR - Fallos operacionales que necesitan atención
    // =========================================================

    @PostMapping("/error")
    public ResponseEntity<Map<String, Object>> dispararError(
            @RequestParam(defaultValue = "GENERAL") String area,
            @RequestParam(defaultValue = "Fallo operacional detectado") String mensaje) {

        switch (area.toUpperCase()) {
            case "AUTH"         -> eventService.logError("AUTH", "Cuenta bloqueada automáticamente: 'rgarcia' — 10 intentos fallidos consecutivos. Se requiere desbloqueo manual");
            case "BASE_DATOS"   -> eventService.logError("BASE_DATOS", "Timeout al ejecutar query en tabla 'reportes_incidencia' después de 5000ms. Query abortada. Conexiones activas: 20/20 (pool agotado)");
            case "MEMORIA"      -> eventService.logError("MEMORIA", "OutOfMemoryError capturado en módulo de reportes PDF. Proceso degradado. Heap utilizado: 498MB / 512MB (97%)");
            case "DISCO"        -> eventService.logError("DISCO", "Error al escribir archivo de log: '/var/log/erp-sunat.log'. Disco lleno (0 bytes disponibles). Escrituras bloqueadas");
            case "RED"          -> eventService.logError("RED", "Conexión con servicio externo SUNAT (OSE) fallida: Connection refused después de 3 reintentos. Documentos GRE no pueden validarse");
            case "INCIDENCIAS"  -> eventService.logError("INCIDENCIAS", "Fallo al enviar notificación de incidencia #INC-0078 por email. API Resend devolvió 429 (rate limit). Reintentando en 60s");
            case "SERVIDOR"     -> eventService.logError("SERVIDOR", "Error en endpoint /api/logistica/gre: NullPointerException en línea 147. Petición abortada. Revisar datos de entrada del cliente");
            default             -> eventService.logError("SISTEMA", mensaje);
        }

        return ResponseEntity.ok(buildResponse("ERROR", area, "Evento de error registrado en Render Logs y Grafana"));
    }

    // =========================================================
    // CRITICAL - Amenazas al servicio que requieren acción inmediata
    // =========================================================

    @PostMapping("/critical")
    public ResponseEntity<Map<String, Object>> dispararCritical(
            @RequestParam(defaultValue = "GENERAL") String area,
            @RequestParam(defaultValue = "Amenaza crítica detectada") String mensaje) {

        switch (area.toUpperCase()) {
            case "AUTH"         -> eventService.logCritical("AUTH", "Ataque de fuerza bruta detectado: 500 intentos de login en 60 segundos desde IP 198.51.100.22. Bloquear IP a nivel de firewall");
            case "BASE_DATOS"   -> eventService.logCritical("BASE_DATOS", "Servidor de base de datos Supabase INACCESIBLE. Todas las operaciones de escritura han fallado. Activar modo de mantenimiento");
            case "MEMORIA"      -> eventService.logCritical("MEMORIA", "JVM al borde del colapso: heap 511MB / 512MB (99.8%). GC no puede liberar memoria. Reinicio del servicio inminente");
            case "DISCO"        -> eventService.logCritical("DISCO", "Disco del servidor al 95% de capacidad: 19GB / 20GB usados. El sistema dejará de funcionar si no se libera espacio EN LAS PRÓXIMAS HORAS");
            case "RED"          -> eventService.logCritical("RED", "Backend ERP-SUNAT DESCONECTADO de todas las dependencias externas. Supabase, Resend y SUNAT OSE son inaccesibles. Posible fallo de red del proveedor");
            case "INCIDENCIAS"  -> eventService.logCritical("INCIDENCIAS", "50+ incidencias críticas abiertas sin atender en la última hora. SLA en riesgo grave. Escalamiento urgente al gerente de operaciones");
            case "SERVIDOR"     -> eventService.logCritical("SERVIDOR", "Servidor ERP-SUNAT DETENIDO inesperadamente. Health check fallando. Render intentando reiniciar el contenedor. Tiempo de inactividad activo");
            default             -> eventService.logCritical("SISTEMA", mensaje);
        }

        return ResponseEntity.ok(buildResponse("CRITICAL", area, "Evento crítico registrado en Render Logs y Grafana — REQUIERE ATENCIÓN INMEDIATA"));
    }

    // =========================================================
    // DEMO COMPLETO - Dispara los 4 niveles en secuencia
    // =========================================================

    @PostMapping("/todos")
    public ResponseEntity<Map<String, Object>> dispararTodos(
            @RequestParam(defaultValue = "SERVIDOR") String area) {

        eventService.logInfo("AUTH",        "Login exitoso para el usuario: admin@sunat.gob.pe");
        eventService.logWarning("MEMORIA",  "Uso de heap JVM: 410MB / 512MB (80%). Monitorear tendencia");
        eventService.logError("BASE_DATOS", "Timeout al ejecutar query en tabla 'reportes_incidencia' después de 5000ms");
        eventService.logCritical("SERVIDOR","Disco del servidor al 95%. El sistema puede dejar de funcionar");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("resultado", "DEMO COMPLETO EJECUTADO");
        response.put("eventos_generados", 4);
        response.put("niveles", new String[]{"INFO", "WARNING", "ERROR", "CRITICAL"});
        response.put("areas", new String[]{"AUTH", "MEMORIA", "BASE_DATOS", "SERVIDOR"});
        response.put("instruccion", "Revisa los logs de Render y la métrica 'eventos.clasificados.total' en Grafana");
        response.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    // =========================================================
    // Helper privado
    // =========================================================

    private Map<String, Object> buildResponse(String nivel, String area, String resultado) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("nivel", nivel);
        response.put("area", area);
        response.put("resultado", resultado);
        response.put("grafana_metric", "eventos.clasificados.total{nivel=" + nivel + ", area=" + area + "}");
        response.put("timestamp", java.time.Instant.now().toString());
        return response;
    }
}
