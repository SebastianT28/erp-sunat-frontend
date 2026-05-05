package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "punto_traslado", schema = "logistica")
public class PuntoTraslado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idpunto")
    private Integer idPunto;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "iddireccion", nullable = false)
    private Direccion direccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idgre", nullable = false)
    private Gre gre;

    @Column(name = "tipo", length = 20, nullable = false)
    private String tipo;

    @Column(name = "rucasociado", length = 11)
    private String rucAsociado;

    public PuntoTraslado() {}

    public Integer getIdPunto() { return idPunto; }
    public void setIdPunto(Integer idPunto) { this.idPunto = idPunto; }

    public Direccion getDireccion() { return direccion; }
    public void setDireccion(Direccion direccion) { this.direccion = direccion; }

    public Gre getGre() { return gre; }
    public void setGre(Gre gre) { this.gre = gre; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getRucAsociado() { return rucAsociado; }
    public void setRucAsociado(String rucAsociado) { this.rucAsociado = rucAsociado; }
}
