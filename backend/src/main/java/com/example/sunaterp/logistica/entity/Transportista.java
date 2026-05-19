package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transportista", schema = "logistica")
public class Transportista {

    @Id
    @Column(name = "ruc")
    private Long ruc;

    @Column(name = "razonsocial", length = 255, nullable = false)
    private String razonSocial;

    @Column(name = "numregistromtc", length = 100)
    private String numRegistroMTC;

    @Column(name = "frecuente")
    private Boolean frecuente = false;

    @Column(name = "fechatraslado")
    private LocalDate fechaTraslado;

    /**
     * Relación ManyToOne: múltiples transportistas pueden referenciar al mismo conductor.
     * Se usa ManyToOne en lugar de OneToOne porque la tabla conductor es independiente
     * y puede ser reutilizada por distintos registros.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idconductor")
    private Conductor conductor;

    /**
     * Relación ManyToOne: múltiples transportistas pueden referenciar al mismo vehículo.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idvehiculo")
    private Vehiculo vehiculo;

    public Transportista() {}

    public Long getRuc() { return ruc; }
    public void setRuc(Long ruc) { this.ruc = ruc; }

    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getNumRegistroMTC() { return numRegistroMTC; }
    public void setNumRegistroMTC(String numRegistroMTC) { this.numRegistroMTC = numRegistroMTC; }

    public Boolean getFrecuente() { return frecuente; }
    public void setFrecuente(Boolean frecuente) { this.frecuente = frecuente; }

    public LocalDate getFechaTraslado() { return fechaTraslado; }
    public void setFechaTraslado(LocalDate fechaTraslado) { this.fechaTraslado = fechaTraslado; }

    public Conductor getConductor() { return conductor; }
    public void setConductor(Conductor conductor) { this.conductor = conductor; }

    public Vehiculo getVehiculo() { return vehiculo; }
    public void setVehiculo(Vehiculo vehiculo) { this.vehiculo = vehiculo; }
}
