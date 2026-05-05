package com.example.sunaterp.produccion.dto;

import java.math.BigDecimal;

public class CasillaDTO {
    private String numeroCasilla;
    private BigDecimal valor;

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
}
