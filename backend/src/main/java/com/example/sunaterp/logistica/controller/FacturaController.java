package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.entity.DocumentoRelacionado;
import com.example.sunaterp.logistica.repository.DocumentoRelacionadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/logistica/factura")
public class FacturaController {

    @Autowired
    private DocumentoRelacionadoRepository documentoRelacionadoRepository;

    /**
     * GET /api/logistica/factura/validar?serie=F001&numero=000123
     * Verifica si una factura existe en la tabla documento_relacionado.
     */
    @GetMapping("/validar")
    public ResponseEntity<?> validarFactura(@RequestParam String serie, @RequestParam String numero) {
        Map<String, Object> result = new HashMap<>();

        Optional<DocumentoRelacionado> documento = documentoRelacionadoRepository
                .findByTipoAndSerieAndNumero("Factura", serie, numero);

        if (documento.isPresent()) {
            result.put("success", true);
            result.put("existe", true);
            result.put("message", "Factura encontrada.");
            return ResponseEntity.ok(result);
        } else {
            result.put("success", true);
            result.put("existe", false);
            result.put("message", "La factura no existe en la base de datos.");
            return ResponseEntity.ok(result);
        }
    }
}
