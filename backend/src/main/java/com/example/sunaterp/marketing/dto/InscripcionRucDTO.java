package com.example.sunaterp.marketing.dto;

import java.time.LocalDate;

public class InscripcionRucDTO {

    private String dni;
    private String motivoInscripcion;
    private String actividadEconomica;
    private String profesion;
    private LocalDate inicioActividades;
    private String departamento;
    private String provincia;
    private String distrito;
    private String direccionFisica;
    private String condicionDomicilio;
    private String regimenTributario;
    private String telefono;
    private String correo;
    private String nombres;
    private String apellidos;
    private String username;
    private String claveSol;

    public InscripcionRucDTO() {}

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getMotivoInscripcion() { return motivoInscripcion; }
    public void setMotivoInscripcion(String motivoInscripcion) { this.motivoInscripcion = motivoInscripcion; }

    public String getActividadEconomica() { return actividadEconomica; }
    public void setActividadEconomica(String actividadEconomica) { this.actividadEconomica = actividadEconomica; }

    public String getProfesion() { return profesion; }
    public void setProfesion(String profesion) { this.profesion = profesion; }

    public LocalDate getInicioActividades() { return inicioActividades; }
    public void setInicioActividades(LocalDate inicioActividades) { this.inicioActividades = inicioActividades; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }

    public String getDireccionFisica() { return direccionFisica; }
    public void setDireccionFisica(String direccionFisica) { this.direccionFisica = direccionFisica; }

    public String getCondicionDomicilio() { return condicionDomicilio; }
    public void setCondicionDomicilio(String condicionDomicilio) { this.condicionDomicilio = condicionDomicilio; }

    public String getRegimenTributario() { return regimenTributario; }
    public void setRegimenTributario(String regimenTributario) { this.regimenTributario = regimenTributario; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getClaveSol() { return claveSol; }
    public void setClaveSol(String claveSol) { this.claveSol = claveSol; }
}
