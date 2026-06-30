package com.example.sunaterp.soporte.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class CierreIncidenciaDTO {

    private Long id;
    private Long reporteId;
    private String tipoIncidencia;
    private String responsableResolucion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime horaInicioAtencion;

    private String causaRaiz;
    private String accionContencion;
    private String requirioRollback;
    private String tipoRollback;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime horaResolucion;

    private String tiempoTotalResolucion;
    private String accionPreventiva;
    private String estadoFinal;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReporteId() { return reporteId; }
    public void setReporteId(Long reporteId) { this.reporteId = reporteId; }

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
}
