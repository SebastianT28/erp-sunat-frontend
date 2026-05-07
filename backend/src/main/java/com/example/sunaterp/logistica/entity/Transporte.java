package com.example.sunaterp.logistica.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transporte", schema = "logistica")
public class Transporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idtransporte")
    private Integer idTransporte;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "idvehiculo", nullable = false)
    private Vehiculo vehiculo;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "idconductor", nullable = false)
    private Conductor conductor;

    @Column(name = "tipotransporte", length = 50, nullable = false)
    private String tipoTransporte;

    @Column(name = "fechainiciotraslado", nullable = false)
    private LocalDate fechaInicioTraslado;

    public Transporte() {}

    public Integer getIdTransporte() { return idTransporte; }
    public void setIdTransporte(Integer idTransporte) { this.idTransporte = idTransporte; }

    public Vehiculo getVehiculo() { return vehiculo; }
    public void setVehiculo(Vehiculo vehiculo) { this.vehiculo = vehiculo; }

    public Conductor getConductor() { return conductor; }
    public void setConductor(Conductor conductor) { this.conductor = conductor; }

    public String getTipoTransporte() { return tipoTransporte; }
    public void setTipoTransporte(String tipoTransporte) { this.tipoTransporte = tipoTransporte; }

    public LocalDate getFechaInicioTraslado() { return fechaInicioTraslado; }
    public void setFechaInicioTraslado(LocalDate fechaInicioTraslado) { this.fechaInicioTraslado = fechaInicioTraslado; }
}
