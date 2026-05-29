package com.example.sunaterp.helpdesk.dto;

public class TicketResponseDTO {
    private String numeroTicket;
    private String estado;
    private String areaAsignada;
    private String descripcion;

    public TicketResponseDTO(String numeroTicket, String estado, String areaAsignada, String descripcion) {
        this.numeroTicket = numeroTicket;
        this.estado = estado;
        this.areaAsignada = areaAsignada;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public String getNumeroTicket() { return numeroTicket; }
    public void setNumeroTicket(String numeroTicket) { this.numeroTicket = numeroTicket; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getAreaAsignada() { return areaAsignada; }
    public void setAreaAsignada(String areaAsignada) { this.areaAsignada = areaAsignada; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
