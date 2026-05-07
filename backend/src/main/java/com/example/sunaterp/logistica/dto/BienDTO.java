package com.example.sunaterp.logistica.dto;

import java.math.BigDecimal;

public class BienDTO {
    private String codigoBien;
    private String descripcion;
    private String unidadMedida;
    private BigDecimal peso;
    private Integer cantidad;

    public BienDTO() {}

    public String getCodigoBien() { return codigoBien; }
    public void setCodigoBien(String codigoBien) { this.codigoBien = codigoBien; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
