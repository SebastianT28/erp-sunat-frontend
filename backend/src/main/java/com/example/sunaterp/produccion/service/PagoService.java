package com.example.sunaterp.produccion.service;

import com.example.sunaterp.produccion.dto.PagoDTO;
import com.example.sunaterp.produccion.entity.EstadoPago;
import com.example.sunaterp.produccion.entity.FormularioGeneral;
import com.example.sunaterp.produccion.entity.PagoNPS;
import com.example.sunaterp.produccion.repository.FormularioGeneralRepository;
import com.example.sunaterp.produccion.repository.PagoNPSRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PagoService {

    @Autowired
    private PagoNPSRepository pagoRepository;

    @Autowired
    private FormularioGeneralRepository formularioRepository;

    @Transactional
    public PagoNPS crearPago(Long formularioId, PagoDTO dto) {
        FormularioGeneral formulario = formularioRepository.findById(formularioId)
            .orElseThrow(() -> new RuntimeException("Formulario no encontrado"));

        PagoNPS pago = new PagoNPS();
        pago.setNumeroNps(dto.getNumeroNps());
        pago.setNumeroOrden(dto.getNumeroOrden());
        pago.setMontoTotal(dto.getMontoTotal());
        pago.setFechaVencimiento(dto.getFechaVencimiento());
        pago.setEstado(EstadoPago.PENDIENTE);
        
        pago.setFormulario(formulario);
        formulario.setPago(pago);

        return pagoRepository.save(pago);
    }

    @Transactional
    public PagoNPS pagar(String numeroOrden) {
        PagoNPS pago = pagoRepository.findByNumeroOrden(numeroOrden)
            .orElseThrow(() -> new RuntimeException("Pago no encontrado con N° Orden: " + numeroOrden));
        
        pago.setEstado(EstadoPago.PAGADO);
        return pagoRepository.save(pago);
    }
}
