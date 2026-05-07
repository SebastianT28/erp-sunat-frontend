package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "destinatario", schema = "logistica")
public class Destinatario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddestinatario")
    private Integer idDestinatario;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "tipodocumentoidentidad", length = 20, nullable = false)
    private String tipoDocumentoIdentidad;

    @Column(name = "numerodocumento", length = 20, nullable = false)
    private String numeroDocumento;

    public Destinatario() {}

    public Integer getIdDestinatario() { return idDestinatario; }
    public void setIdDestinatario(Integer idDestinatario) { this.idDestinatario = idDestinatario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipoDocumentoIdentidad() { return tipoDocumentoIdentidad; }
    public void setTipoDocumentoIdentidad(String tipoDocumentoIdentidad) { this.tipoDocumentoIdentidad = tipoDocumentoIdentidad; }

    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }
}
