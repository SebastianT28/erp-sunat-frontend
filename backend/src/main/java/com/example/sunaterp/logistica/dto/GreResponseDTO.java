package com.example.sunaterp.logistica.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO de respuesta para devolver los datos completos de una GRE emitida.
 */
public class GreResponseDTO {

    private Integer idGre;
    private String tipoGuia;
    private LocalDate fechaEmision;
    private String motivoTraslado;
    private String estado;

    // Destinatario
    private String destinatarioNombre;
    private String destinatarioTipoDoc;
    private String destinatarioNumDoc;

    // Bienes
    private List<BienDTO> bienes;

    // Documentos
    private List<DocumentoRelacionadoDTO> documentosRelacionados;

    // Puntos de traslado
    private PuntoTrasladoDTO puntoPartida;
    private PuntoTrasladoDTO puntoLlegada;

    // Transporte
    private TransporteDTO transporte;

    public GreResponseDTO() {}

    public Integer getIdGre() { return idGre; }
    public void setIdGre(Integer idGre) { this.idGre = idGre; }

    public String getTipoGuia() { return tipoGuia; }
    public void setTipoGuia(String tipoGuia) { this.tipoGuia = tipoGuia; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public String getMotivoTraslado() { return motivoTraslado; }
    public void setMotivoTraslado(String motivoTraslado) { this.motivoTraslado = motivoTraslado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getDestinatarioNombre() { return destinatarioNombre; }
    public void setDestinatarioNombre(String destinatarioNombre) { this.destinatarioNombre = destinatarioNombre; }

    public String getDestinatarioTipoDoc() { return destinatarioTipoDoc; }
    public void setDestinatarioTipoDoc(String destinatarioTipoDoc) { this.destinatarioTipoDoc = destinatarioTipoDoc; }

    public String getDestinatarioNumDoc() { return destinatarioNumDoc; }
    public void setDestinatarioNumDoc(String destinatarioNumDoc) { this.destinatarioNumDoc = destinatarioNumDoc; }

    public List<BienDTO> getBienes() { return bienes; }
    public void setBienes(List<BienDTO> bienes) { this.bienes = bienes; }

    public List<DocumentoRelacionadoDTO> getDocumentosRelacionados() { return documentosRelacionados; }
    public void setDocumentosRelacionados(List<DocumentoRelacionadoDTO> documentosRelacionados) { this.documentosRelacionados = documentosRelacionados; }

    public PuntoTrasladoDTO getPuntoPartida() { return puntoPartida; }
    public void setPuntoPartida(PuntoTrasladoDTO puntoPartida) { this.puntoPartida = puntoPartida; }

    public PuntoTrasladoDTO getPuntoLlegada() { return puntoLlegada; }
    public void setPuntoLlegada(PuntoTrasladoDTO puntoLlegada) { this.puntoLlegada = puntoLlegada; }

    public TransporteDTO getTransporte() { return transporte; }
    public void setTransporte(TransporteDTO transporte) { this.transporte = transporte; }
}
