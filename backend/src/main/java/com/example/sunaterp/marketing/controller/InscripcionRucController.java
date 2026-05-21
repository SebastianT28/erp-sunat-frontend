package com.example.sunaterp.marketing.controller;

import com.example.sunaterp.marketing.dto.InscripcionRucDTO;
import com.example.sunaterp.marketing.entity.InscripcionRuc;
import com.example.sunaterp.marketing.service.InscripcionRucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/marketing")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InscripcionRucController {

    @Autowired
    private InscripcionRucService inscripcionRucService;

    // Patrón básico para evitar etiquetas HTML/script
    private static final Pattern XSS_PATTERN = Pattern.compile("<script>|<html>|<body>|<iframe>", Pattern.CASE_INSENSITIVE);

    private boolean containsXSS(String input) {
        if (input == null) return false;
        return XSS_PATTERN.matcher(input).find();
    }

    @PostMapping("/inscripcion/guardar")
    public ResponseEntity<InscripcionRuc> guardarInscripcion(@RequestBody InscripcionRucDTO dto) {
        try {
            InscripcionRuc nuevaInscripcion = inscripcionRucService.guardarInscripcion(dto);
            return ResponseEntity.ok(nuevaInscripcion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/enviar-codigo")
    public ResponseEntity<Map<String, String>> enviarCodigo(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String correo = body.get("correo");
            if (correo == null || correo.trim().isEmpty() || containsXSS(correo)) {
                response.put("error", "Correo inválido o contiene caracteres no permitidos");
                return ResponseEntity.badRequest().body(response);
            }
            
            inscripcionRucService.generarYEnviarCodigo(correo);
            response.put("mensaje", "Código enviado correctamente al correo: " + correo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error al enviar el código: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<Map<String, String>> verificarCodigo(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String correo = body.get("correo");
            String codigo = body.get("codigo");
            
            if (correo == null || codigo == null || containsXSS(correo) || containsXSS(codigo)) {
                response.put("error", "Datos inválidos o contienen caracteres no permitidos");
                return ResponseEntity.badRequest().body(response);
            }

            inscripcionRucService.validarCodigo(correo, codigo);
            response.put("mensaje", "Código validado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("error", "Error interno en la validación");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
