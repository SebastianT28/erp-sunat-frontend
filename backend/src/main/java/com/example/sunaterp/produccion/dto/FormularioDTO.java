package com.example.sunaterp.produccion.dto;

import java.math.BigDecimal;
import java.util.List;

public class FormularioDTO {
    // Para simplificar la recepción desde frontend (MM/AAAA)
    private String periodoTributario;
    
    private String tipoDeclaracion;
    private String condicionIgv;
    private Boolean ventasNoGravadas;
    private Boolean ivap;
    private String regimenTributario;
    private String otrosRegimenes;
    private BigDecimal tipoCambio;
    private Boolean suspensionPagos;
    private Boolean pdt625;
    private String numeroResolucion;
    
    // Fecha en formato String DD/MM/AAAA para procesarlo
    private String fechaModificacion;
    
    private BigDecimal coeficienteSunat;
    private List<CasillaDTO> casillas;

    public String getPeriodoTributario() {
        return periodoTributario;
    }

    public void setPeriodoTributario(String periodoTributario) {
        this.periodoTributario = periodoTributario;
    }

    public String getTipoDeclaracion() {
        return tipoDeclaracion;
    }

    public void setTipoDeclaracion(String tipoDeclaracion) {
        this.tipoDeclaracion = tipoDeclaracion;
    }

    public String getCondicionIgv() {
        return condicionIgv;
    }

    public void setCondicionIgv(String condicionIgv) {
        this.condicionIgv = condicionIgv;
    }

    public Boolean getVentasNoGravadas() {
        return ventasNoGravadas;
    }

    public void setVentasNoGravadas(Boolean ventasNoGravadas) {
        this.ventasNoGravadas = ventasNoGravadas;
    }

    public Boolean getIvap() {
        return ivap;
    }

    public void setIvap(Boolean ivap) {
        this.ivap = ivap;
    }

    public String getRegimenTributario() {
        return regimenTributario;
    }

    public void setRegimenTributario(String regimenTributario) {
        this.regimenTributario = regimenTributario;
    }

    public String getOtrosRegimenes() {
        return otrosRegimenes;
    }

    public void setOtrosRegimenes(String otrosRegimenes) {
        this.otrosRegimenes = otrosRegimenes;
    }

    public BigDecimal getTipoCambio() {
        return tipoCambio;
    }

    public void setTipoCambio(BigDecimal tipoCambio) {
        this.tipoCambio = tipoCambio;
    }

    public Boolean getSuspensionPagos() {
        return suspensionPagos;
    }

    public void setSuspensionPagos(Boolean suspensionPagos) {
        this.suspensionPagos = suspensionPagos;
    }

    public Boolean getPdt625() {
        return pdt625;
    }

    public void setPdt625(Boolean pdt625) {
        this.pdt625 = pdt625;
    }

    public String getNumeroResolucion() {
        return numeroResolucion;
    }

    public void setNumeroResolucion(String numeroResolucion) {
        this.numeroResolucion = numeroResolucion;
    }

    public String getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(String fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public BigDecimal getCoeficienteSunat() {
        return coeficienteSunat;
    }

    public void setCoeficienteSunat(BigDecimal coeficienteSunat) {
        this.coeficienteSunat = coeficienteSunat;
    }

    public List<CasillaDTO> getCasillas() {
        return casillas;
    }

    public void setCasillas(List<CasillaDTO> casillas) {
        this.casillas = casillas;
    }
}
