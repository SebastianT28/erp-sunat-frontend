package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contribuyente", schema = "logistica")
public class Contribuyente {

    @Id
    @Column(name = "ruc", length = 11)
    private String ruc;

    @Column(name = "razonsocial", length = 100, nullable = false)
    private String razonSocial;

    @Column(name = "direccion", length = 150, nullable = false)
    private String direccion;

    @Column(name = "tipocontribuyente", length = 50, nullable = false)
    private String tipoContribuyente;

    public Contribuyente() {}

    public String getRuc() { return ruc; }
    public void setRuc(String ruc) { this.ruc = ruc; }

    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTipoContribuyente() { return tipoContribuyente; }
    public void setTipoContribuyente(String tipoContribuyente) { this.tipoContribuyente = tipoContribuyente; }
}
