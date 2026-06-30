package com.example.sunaterp.soporte.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reporte_incidencia", schema = "soporte")
public class ReporteIncidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(name = "fecha_deteccion", nullable = false)
    private LocalDateTime fechaDeteccion;

    @Column(name = "reportado_por", nullable = false, length = 200)
    private String reportadoPor;

    @Column(name = "area_afectada", nullable = false, length = 200)
    private String areaAfectada;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 20)
    private String urgencia;

    @Column(columnDefinition = "TEXT")
    private String impacto;

    @Column(nullable = false, length = 50)
    private String estado = "Abierto";

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @OneToOne(mappedBy = "reporte", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CierreIncidencia cierre;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

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

    public CierreIncidencia getCierre() { return cierre; }
    public void setCierre(CierreIncidencia cierre) { this.cierre = cierre; }
}
