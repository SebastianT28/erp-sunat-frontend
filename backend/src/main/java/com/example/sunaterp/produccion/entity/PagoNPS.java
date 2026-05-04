package com.example.sunaterp.produccion.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pagos_nps")
public class PagoNPS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_nps", length = 12, nullable = false)
    private String numeroNps;

    @Column(name = "numero_orden", length = 9, nullable = false, unique = true)
    private String numeroOrden;

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPago estado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id")
    @JsonIgnore
    private FormularioGeneral formulario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroNps() {
        return numeroNps;
    }

    public void setNumeroNps(String numeroNps) {
        this.numeroNps = numeroNps;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public Double getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(Double montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public EstadoPago getEstado() {
        return estado;
    }

    public void setEstado(EstadoPago estado) {
        this.estado = estado;
    }

    public FormularioGeneral getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioGeneral formulario) {
        this.formulario = formulario;
    }
}
