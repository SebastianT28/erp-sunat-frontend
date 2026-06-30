package com.example.sunaterp.soporte.controller;

import com.example.sunaterp.soporte.dto.CierreIncidenciaDTO;
import com.example.sunaterp.soporte.dto.ReporteIncidenciaDTO;
import com.example.sunaterp.soporte.service.IncidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soporte/incidencias")
public class IncidenciaController {

    @Autowired
    private IncidenciaService incidenciaService;

    /**
     * GET /api/soporte/incidencias
     * Lista todos los reportes de incidencia, incluyendo su cierre si lo tienen.
     */
    @GetMapping
    public ResponseEntity<List<ReporteIncidenciaDTO>> listarTodas() {
        return ResponseEntity.ok(incidenciaService.listarTodas());
    }

    /**
     * POST /api/soporte/incidencias
     * Crea un nuevo reporte de incidencia.
     */
    @PostMapping
    public ResponseEntity<?> crearReporte(@RequestBody ReporteIncidenciaDTO dto) {
        try {
            ReporteIncidenciaDTO creado = incidenciaService.crearReporte(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * POST /api/soporte/incidencias/{id}/cierre
     * Registra (o actualiza) el cierre de una incidencia existente.
     * Requiere que exista el reporte primero (relación 1 a 1).
     */
    @PostMapping("/{id}/cierre")
    public ResponseEntity<?> registrarCierre(
            @PathVariable Long id,
            @RequestBody CierreIncidenciaDTO dto) {
        try {
            ReporteIncidenciaDTO actualizado = incidenciaService.registrarCierre(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * DELETE /api/soporte/incidencias/{id}
     * Elimina un reporte de incidencia y su cierre asociado (cascade).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReporte(@PathVariable Long id) {
        try {
            incidenciaService.eliminarReporte(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
