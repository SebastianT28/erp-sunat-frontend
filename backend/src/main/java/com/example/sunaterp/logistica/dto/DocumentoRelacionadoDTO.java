package com.example.sunaterp.logistica.dto;

public class DocumentoRelacionadoDTO {
    private String tipo;
    private String serie;
    private String numero;
    private String fecha; // yyyy-MM-dd

    public DocumentoRelacionadoDTO() {}

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}
