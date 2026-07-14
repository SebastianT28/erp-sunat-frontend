package com.example.sunaterp.gerencia.controller;

import com.example.sunaterp.gerencia.service.DrpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gerencia/drp")
public class DrpController {

    @Autowired
    private DrpService drpService;

    /**
     * Endpoint oficial para ejecutar la sincronización diferencial de contingencia
     * y la alineación global de las 24 secuencias de la base de datos principal.
     */
    @PostMapping("/failback")
    public ResponseEntity<Map<String, Object>> ejecutarFailback() {
        Map<String, Object> resultado = drpService.ejecutarFailbackDrp();
        if ("SUCCESS".equals(resultado.get("status"))) {
            return ResponseEntity.ok(resultado);
        } else {
            return ResponseEntity.status(500).body(resultado);
        }
    }
}
