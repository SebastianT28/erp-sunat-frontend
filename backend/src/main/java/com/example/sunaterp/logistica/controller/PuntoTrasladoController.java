package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.DireccionDTO;
import com.example.sunaterp.logistica.entity.Direccion;
import com.example.sunaterp.logistica.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/punto-traslado")
public class PuntoTrasladoController {

    @Autowired
    private DireccionRepository direccionRepository;

    /**
     * POST /api/logistica/punto-traslado
     * Guarda una dirección con flag frecuente.
     * El tipo (partida/llegada) vive en punto_traslado.tipo, no en direccion.
     */
    @PostMapping
    public ResponseEntity<?> guardarPunto(@RequestBody DireccionDTO dto) {
        try {
            Direccion dir = new Direccion();
            dir.setDepartamento(dto.getDepartamento());
            dir.setProvincia(dto.getProvincia());
            dir.setDistrito(dto.getDistrito());
            dir.setDireccionDetallada(dto.getDireccionDetallada());
            dir.setFrecuente(dto.getFrecuente() != null && dto.getFrecuente());

            Direccion saved = direccionRepository.save(dir);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Dirección guardada exitosamente");
            result.put("idDireccion", saved.getIdDireccion());
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar dirección: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * GET /api/logistica/punto-traslado/frecuentes?tipo=partida|llegada
     * Lista las direcciones frecuentes. El tipo se filtra a través de
     * punto_traslado.tipo
     * haciendo JOIN, ya que punto_traslado posee la FK a direccion y su propio
     * campo tipo.
     */
    @GetMapping("/frecuentes")
    public ResponseEntity<?> listarFrecuentes(@RequestParam(required = false) String tipo) {
        try {
            // Consultamos todas las direcciones frecuentes directamente,
            // ya que pueden no tener aún un PuntoTraslado asociado.
            List<Direccion> lista = direccionRepository.findByFrecuenteTrue();

            List<Map<String, Object>> response = lista.stream().map(d -> {
                Map<String, Object> map = new HashMap<>();
                map.put("idDireccion", d.getIdDireccion());
                map.put("departamento", d.getDepartamento());
                map.put("provincia", d.getProvincia());
                map.put("distrito", d.getDistrito());
                map.put("direccionDetallada", d.getDireccionDetallada());
                return map;
            }).collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al listar frecuentes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
