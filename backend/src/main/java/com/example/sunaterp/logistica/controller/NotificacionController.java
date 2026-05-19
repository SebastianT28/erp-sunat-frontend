package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.ReclamoDTO;
import com.example.sunaterp.logistica.entity.Notificacion;
import com.example.sunaterp.logistica.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica/notificacion")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @PostMapping("/reclamo")
    public ResponseEntity<?> presentarReclamo(@RequestBody ReclamoDTO dto) {
        try {
            Notificacion n = notificacionService.crearReclamo(dto);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Reclamo presentado correctamente");
            result.put("idNotificacion", n.getIdNotificacion());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
