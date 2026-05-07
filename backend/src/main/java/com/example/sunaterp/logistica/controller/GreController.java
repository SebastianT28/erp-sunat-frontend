package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.EmisionGreDTO;
import com.example.sunaterp.logistica.dto.GreResponseDTO;
import com.example.sunaterp.logistica.entity.Gre;
import com.example.sunaterp.logistica.service.GreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/gre")
public class GreController {

    @Autowired
    private GreService greService;

    /**
     * POST /api/logistica/gre/emitir
     * Emite una nueva GRE con todos los datos de los 5 pasos del formulario.
     */
    @PostMapping("/emitir")
    public ResponseEntity<?> emitirGre(@RequestBody EmisionGreDTO dto) {
        try {
            Gre gre = greService.emitirGre(dto);
            GreResponseDTO response = greService.convertirAResponseDTO(gre);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "GRE emitida exitosamente");
            result.put("data", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al emitir GRE: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * GET /api/logistica/gre
     * Lista todas las GREs emitidas.
     */
    @GetMapping
    public ResponseEntity<?> listarGres() {
        try {
            List<Gre> gres = greService.listarGres();
            List<GreResponseDTO> response = gres.stream()
                    .map(greService::convertirAResponseDTO)
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al listar GREs: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/logistica/gre/{id}
     * Obtiene una GRE por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerGre(@PathVariable Integer id) {
        try {
            Gre gre = greService.obtenerGrePorId(id);
            GreResponseDTO response = greService.convertirAResponseDTO(gre);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * GET /api/logistica/gre/estado/{estado}
     * Lista GREs filtradas por estado.
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> listarGresPorEstado(@PathVariable String estado) {
        try {
            List<Gre> gres = greService.listarGresPorEstado(estado);
            List<GreResponseDTO> response = gres.stream()
                    .map(greService::convertirAResponseDTO)
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al listar GREs: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
