package com.example.sunaterp.produccion.dto;

import java.time.LocalDate;
import com.example.sunaterp.produccion.entity.EstadoPago;

public class PagoDTO {
    private String numeroNps;
    private String numeroOrden;
    private Double montoTotal;
    private LocalDate fechaVencimiento;
    private EstadoPago estado;

    public String getNumeroNps() {
        return numeroNps;
    }

    public void setNumeroNps(String numeroNps) {
        this.numeroNps = numeroNps;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public Double getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(Double montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public EstadoPago getEstado() {
        return estado;
    }

    public void setEstado(EstadoPago estado) {
        this.estado = estado;
    }
}
