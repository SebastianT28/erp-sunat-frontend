package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "direccion", schema = "logistica")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iddireccion")
    private Integer idDireccion;

    @Column(name = "departamento", length = 50, nullable = false)
    private String departamento;

    @Column(name = "provincia", length = 50, nullable = false)
    private String provincia;

    @Column(name = "distrito", length = 50, nullable = false)
    private String distrito;

    @Column(name = "direcciondetallada", length = 150, nullable = false)
    private String direccionDetallada;

    public Direccion() {}

    public Integer getIdDireccion() { return idDireccion; }
    public void setIdDireccion(Integer idDireccion) { this.idDireccion = idDireccion; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }

    public String getDireccionDetallada() { return direccionDetallada; }
    public void setDireccionDetallada(String direccionDetallada) { this.direccionDetallada = direccionDetallada; }
}
