package com.example.sunaterp.gerencia.dto;

public class GreGerenciaDTO {
    private Integer id;
    private String serie;
    private String numero;
    private String emisor;
    private String estado;
    private String reclamo;

    public GreGerenciaDTO() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSerie() { return serie; }
    public void setSerie(String serie) { this.serie = serie; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getEmisor() { return emisor; }
    public void setEmisor(String emisor) { this.emisor = emisor; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getReclamo() { return reclamo; }
    public void setReclamo(String reclamo) { this.reclamo = reclamo; }
}
