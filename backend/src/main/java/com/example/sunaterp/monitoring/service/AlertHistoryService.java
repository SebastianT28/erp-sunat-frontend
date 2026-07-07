package com.example.sunaterp.monitoring.service;

import com.example.sunaterp.monitoring.dto.SystemAlertDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.stream.Collectors;

/**
 * Servicio para mantener un historial en memoria de los últimos eventos WARNING, ERROR y CRITICAL.
 * Se utiliza para que el frontend (módulo administrador) pueda obtener las alertas recientes mediante polling.
 */
@Service
public class AlertHistoryService {

    // Usamos una cola concurrente para operaciones thread-safe.
    private final ConcurrentLinkedDeque<SystemAlertDTO> recentAlerts = new ConcurrentLinkedDeque<>();
    
    // Mantenemos solo las últimas 50 alertas para no saturar la memoria
    private static final int MAX_ALERTS = 50;

    /**
     * Agrega una nueva alerta al historial. Si excede el máximo, elimina la más antigua.
     */
    public void addAlert(String nivel, String area, String mensaje) {
        SystemAlertDTO alert = new SystemAlertDTO(nivel, area, mensaje);
        recentAlerts.addFirst(alert); // Añadir al principio de la cola (más reciente primero)
        
        while (recentAlerts.size() > MAX_ALERTS) {
            recentAlerts.removeLast(); // Eliminar la más antigua
        }
    }

    /**
     * Obtiene todas las alertas ocurridas después de un timestamp específico.
     * Si no se proporciona timestamp, devuelve todas (hasta MAX_ALERTS).
     */
    public List<SystemAlertDTO> getRecentAlerts(Instant since) {
        if (since == null) {
            return recentAlerts.stream().collect(Collectors.toList());
        }

        return recentAlerts.stream()
                .filter(alert -> alert.getTimestamp().isAfter(since))
                .collect(Collectors.toList());
    }
}
