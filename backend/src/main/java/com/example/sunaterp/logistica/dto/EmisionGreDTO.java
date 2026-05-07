package com.example.sunaterp.logistica.dto;

import java.util.List;

/**
 * DTO principal que agrupa todos los datos del proceso de emisión de GRE.
 * Corresponde a los 5 pasos del frontend:
 * 1. Datos de emisión (tipoGuia, motivoTraslado, destinatario)
 * 2. Documentos relacionados
 * 3. Bienes a transportar
 * 4. Puntos de traslado (partida y llegada)
 * 5. Datos del transporte (vehículo, conductor, fecha)
 */
public class EmisionGreDTO {

    // Paso 1 - Datos de emisión
    private String tipoGuia; // "remitente" o "transportista"
    private String motivoTraslado;
    private DestinatarioDTO destinatario;
    private Integer idUsuario; // ID del usuario que emite

    // Paso 2 - Documentos relacionados
    private List<DocumentoRelacionadoDTO> documentosRelacionados;

    // Paso 3 - Bienes a transportar
    private List<BienDTO> bienes;

    // Paso 4 - Puntos de traslado
    private PuntoTrasladoDTO puntoPartida;
    private PuntoTrasladoDTO puntoLlegada;

    // Paso 5 - Datos del transporte
    private TransporteDTO transporte;

    public EmisionGreDTO() {
    }

    public String getTipoGuia() {
        return tipoGuia;
    }

    public void setTipoGuia(String tipoGuia) {
        this.tipoGuia = tipoGuia;
    }

    public String getMotivoTraslado() {
        return motivoTraslado;
    }

    public void setMotivoTraslado(String motivoTraslado) {
        this.motivoTraslado = motivoTraslado;
    }

    public DestinatarioDTO getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(DestinatarioDTO destinatario) {
        this.destinatario = destinatario;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<DocumentoRelacionadoDTO> getDocumentosRelacionados() {
        return documentosRelacionados;
    }

    public void setDocumentosRelacionados(List<DocumentoRelacionadoDTO> documentosRelacionados) {
        this.documentosRelacionados = documentosRelacionados;
    }

    public List<BienDTO> getBienes() {
        return bienes;
    }

    public void setBienes(List<BienDTO> bienes) {
        this.bienes = bienes;
    }

    public PuntoTrasladoDTO getPuntoPartida() {
        return puntoPartida;
    }

    public void setPuntoPartida(PuntoTrasladoDTO puntoPartida) {
        this.puntoPartida = puntoPartida;
    }

    public PuntoTrasladoDTO getPuntoLlegada() {
        return puntoLlegada;
    }

    public void setPuntoLlegada(PuntoTrasladoDTO puntoLlegada) {
        this.puntoLlegada = puntoLlegada;
    }

    public TransporteDTO getTransporte() {
        return transporte;
    }

    public void setTransporte(TransporteDTO transporte) {
        this.transporte = transporte;
    }
}
