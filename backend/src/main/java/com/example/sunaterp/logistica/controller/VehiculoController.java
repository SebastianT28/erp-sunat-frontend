package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.VehiculoDTO;
import com.example.sunaterp.logistica.entity.Vehiculo;
import com.example.sunaterp.logistica.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/vehiculo")
public class VehiculoController {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    private Map<String, Object> toMap(Vehiculo v) {
        Map<String, Object> map = new HashMap<>();
        map.put("idVehiculo", v.getIdVehiculo());
        map.put("placa", v.getPlaca());
        map.put("entidadEmisora", v.getEntidadEmisora());
        map.put("numeroAutorizacion", v.getNumeroAutorizacion());
        return map;
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody VehiculoDTO dto) {
        try {
            if (dto.getPlaca() == null || dto.getPlaca().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "La placa es obligatoria.");
            }
            if (dto.getEntidadEmisora() == null || dto.getEntidadEmisora().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "La entidad emisora es obligatoria.");
            }
            if (dto.getNumeroAutorizacion() == null || dto.getNumeroAutorizacion().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El número de autorización es obligatorio.");
            }

            Vehiculo v = new Vehiculo();
            v.setPlaca(dto.getPlaca().trim().toUpperCase());
            v.setEntidadEmisora(dto.getEntidadEmisora().trim());
            v.setNumeroAutorizacion(dto.getNumeroAutorizacion().trim().toUpperCase());

            Vehiculo saved = vehiculoRepository.save(v);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Vehículo registrado exitosamente");
            result.put("data", toMap(saved));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al registrar vehículo: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        try {
            List<Map<String, Object>> data = vehiculoRepository.findAll().stream()
                    .map(this::toMap).collect(Collectors.toList());
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", data);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar vehículos: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            if (!vehiculoRepository.existsById(id)) {
                return error(HttpStatus.NOT_FOUND, "Vehículo no encontrado con ID: " + id);
            }
            vehiculoRepository.deleteById(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Vehículo eliminado exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al eliminar vehículo: " + e.getMessage());
        }
    }

    private ResponseEntity<?> error(HttpStatus status, String message) {
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("message", message);
        return ResponseEntity.status(status).body(err);
    }
}
