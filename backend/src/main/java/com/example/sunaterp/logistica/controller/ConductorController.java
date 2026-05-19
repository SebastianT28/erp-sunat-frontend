package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.ConductorDTO;
import com.example.sunaterp.logistica.entity.Conductor;
import com.example.sunaterp.logistica.repository.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/conductor")
public class ConductorController {

    @Autowired
    private ConductorRepository conductorRepository;

    private Map<String, Object> toMap(Conductor c) {
        Map<String, Object> map = new HashMap<>();
        map.put("idConductor", c.getIdConductor());
        map.put("nombre", c.getNombre());
        map.put("tipoDocumentoIdentidad", c.getTipoDocumentoIdentidad());
        map.put("numeroDocumento", c.getNumeroDocumento());
        map.put("numeroLicencia", c.getNumeroLicencia());
        return map;
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody ConductorDTO dto) {
        try {
            if (dto.getNombre() == null || dto.getNombre().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El nombre es obligatorio.");
            }
            if (dto.getTipoDocumentoIdentidad() == null || dto.getTipoDocumentoIdentidad().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El tipo de documento es obligatorio.");
            }
            if (dto.getNumeroDocumento() == null || dto.getNumeroDocumento().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El número de documento es obligatorio.");
            }
            if (dto.getNumeroLicencia() == null || dto.getNumeroLicencia().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El número de licencia es obligatorio.");
            }

            Conductor c = new Conductor();
            c.setNombre(dto.getNombre().trim());
            c.setTipoDocumentoIdentidad(dto.getTipoDocumentoIdentidad().trim());
            c.setNumeroDocumento(dto.getNumeroDocumento().trim().toUpperCase());
            c.setNumeroLicencia(dto.getNumeroLicencia().trim().toUpperCase());

            Conductor saved = conductorRepository.save(c);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Conductor registrado exitosamente");
            result.put("data", toMap(saved));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al registrar conductor: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        try {
            List<Map<String, Object>> data = conductorRepository.findAll().stream()
                    .map(this::toMap).collect(Collectors.toList());
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", data);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar conductores: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            if (!conductorRepository.existsById(id)) {
                return error(HttpStatus.NOT_FOUND, "Conductor no encontrado con ID: " + id);
            }
            conductorRepository.deleteById(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Conductor eliminado exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al eliminar conductor: " + e.getMessage());
        }
    }

    private ResponseEntity<?> error(HttpStatus status, String message) {
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("message", message);
        return ResponseEntity.status(status).body(err);
    }
}
