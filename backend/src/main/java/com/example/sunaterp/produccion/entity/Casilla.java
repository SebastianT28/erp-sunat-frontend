package com.example.sunaterp.produccion.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "casillas")
public class Casilla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_casilla", nullable = false)
    private String numeroCasilla;

    @Column(name = "valor", precision = 15, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id")
    @JsonIgnore
    private FormularioGeneral formulario;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCasilla() {
        return numeroCasilla;
    }

    public void setNumeroCasilla(String numeroCasilla) {
        this.numeroCasilla = numeroCasilla;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public FormularioGeneral getFormulario() {
        return formulario;
    }

    public void setFormulario(FormularioGeneral formulario) {
        this.formulario = formulario;
    }
}
