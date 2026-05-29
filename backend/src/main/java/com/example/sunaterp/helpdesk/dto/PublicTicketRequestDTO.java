package com.example.sunaterp.helpdesk.dto;

public class PublicTicketRequestDTO {
    private String usernameAfectado;
    private String correoContacto;
    private String descripcion;

    // Getters y Setters
    public String getUsernameAfectado() { return usernameAfectado; }
    public void setUsernameAfectado(String usernameAfectado) { this.usernameAfectado = usernameAfectado; }

    public String getCorreoContacto() { return correoContacto; }
    public void setCorreoContacto(String correoContacto) { this.correoContacto = correoContacto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
