package com.example.sunaterp.helpdesk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "helpdesk_ticket", schema = "soporte")
public class HelpdeskTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTicket;

    @Column(unique = true, length = 20)
    private String numeroTicket;

    // Usuario asociado si estaba logueado al crear el ticket
    private Integer idUsuarioLogueado;

    // Datos para usuarios no logueados que reportan problemas de acceso
    private String usernameAfectado;
    private String correoContacto;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String estado; // PENDIENTE, EN_PROCESO, RESUELTO
    private String areaAsignada;

    @Column(columnDefinition = "TEXT")
    private String respuestaAdministrador;

    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "PENDIENTE";
        }
    }

    // Getters y Setters
    public Integer getIdTicket() { return idTicket; }
    public void setIdTicket(Integer idTicket) { this.idTicket = idTicket; }

    public String getNumeroTicket() { return numeroTicket; }
    public void setNumeroTicket(String numeroTicket) { this.numeroTicket = numeroTicket; }

    public Integer getIdUsuarioLogueado() { return idUsuarioLogueado; }
    public void setIdUsuarioLogueado(Integer idUsuarioLogueado) { this.idUsuarioLogueado = idUsuarioLogueado; }

    public String getUsernameAfectado() { return usernameAfectado; }
    public void setUsernameAfectado(String usernameAfectado) { this.usernameAfectado = usernameAfectado; }

    public String getCorreoContacto() { return correoContacto; }
    public void setCorreoContacto(String correoContacto) { this.correoContacto = correoContacto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getAreaAsignada() { return areaAsignada; }
    public void setAreaAsignada(String areaAsignada) { this.areaAsignada = areaAsignada; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public String getRespuestaAdministrador() { return respuestaAdministrador; }
    public void setRespuestaAdministrador(String respuestaAdministrador) { this.respuestaAdministrador = respuestaAdministrador; }
}
