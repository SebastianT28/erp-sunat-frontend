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
@RequestMapping("/api/logistica/documento-relacionado")
public class DocumentoRelacionadoController {

    @Autowired
    private DocumentoRelacionadoRepository documentoRelacionadoRepository;

    /**
     * GET /api/logistica/documento-relacionado/validar?tipo=Boleta de venta&serie=B001&numero=000123
     * Verifica si un documento relacionado existe en la tabla documento_relacionado.
     * Soporta: Factura, Boleta de venta, Guia de remision remitente
     */
    @GetMapping("/validar")
    public ResponseEntity<?> validarDocumento(
            @RequestParam String tipo,
            @RequestParam String serie,
            @RequestParam String numero) {

        Map<String, Object> result = new HashMap<>();

        // Validar que el tipo sea uno de los permitidos
        if (!tipo.equals("Factura") && !tipo.equals("Boleta de venta") && !tipo.equals("Guia de remision remitente")) {
            result.put("success", false);
            result.put("existe", false);
            result.put("message", "Tipo de documento no válido: " + tipo);
            return ResponseEntity.badRequest().body(result);
        }

        Optional<DocumentoRelacionado> documento = documentoRelacionadoRepository
                .findByTipoAndSerieAndNumero(tipo, serie, numero);

        if (documento.isPresent()) {
            result.put("success", true);
            result.put("existe", true);
            result.put("message", tipo + " encontrada.");
            return ResponseEntity.ok(result);
        } else {
            result.put("success", true);
            result.put("existe", false);
            result.put("message", "El documento (" + tipo + ") no existe en la base de datos.");
            return ResponseEntity.ok(result);
        }
    }
}
