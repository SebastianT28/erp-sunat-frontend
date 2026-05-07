package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehiculo", schema = "logistica")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idvehiculo")
    private Integer idVehiculo;

    @Column(name = "placa", length = 10, nullable = false)
    private String placa;

    @Column(name = "entidademisora", length = 100, nullable = false)
    private String entidadEmisora;

    @Column(name = "numeroautorizacion", length = 50, nullable = false)
    private String numeroAutorizacion;

    public Vehiculo() {}

    public Integer getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(Integer idVehiculo) { this.idVehiculo = idVehiculo; }

    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }

    public String getEntidadEmisora() { return entidadEmisora; }
    public void setEntidadEmisora(String entidadEmisora) { this.entidadEmisora = entidadEmisora; }

    public String getNumeroAutorizacion() { return numeroAutorizacion; }
    public void setNumeroAutorizacion(String numeroAutorizacion) { this.numeroAutorizacion = numeroAutorizacion; }
}
