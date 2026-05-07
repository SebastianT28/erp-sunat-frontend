package com.example.sunaterp.logistica.dto;

public class PuntoTrasladoDTO {
    private String tipo; // "partida" o "llegada"
    private DireccionDTO direccion;
    private String rucAsociado;

    public PuntoTrasladoDTO() {}

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public DireccionDTO getDireccion() { return direccion; }
    public void setDireccion(DireccionDTO direccion) { this.direccion = direccion; }

    public String getRucAsociado() { return rucAsociado; }
    public void setRucAsociado(String rucAsociado) { this.rucAsociado = rucAsociado; }
}
