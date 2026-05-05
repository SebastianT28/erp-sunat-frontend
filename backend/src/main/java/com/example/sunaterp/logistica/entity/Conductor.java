package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "conductor", schema = "logistica")
public class Conductor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idconductor")
    private Integer idConductor;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "numerodocumento", length = 20, nullable = false)
    private String numeroDocumento;

    @Column(name = "tipodocumentoidentidad", length = 20, nullable = false)
    private String tipoDocumentoIdentidad;

    @Column(name = "numerolicencia", length = 20, nullable = false)
    private String numeroLicencia;

    public Conductor() {}

    public Integer getIdConductor() { return idConductor; }
    public void setIdConductor(Integer idConductor) { this.idConductor = idConductor; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }

    public String getTipoDocumentoIdentidad() { return tipoDocumentoIdentidad; }
    public void setTipoDocumentoIdentidad(String tipoDocumentoIdentidad) { this.tipoDocumentoIdentidad = tipoDocumentoIdentidad; }

    public String getNumeroLicencia() { return numeroLicencia; }
    public void setNumeroLicencia(String numeroLicencia) { this.numeroLicencia = numeroLicencia; }
}
