package com.example.sunaterp.logistica.dto;

import java.time.LocalDate;

public class TransportistaDTO {
    private Long ruc;
    private String razonSocial;
    private String numRegistroMTC;
    private Boolean frecuente;
    private LocalDate fechaTraslado;
    private Integer idConductor;
    private Integer idVehiculo;

    public TransportistaDTO() {}

    public Long getRuc() { return ruc; }
    public void setRuc(Long ruc) { this.ruc = ruc; }

    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getNumRegistroMTC() { return numRegistroMTC; }
    public void setNumRegistroMTC(String numRegistroMTC) { this.numRegistroMTC = numRegistroMTC; }

    public Boolean getFrecuente() { return frecuente; }
    public void setFrecuente(Boolean frecuente) { this.frecuente = frecuente; }

    public LocalDate getFechaTraslado() { return fechaTraslado; }
    public void setFechaTraslado(LocalDate fechaTraslado) { this.fechaTraslado = fechaTraslado; }

    public Integer getIdConductor() { return idConductor; }
    public void setIdConductor(Integer idConductor) { this.idConductor = idConductor; }

    public Integer getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(Integer idVehiculo) { this.idVehiculo = idVehiculo; }
}
