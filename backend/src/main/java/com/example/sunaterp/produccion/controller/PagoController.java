package com.example.sunaterp.produccion.controller;

import com.example.sunaterp.produccion.dto.PagoDTO;
import com.example.sunaterp.produccion.entity.PagoNPS;
import com.example.sunaterp.produccion.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produccion")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @PostMapping("/formularios/{id}/pago")
    public ResponseEntity<?> crearPago(@PathVariable Long id, @RequestBody PagoDTO pagoDTO) {
        try {
            PagoNPS pago = pagoService.crearPago(id, pagoDTO);
            return new ResponseEntity<>(pago, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear pago: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/pagos/{numeroOrden}/pagar")
    public ResponseEntity<?> confirmarPago(@PathVariable String numeroOrden) {
        try {
            PagoNPS pago = pagoService.pagar(numeroOrden);
            return new ResponseEntity<>(pago, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al confirmar pago: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
