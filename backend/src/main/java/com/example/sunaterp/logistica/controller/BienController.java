package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.BienDTO;
import com.example.sunaterp.logistica.entity.Bien;
import com.example.sunaterp.logistica.repository.BienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/bien")
public class BienController {

    @Autowired
    private BienRepository bienRepository;

    /**
     * POST /api/logistica/bien
     * Registra un nuevo bien en la base de datos.
     */
    @PostMapping
    public ResponseEntity<?> crearBien(@RequestBody BienDTO dto) {
        try {
            Bien bien = new Bien();
            bien.setCodigoBien(dto.getCodigoBien());
            bien.setDescripcion(dto.getDescripcion());
            bien.setUnidadMedida(dto.getUnidadMedida());
            bien.setPeso(dto.getPeso());
            bien.setCantidad(dto.getCantidad());
            bien.setNormalizado(dto.getNormalizado() != null ? dto.getNormalizado() : false);

            Bien saved = bienRepository.save(bien);

            BienDTO response = new BienDTO();
            response.setCodigoBien(saved.getCodigoBien());
            response.setDescripcion(saved.getDescripcion());
            response.setUnidadMedida(saved.getUnidadMedida());
            response.setPeso(saved.getPeso());
            response.setCantidad(saved.getCantidad());
            response.setNormalizado(saved.getNormalizado());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Bien registrado exitosamente");
            result.put("data", response);
            result.put("idBien", saved.getIdBien());

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al registrar bien: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * GET /api/logistica/bien
     * Lista todos los bienes registrados.
     */
    @GetMapping
    public ResponseEntity<?> listarBienes() {
        try {
            List<Bien> bienes = bienRepository.findAll();
            List<Map<String, Object>> response = bienes.stream().map(bien -> {
                Map<String, Object> map = new HashMap<>();
                map.put("idBien", bien.getIdBien());
                map.put("codigoBien", bien.getCodigoBien());
                map.put("descripcion", bien.getDescripcion());
                map.put("unidadMedida", bien.getUnidadMedida());
                map.put("peso", bien.getPeso());
                map.put("cantidad", bien.getCantidad());
                map.put("normalizado", bien.getNormalizado());
                return map;
            }).collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al listar bienes: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * DELETE /api/logistica/bien/{id}
     * Elimina un bien por su ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarBien(@PathVariable Integer id) {
        try {
            if (!bienRepository.existsById(id)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Bien no encontrado con ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            bienRepository.deleteById(id);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Bien eliminado exitosamente");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al eliminar bien: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
