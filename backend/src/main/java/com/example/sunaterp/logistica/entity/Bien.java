package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bien", schema = "logistica")
public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbien")
    private Integer idBien;

    @Column(name = "codigobien", length = 50, nullable = false)
    private String codigoBien;

    @Column(name = "descripcion", length = 150, nullable = false)
    private String descripcion;

    @Column(name = "unidadmedida", length = 20, nullable = false)
    private String unidadMedida;

    @Column(name = "peso", precision = 10, scale = 2)
    private BigDecimal peso;

    public Bien() {}

    public Integer getIdBien() { return idBien; }
    public void setIdBien(Integer idBien) { this.idBien = idBien; }

    public String getCodigoBien() { return codigoBien; }
    public void setCodigoBien(String codigoBien) { this.codigoBien = codigoBien; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }
}
