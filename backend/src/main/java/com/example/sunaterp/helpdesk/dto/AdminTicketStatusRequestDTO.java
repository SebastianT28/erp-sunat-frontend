package com.example.sunaterp.helpdesk.dto;

public class AdminTicketStatusRequestDTO {
    private String estado;
    private String respuestaAdministrador;

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getRespuestaAdministrador() { return respuestaAdministrador; }
    public void setRespuestaAdministrador(String respuestaAdministrador) { this.respuestaAdministrador = respuestaAdministrador; }
}
