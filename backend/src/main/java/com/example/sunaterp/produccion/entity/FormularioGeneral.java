package com.example.sunaterp.produccion.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formularios_generales")
public class FormularioGeneral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "periodo_tributario")
    private LocalDate periodoTributario;

    @Column(name = "tipo_declaracion")
    private String tipoDeclaracion;

    @Column(name = "condicion_igv")
    private String condicionIgv;

    @Column(name = "ventas_no_gravadas")
    private Boolean ventasNoGravadas;

    @Column(name = "ivap")
    private Boolean ivap;

    @Column(name = "regimen_tributario")
    private String regimenTributario;

    @Column(name = "otros_regimenes")
    private String otrosRegimenes;

    @Column(name = "tipo_cambio", precision = 10, scale = 4)
    private BigDecimal tipoCambio;

    @Column(name = "suspension_pagos")
    private Boolean suspensionPagos;

    @Column(name = "pdt_625")
    private Boolean pdt625;

    @Column(name = "numero_resolucion")
    private String numeroResolucion;

    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;

    @Column(name = "coeficiente_sunat", precision = 10, scale = 4)
    private BigDecimal coeficienteSunat;

    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Casilla> casillas = new ArrayList<>();

    @OneToOne(mappedBy = "formulario", cascade = CascadeType.ALL)
    private PagoNPS pago;

    // Helper method for bidirectional relationship
    public void addCasilla(Casilla casilla) {
        casillas.add(casilla);
        casilla.setFormulario(this);
    }

    public void removeCasilla(Casilla casilla) {
        casillas.remove(casilla);
        casilla.setFormulario(null);
    }

    public PagoNPS getPago() {
        return pago;
    }

    public void setPago(PagoNPS pago) {
        this.pago = pago;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getPeriodoTributario() {
        return periodoTributario;
    }

    public void setPeriodoTributario(LocalDate periodoTributario) {
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

    public LocalDate getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDate fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public BigDecimal getCoeficienteSunat() {
        return coeficienteSunat;
    }

    public void setCoeficienteSunat(BigDecimal coeficienteSunat) {
        this.coeficienteSunat = coeficienteSunat;
    }

    public List<Casilla> getCasillas() {
        return casillas;
    }

    public void setCasillas(List<Casilla> casillas) {
        this.casillas.clear();
        if (casillas != null) {
            for (Casilla c : casillas) {
                this.addCasilla(c);
            }
        }
    }
}
