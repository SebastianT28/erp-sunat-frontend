package com.example.sunaterp.monitoring.dto;

import java.time.Instant;
import java.util.UUID;

public class SystemAlertDTO {
    private String id;
    private String nivel;
    private String area;
    private String mensaje;
    private Instant timestamp;

    public SystemAlertDTO() {
    }

    public SystemAlertDTO(String nivel, String area, String mensaje) {
        this.id = UUID.randomUUID().toString();
        this.nivel = nivel;
        this.area = area;
        this.mensaje = mensaje;
        this.timestamp = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
