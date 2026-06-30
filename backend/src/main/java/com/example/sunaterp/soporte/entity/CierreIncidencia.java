package com.example.sunaterp.soporte.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cierre_incidencia", schema = "soporte")
public class CierreIncidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporte_id", nullable = false, unique = true)
    private ReporteIncidencia reporte;

    @Column(name = "tipo_incidencia", nullable = false, length = 100)
    private String tipoIncidencia;

    @Column(name = "responsable_resolucion", nullable = false, length = 200)
    private String responsableResolucion;

    @Column(name = "hora_inicio_atencion", nullable = false)
    private LocalDateTime horaInicioAtencion;

    @Column(name = "causa_raiz", nullable = false, columnDefinition = "TEXT")
    private String causaRaiz;

    @Column(name = "accion_contencion", columnDefinition = "TEXT")
    private String accionContencion;

    @Column(name = "requirio_rollback", length = 20)
    private String requirioRollback;

    @Column(name = "tipo_rollback", length = 100)
    private String tipoRollback;

    @Column(name = "hora_resolucion")
    private LocalDateTime horaResolucion;

    @Column(name = "tiempo_total_resolucion", length = 100)
    private String tiempoTotalResolucion;

    @Column(name = "accion_preventiva", columnDefinition = "TEXT")
    private String accionPreventiva;

    @Column(name = "estado_final", nullable = false, length = 50)
    private String estadoFinal;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReporteIncidencia getReporte() { return reporte; }
    public void setReporte(ReporteIncidencia reporte) { this.reporte = reporte; }

    public String getTipoIncidencia() { return tipoIncidencia; }
    public void setTipoIncidencia(String tipoIncidencia) { this.tipoIncidencia = tipoIncidencia; }

    public String getResponsableResolucion() { return responsableResolucion; }
    public void setResponsableResolucion(String responsableResolucion) { this.responsableResolucion = responsableResolucion; }

    public LocalDateTime getHoraInicioAtencion() { return horaInicioAtencion; }
    public void setHoraInicioAtencion(LocalDateTime horaInicioAtencion) { this.horaInicioAtencion = horaInicioAtencion; }

    public String getCausaRaiz() { return causaRaiz; }
    public void setCausaRaiz(String causaRaiz) { this.causaRaiz = causaRaiz; }

    public String getAccionContencion() { return accionContencion; }
    public void setAccionContencion(String accionContencion) { this.accionContencion = accionContencion; }

    public String getRequirioRollback() { return requirioRollback; }
    public void setRequirioRollback(String requirioRollback) { this.requirioRollback = requirioRollback; }

    public String getTipoRollback() { return tipoRollback; }
    public void setTipoRollback(String tipoRollback) { this.tipoRollback = tipoRollback; }

    public LocalDateTime getHoraResolucion() { return horaResolucion; }
    public void setHoraResolucion(LocalDateTime horaResolucion) { this.horaResolucion = horaResolucion; }

    public String getTiempoTotalResolucion() { return tiempoTotalResolucion; }
    public void setTiempoTotalResolucion(String tiempoTotalResolucion) { this.tiempoTotalResolucion = tiempoTotalResolucion; }

    public String getAccionPreventiva() { return accionPreventiva; }
    public void setAccionPreventiva(String accionPreventiva) { this.accionPreventiva = accionPreventiva; }

    public String getEstadoFinal() { return estadoFinal; }
    public void setEstadoFinal(String estadoFinal) { this.estadoFinal = estadoFinal; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
