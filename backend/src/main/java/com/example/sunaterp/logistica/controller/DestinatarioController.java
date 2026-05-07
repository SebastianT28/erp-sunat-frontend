package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.entity.Destinatario;
import com.example.sunaterp.logistica.repository.DestinatarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/logistica/destinatario")
public class DestinatarioController {

    @Autowired
    private DestinatarioRepository destinatarioRepository;

    /**
     * GET /api/logistica/destinatario/buscar?numeroDocumento=12345678
     * Busca un destinatario por su número de documento.
     */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorDocumento(@RequestParam String numeroDocumento) {
        Map<String, Object> result = new HashMap<>();

        Optional<Destinatario> destinatario = destinatarioRepository.findByNumeroDocumento(numeroDocumento);

        if (destinatario.isPresent()) {
            Destinatario d = destinatario.get();
            Map<String, Object> data = new HashMap<>();
            data.put("nombre", d.getNombre());
            data.put("tipoDocumentoIdentidad", d.getTipoDocumentoIdentidad());
            data.put("numeroDocumento", d.getNumeroDocumento());

            result.put("success", true);
            result.put("encontrado", true);
            result.put("data", data);
            return ResponseEntity.ok(result);
        } else {
            result.put("success", true);
            result.put("encontrado", false);
            result.put("message", "No se encontró destinatario con documento: " + numeroDocumento);
            return ResponseEntity.ok(result);
        }
    }
}
