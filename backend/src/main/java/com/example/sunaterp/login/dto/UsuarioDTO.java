package com.example.sunaterp.login.dto;

public class UsuarioDTO {
    private Integer idUsuario;
    private String nombreUsuario;
    private String correo;
    private String rol;
    private ContribuyenteDTO contribuyente;

    public UsuarioDTO() {}

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public ContribuyenteDTO getContribuyente() {
        return contribuyente;
    }

    public void setContribuyente(ContribuyenteDTO contribuyente) {
        this.contribuyente = contribuyente;
    }
}
