package com.example.sunaterp.monitoring.controller;

import com.example.sunaterp.monitoring.dto.SystemAlertDTO;
import com.example.sunaterp.monitoring.service.AlertHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/**
 * Controlador REST para el polling de alertas del administrador.
 * Proporciona eventos recientes (WARNING, ERROR, CRITICAL) al frontend.
 */
@RestController
@RequestMapping("/api/admin/alertas")
public class SystemAlertController {

    private final AlertHistoryService alertHistoryService;

    public SystemAlertController(AlertHistoryService alertHistoryService) {
        this.alertHistoryService = alertHistoryService;
    }

    /**
     * Obtiene las alertas recientes del sistema.
     * @param since (Opcional) Timestamp en formato ISO-8601. Si se provee, solo retorna alertas posteriores a esta fecha.
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<SystemAlertDTO>> getAlertasRecientes(@RequestParam(required = false) String since) {
        Instant sinceInstant = null;
        if (since != null && !since.isEmpty()) {
            try {
                sinceInstant = Instant.parse(since);
            } catch (Exception e) {
                // Si el formato es inválido, ignoramos el filtro y devolvemos todo
                sinceInstant = null;
            }
        }
        
        List<SystemAlertDTO> alertas = alertHistoryService.getRecentAlerts(sinceInstant);
        return ResponseEntity.ok(alertas);
    }
}
