package com.example.sunaterp.helpdesk.dto;

public class AuthTicketRequestDTO {
    private String descripcion;
    private Integer idUsuario;
    private String usernameAfectado;
    private String correoContacto;

    // Getters y Setters
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getUsernameAfectado() { return usernameAfectado; }
    public void setUsernameAfectado(String usernameAfectado) { this.usernameAfectado = usernameAfectado; }

    public String getCorreoContacto() { return correoContacto; }
    public void setCorreoContacto(String correoContacto) { this.correoContacto = correoContacto; }
}
