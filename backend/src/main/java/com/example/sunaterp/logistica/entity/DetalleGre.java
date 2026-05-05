package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detallegre", schema = "logistica")
public class DetalleGre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddetalle")
    private Integer idDetalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idgre", nullable = false)
    private Gre gre;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "idbien", nullable = false)
    private Bien bien;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    public DetalleGre() {}

    public Integer getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Integer idDetalle) { this.idDetalle = idDetalle; }

    public Gre getGre() { return gre; }
    public void setGre(Gre gre) { this.gre = gre; }

    public Bien getBien() { return bien; }
    public void setBien(Bien bien) { this.bien = bien; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
