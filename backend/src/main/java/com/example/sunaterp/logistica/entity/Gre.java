package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gre", schema = "logistica")
public class Gre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idgre")
    private Integer idGre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idusuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "idtransporte", nullable = false)
    private Transporte transporte;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "iddestinatario", nullable = false)
    private Destinatario destinatario;

    @Column(name = "tipoguia", length = 50, nullable = false)
    private String tipoGuia;

    @Column(name = "fechaemision", nullable = false)
    private LocalDate fechaEmision;

    @Column(name = "motivotraslado", length = 100, nullable = false)
    private String motivoTraslado;

    @Column(name = "estado", length = 50, nullable = false)
    private String estado;

    @OneToMany(mappedBy = "gre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleGre> detalles = new ArrayList<>();

    @OneToMany(mappedBy = "gre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentoRelacionado> documentosRelacionados = new ArrayList<>();

    @OneToMany(mappedBy = "gre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PuntoTraslado> puntosTraslado = new ArrayList<>();

    public Gre() {}

    // Helper methods
    public void addDetalle(DetalleGre detalle) {
        detalles.add(detalle);
        detalle.setGre(this);
    }

    public void addDocumentoRelacionado(DocumentoRelacionado doc) {
        documentosRelacionados.add(doc);
        doc.setGre(this);
    }

    public void addPuntoTraslado(PuntoTraslado punto) {
        puntosTraslado.add(punto);
        punto.setGre(this);
    }

    public Integer getIdGre() { return idGre; }
    public void setIdGre(Integer idGre) { this.idGre = idGre; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Transporte getTransporte() { return transporte; }
    public void setTransporte(Transporte transporte) { this.transporte = transporte; }

    public Destinatario getDestinatario() { return destinatario; }
    public void setDestinatario(Destinatario destinatario) { this.destinatario = destinatario; }

    public String getTipoGuia() { return tipoGuia; }
    public void setTipoGuia(String tipoGuia) { this.tipoGuia = tipoGuia; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public String getMotivoTraslado() { return motivoTraslado; }
    public void setMotivoTraslado(String motivoTraslado) { this.motivoTraslado = motivoTraslado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<DetalleGre> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleGre> detalles) { this.detalles = detalles; }

    public List<DocumentoRelacionado> getDocumentosRelacionados() { return documentosRelacionados; }
    public void setDocumentosRelacionados(List<DocumentoRelacionado> documentosRelacionados) { this.documentosRelacionados = documentosRelacionados; }

    public List<PuntoTraslado> getPuntosTraslado() { return puntosTraslado; }
    public void setPuntosTraslado(List<PuntoTraslado> puntosTraslado) { this.puntosTraslado = puntosTraslado; }
}
