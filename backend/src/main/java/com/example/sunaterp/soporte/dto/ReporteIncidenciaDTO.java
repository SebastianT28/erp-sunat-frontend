package com.example.sunaterp.soporte.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ReporteIncidenciaDTO {

    private Long id;
    private String codigo;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime fechaDeteccion;

    private String reportadoPor;
    private String areaAfectada;
    private String categoria;
    private String descripcion;
    private String urgencia;
    private String impacto;
    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaCreacion;

    private CierreIncidenciaDTO cierre;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public LocalDateTime getFechaDeteccion() { return fechaDeteccion; }
    public void setFechaDeteccion(LocalDateTime fechaDeteccion) { this.fechaDeteccion = fechaDeteccion; }

    public String getReportadoPor() { return reportadoPor; }
    public void setReportadoPor(String reportadoPor) { this.reportadoPor = reportadoPor; }

    public String getAreaAfectada() { return areaAfectada; }
    public void setAreaAfectada(String areaAfectada) { this.areaAfectada = areaAfectada; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUrgencia() { return urgencia; }
    public void setUrgencia(String urgencia) { this.urgencia = urgencia; }

    public String getImpacto() { return impacto; }
    public void setImpacto(String impacto) { this.impacto = impacto; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public CierreIncidenciaDTO getCierre() { return cierre; }
    public void setCierre(CierreIncidenciaDTO cierre) { this.cierre = cierre; }
}
