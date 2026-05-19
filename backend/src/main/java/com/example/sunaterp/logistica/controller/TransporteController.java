package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.dto.TransporteDTO;
import com.example.sunaterp.logistica.entity.Conductor;
import com.example.sunaterp.logistica.entity.Transporte;
import com.example.sunaterp.logistica.entity.Vehiculo;
import com.example.sunaterp.logistica.repository.ConductorRepository;
import com.example.sunaterp.logistica.repository.TransporteRepository;
import com.example.sunaterp.logistica.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/transporte")
public class TransporteController {

    @Autowired
    private TransporteRepository transporteRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    private Map<String, Object> toMap(Transporte t) {
        Map<String, Object> map = new HashMap<>();
        map.put("idTransporte", t.getIdTransporte());
        map.put("tipoTransporte", t.getTipoTransporte());
        map.put("fechaInicioTraslado", t.getFechaInicioTraslado());

        if (t.getVehiculo() != null) {
            Map<String, Object> veh = new HashMap<>();
            veh.put("idVehiculo", t.getVehiculo().getIdVehiculo());
            veh.put("placa", t.getVehiculo().getPlaca());
            veh.put("entidadEmisora", t.getVehiculo().getEntidadEmisora());
            veh.put("numeroAutorizacion", t.getVehiculo().getNumeroAutorizacion());
            map.put("vehiculo", veh);
        }

        if (t.getConductor() != null) {
            Map<String, Object> cond = new HashMap<>();
            cond.put("idConductor", t.getConductor().getIdConductor());
            cond.put("nombre", t.getConductor().getNombre());
            cond.put("tipoDocumentoIdentidad", t.getConductor().getTipoDocumentoIdentidad());
            cond.put("numeroDocumento", t.getConductor().getNumeroDocumento());
            cond.put("numeroLicencia", t.getConductor().getNumeroLicencia());
            map.put("conductor", cond);
        }

        return map;
    }

    /**
     * POST /api/logistica/transporte
     * Registra un transporte privado completo:
     * 1. Guarda el vehículo en tabla vehiculo
     * 2. Guarda el conductor en tabla conductor
     * 3. Crea el registro en tabla transporte vinculando ambos
     *
     * Request JSON:
     * {
     *   "tipoTransporte": "Privado",
     *   "fechaInicioTraslado": "2026-05-20",
     *   "vehiculo": { "placa": "ABC-123", "entidadEmisora": "MTC", "numeroAutorizacion": "AUT-001" },
     *   "conductor": { "nombre": "Juan Pérez", "tipoDocumentoIdentidad": "DNI", "numeroDocumento": "12345678", "numeroLicencia": "Q12345678" }
     * }
     */
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody TransporteDTO dto) {
        try {
            // Validaciones
            if (dto.getTipoTransporte() == null || dto.getTipoTransporte().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "El tipo de transporte es obligatorio.");
            }
            if (dto.getFechaInicioTraslado() == null || dto.getFechaInicioTraslado().isBlank()) {
                return error(HttpStatus.BAD_REQUEST, "La fecha de inicio de traslado es obligatoria.");
            }
            if (dto.getVehiculo() == null) {
                return error(HttpStatus.BAD_REQUEST, "Los datos del vehículo son obligatorios.");
            }
            if (dto.getConductor() == null) {
                return error(HttpStatus.BAD_REQUEST, "Los datos del conductor son obligatorios.");
            }

            // 1. Guardar vehículo
            Vehiculo vehiculo = new Vehiculo();
            vehiculo.setPlaca(dto.getVehiculo().getPlaca().trim().toUpperCase());
            vehiculo.setEntidadEmisora(dto.getVehiculo().getEntidadEmisora().trim());
            vehiculo.setNumeroAutorizacion(dto.getVehiculo().getNumeroAutorizacion().trim().toUpperCase());
            vehiculo = vehiculoRepository.save(vehiculo);

            // 2. Guardar conductor
            Conductor conductor = new Conductor();
            conductor.setNombre(dto.getConductor().getNombre().trim());
            conductor.setTipoDocumentoIdentidad(dto.getConductor().getTipoDocumentoIdentidad().trim());
            conductor.setNumeroDocumento(dto.getConductor().getNumeroDocumento().trim().toUpperCase());
            conductor.setNumeroLicencia(dto.getConductor().getNumeroLicencia().trim().toUpperCase());
            conductor = conductorRepository.save(conductor);

            // 3. Crear transporte vinculando ambos
            Transporte transporte = new Transporte();
            transporte.setTipoTransporte(dto.getTipoTransporte().trim());
            transporte.setFechaInicioTraslado(LocalDate.parse(dto.getFechaInicioTraslado()));
            transporte.setVehiculo(vehiculo);
            transporte.setConductor(conductor);

            Transporte saved = transporteRepository.save(transporte);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Transporte registrado exitosamente");
            result.put("data", toMap(saved));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al registrar transporte: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        try {
            List<Map<String, Object>> data = transporteRepository.findAll().stream()
                    .map(this::toMap).collect(Collectors.toList());
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", data);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al listar transportes: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            if (!transporteRepository.existsById(id)) {
                return error(HttpStatus.NOT_FOUND, "Transporte no encontrado con ID: " + id);
            }
            transporteRepository.deleteById(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Transporte eliminado exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al eliminar transporte: " + e.getMessage());
        }
    }

    private ResponseEntity<?> error(HttpStatus status, String message) {
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("message", message);
        return ResponseEntity.status(status).body(err);
    }
}
