package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "documento_relacionado", schema = "logistica")
public class DocumentoRelacionado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddocumento")
    private Integer idDocumento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idgre", nullable = false)
    private Gre gre;

    @Column(name = "tipo", length = 50, nullable = false)
    private String tipo;

    @Column(name = "serie", length = 20, nullable = false)
    private String serie;

    @Column(name = "numero", length = 20, nullable = false)
    private String numero;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    public DocumentoRelacionado() {}

    public Integer getIdDocumento() { return idDocumento; }
    public void setIdDocumento(Integer idDocumento) { this.idDocumento = idDocumento; }

    public Gre getGre() { return gre; }
    public void setGre(Gre gre) { this.gre = gre; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
