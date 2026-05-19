package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.TransportistaDTO;
import com.example.sunaterp.logistica.entity.Conductor;
import com.example.sunaterp.logistica.entity.Transportista;
import com.example.sunaterp.logistica.entity.Vehiculo;
import com.example.sunaterp.logistica.repository.ConductorRepository;
import com.example.sunaterp.logistica.repository.TransportistaRepository;
import com.example.sunaterp.logistica.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/transportista")
public class TransportistaController {

    @Autowired
    private TransportistaRepository transportistaRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    // ====== Utilidad para mapear entidad a Map ======
    private Map<String, Object> toMap(Transportista t) {
        Map<String, Object> map = new HashMap<>();
        map.put("ruc", t.getRuc());
        map.put("razonSocial", t.getRazonSocial());
        map.put("numRegistroMTC", t.getNumRegistroMTC());
        map.put("frecuente", t.getFrecuente());
        map.put("fechaTraslado", t.getFechaTraslado());
        map.put("idConductor", t.getConductor() != null ? t.getConductor().getIdConductor() : null);
        map.put("idVehiculo", t.getVehiculo() != null ? t.getVehiculo().getIdVehiculo() : null);
        // Datos expandidos del conductor
        if (t.getConductor() != null) {
            Map<String, Object> cond = new HashMap<>();
            cond.put("idConductor", t.getConductor().getIdConductor());
            cond.put("nombre", t.getConductor().getNombre());
            cond.put("numeroDocumento", t.getConductor().getNumeroDocumento());
            cond.put("tipoDocumentoIdentidad", t.getConductor().getTipoDocumentoIdentidad());
            cond.put("numeroLicencia", t.getConductor().getNumeroLicencia());
            map.put("conductor", cond);
        }
        // Datos expandidos del vehículo
        if (t.getVehiculo() != null) {
            Map<String, Object> veh = new HashMap<>();
            veh.put("idVehiculo", t.getVehiculo().getIdVehiculo());
            veh.put("placa", t.getVehiculo().getPlaca());
            veh.put("entidadEmisora", t.getVehiculo().getEntidadEmisora());
            veh.put("numeroAutorizacion", t.getVehiculo().getNumeroAutorizacion());
            map.put("vehiculo", veh);
        }
        return map;
    }

    /**
     * POST /api/logistica/transportista
     * Registra un nuevo transportista.
     *
     * Request JSON:
     * {
     * "ruc": 20123456789,
     * "razonSocial": "TRANSPORTES SAC",
     * "numRegistroMTC": "MTC-12345",
     * "frecuente": true,
     * "fechaTraslado": "2026-05-20",
     * "idConductor": 1,
     * "idVehiculo": 2
     * }
     */
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody TransportistaDTO dto) {
        try {
            // Validación: RUC obligatorio
            if (dto.getRuc() == null) {
                return errorResponse(HttpStatus.BAD_REQUEST, "El RUC es obligatorio.");
            }
            // Validación: RUC 11 dígitos
            String rucStr = String.valueOf(dto.getRuc());
            if (rucStr.length() != 11) {
                return errorResponse(HttpStatus.BAD_REQUEST, "El RUC debe tener exactamente 11 dígitos.");
            }
            // Validación: RUC único
            if (transportistaRepository.existsByRuc(dto.getRuc())) {
                return errorResponse(HttpStatus.CONFLICT, "Ya existe un transportista con el RUC: " + dto.getRuc());
            }
            // Validación: razón social obligatoria
            if (dto.getRazonSocial() == null || dto.getRazonSocial().isBlank()) {
                return errorResponse(HttpStatus.BAD_REQUEST, "La razón social es obligatoria.");
            }

            Transportista t = new Transportista();
            t.setRuc(dto.getRuc());
            t.setRazonSocial(dto.getRazonSocial().trim());
            t.setNumRegistroMTC(dto.getNumRegistroMTC());
            t.setFrecuente(dto.getFrecuente() != null && dto.getFrecuente());
            t.setFechaTraslado(dto.getFechaTraslado());

            // Validar y asociar conductor si se envía
            if (dto.getIdConductor() != null) {
                Optional<Conductor> cond = conductorRepository.findById(dto.getIdConductor());
                if (cond.isEmpty()) {
                    return errorResponse(HttpStatus.NOT_FOUND,
                            "No se encontró conductor con ID: " + dto.getIdConductor());
                }
                t.setConductor(cond.get());
            }
            // Validar y asociar vehículo si se envía
            if (dto.getIdVehiculo() != null) {
                Optional<Vehiculo> veh = vehiculoRepository.findById(dto.getIdVehiculo());
                if (veh.isEmpty()) {
                    return errorResponse(HttpStatus.NOT_FOUND,
                            "No se encontró vehículo con ID: " + dto.getIdVehiculo());
                }
                t.setVehiculo(veh.get());
            }

            Transportista saved = transportistaRepository.save(t);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Transportista registrado exitosamente");
            result.put("data", toMap(saved));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al registrar transportista: " + e.getMessage());
        }
    }

    /**
     * GET /api/logistica/transportista/{ruc}
     * Busca un transportista por su RUC.
     * Usado por el frontend para validar existencia.
     */
    @GetMapping("/{ruc}")
    public ResponseEntity<?> buscarPorRuc(@PathVariable Long ruc) {
        try {
            Optional<Transportista> opt = transportistaRepository.findById(ruc);
            if (opt.isEmpty()) {
                return errorResponse(HttpStatus.NOT_FOUND, "No se encontró transportista con RUC: " + ruc);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", toMap(opt.get()));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error al buscar transportista: " + e.getMessage());
        }
    }

    /**
     * GET /api/logistica/transportista/validar/{ruc}
     * Valida si un RUC existe en la base de datos.
     * Response: { "success": true, "existe": true/false }
     */
    @GetMapping("/validar/{ruc}")
    public ResponseEntity<?> validarRuc(@PathVariable Long ruc) {
        try {
            boolean existe = transportistaRepository.existsByRuc(ruc);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("existe", existe);
            if (existe) {
                Optional<Transportista> opt = transportistaRepository.findById(ruc);
                opt.ifPresent(t -> result.put("data", toMap(t)));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error al validar RUC: " + e.getMessage());
        }
    }

    /**
     * GET /api/logistica/transportista/frecuentes
     * Lista todos los transportistas marcados como frecuentes.
     */
    @GetMapping("/frecuentes")
    public ResponseEntity<?> listarFrecuentes() {
        try {
            List<Transportista> lista = transportistaRepository.findByFrecuenteTrue();
            List<Map<String, Object>> response = lista.stream()
                    .map(this::toMap)
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar frecuentes: " + e.getMessage());
        }
    }

    /**
     * GET /api/logistica/transportista
     * Lista todos los transportistas.
     */
    @GetMapping
    public ResponseEntity<?> listarTodos() {
        try {
            List<Transportista> lista = transportistaRepository.findAll();
            List<Map<String, Object>> response = lista.stream()
                    .map(this::toMap)
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar transportistas: " + e.getMessage());
        }
    }

    /**
     * PUT /api/logistica/transportista/{ruc}
     * Actualiza los datos de un transportista existente.
     */
    @PutMapping("/{ruc}")
    public ResponseEntity<?> actualizar(@PathVariable Long ruc, @RequestBody TransportistaDTO dto) {
        try {
            Optional<Transportista> opt = transportistaRepository.findById(ruc);
            if (opt.isEmpty()) {
                return errorResponse(HttpStatus.NOT_FOUND, "No se encontró transportista con RUC: " + ruc);
            }

            Transportista t = opt.get();
            if (dto.getRazonSocial() != null && !dto.getRazonSocial().isBlank()) {
                t.setRazonSocial(dto.getRazonSocial().trim());
            }
            if (dto.getNumRegistroMTC() != null) {
                t.setNumRegistroMTC(dto.getNumRegistroMTC());
            }
            if (dto.getFrecuente() != null) {
                t.setFrecuente(dto.getFrecuente());
            }
            if (dto.getFechaTraslado() != null) {
                t.setFechaTraslado(dto.getFechaTraslado());
            }
            // Actualizar conductor
            if (dto.getIdConductor() != null) {
                Optional<Conductor> cond = conductorRepository.findById(dto.getIdConductor());
                if (cond.isEmpty()) {
                    return errorResponse(HttpStatus.NOT_FOUND,
                            "No se encontró conductor con ID: " + dto.getIdConductor());
                }
                t.setConductor(cond.get());
            }
            // Actualizar vehículo
            if (dto.getIdVehiculo() != null) {
                Optional<Vehiculo> veh = vehiculoRepository.findById(dto.getIdVehiculo());
                if (veh.isEmpty()) {
                    return errorResponse(HttpStatus.NOT_FOUND,
                            "No se encontró vehículo con ID: " + dto.getIdVehiculo());
                }
                t.setVehiculo(veh.get());
            }

            Transportista saved = transportistaRepository.save(t);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Transportista actualizado exitosamente");
            result.put("data", toMap(saved));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al actualizar transportista: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/logistica/transportista/{ruc}
     * Elimina un transportista por su RUC.
     */
    @DeleteMapping("/{ruc}")
    public ResponseEntity<?> eliminar(@PathVariable Long ruc) {
        try {
            if (!transportistaRepository.existsByRuc(ruc)) {
                return errorResponse(HttpStatus.NOT_FOUND, "No se encontró transportista con RUC: " + ruc);
            }
            transportistaRepository.deleteById(ruc);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Transportista eliminado exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al eliminar transportista: " + e.getMessage());
        }
    }

    // ====== Método utilitario para respuestas de error ======
    private ResponseEntity<?> errorResponse(HttpStatus status, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return ResponseEntity.status(status).body(error);
    }
}
