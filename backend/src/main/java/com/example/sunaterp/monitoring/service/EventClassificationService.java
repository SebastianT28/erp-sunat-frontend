package com.example.sunaterp.monitoring.service;

import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Servicio central de clasificación de eventos del sistema ERP-SUNAT.
 * Genera logs estructurados en 4 niveles de severidad y registra
 * contadores en Grafana Cloud via OTLP para cada evento.
 *
 * Niveles:
 *  - INFO     : Operaciones normales del sistema.
 *  - WARNING  : Situaciones degradadas que deben revisarse.
 *  - ERROR    : Fallos operacionales que necesitan atención.
 *  - CRITICAL : Amenazas críticas al servicio que requieren acción inmediata.
 */
@Service
public class EventClassificationService {

    private static final Logger log = LoggerFactory.getLogger(EventClassificationService.class);

    private final MeterRegistry meterRegistry;
    private final AlertHistoryService alertHistoryService;

    public EventClassificationService(MeterRegistry meterRegistry, AlertHistoryService alertHistoryService) {
        this.meterRegistry = meterRegistry;
        this.alertHistoryService = alertHistoryService;
    }

    /**
     * Registra un evento de nivel INFORMACIÓN.
     * Para operaciones normales y exitosas del sistema.
     */
    public void logInfo(String area, String mensaje) {
        log.info("[EVENTO][INFO][{}] {}", area, mensaje);
        meterRegistry.counter("eventos.clasificados.total",
                "nivel", "INFO",
                "area", area,
                "evento", mensaje
        ).increment();
    }

    /**
     * Registra un evento de nivel WARNING.
     * Para situaciones degradadas que no impiden la operación pero deben revisarse.
     */
    public void logWarning(String area, String mensaje) {
        log.warn("[EVENTO][WARNING][{}] {} | Requiere revisión.", area, mensaje);
        meterRegistry.counter("eventos.clasificados.total",
                "nivel", "WARNING",
                "area", area,
                "evento", mensaje
        ).increment();
        alertHistoryService.addAlert("WARNING", area, mensaje);
    }

    /**
     * Registra un evento de nivel ERROR.
     * Para fallos que impiden una operación pero no afectan todo el sistema.
     */
    public void logError(String area, String mensaje) {
        log.error("[EVENTO][ERROR][{}] {} | Acción correctiva recomendada.", area, mensaje);
        meterRegistry.counter("eventos.clasificados.total",
                "nivel", "ERROR",
                "area", area,
                "evento", mensaje
        ).increment();
        alertHistoryService.addAlert("ERROR", area, mensaje);
    }

    /**
     * Registra un evento de nivel CRITICAL.
     * Para amenazas que ponen en riesgo la disponibilidad del sistema.
     */
    public void logCritical(String area, String mensaje) {
        log.error("[EVENTO][CRITICAL][{}] *** ALERTA CRÍTICA *** {} | Intervención INMEDIATA requerida.", area, mensaje);
        meterRegistry.counter("eventos.clasificados.total",
                "nivel", "CRITICAL",
                "area", area,
                "evento", mensaje
        ).increment();
        alertHistoryService.addAlert("CRITICAL", area, mensaje);
    }
}
