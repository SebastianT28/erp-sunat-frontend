package com.example.sunaterp.gerencia.dto;

public class DeclaracionGerenciaDTO {
    private Long id;
    private String periodo;
    private String formulario;
    private String emisor;
    private String fecha;

    public DeclaracionGerenciaDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }

    public String getFormulario() { return formulario; }
    public void setFormulario(String formulario) { this.formulario = formulario; }

    public String getEmisor() { return emisor; }
    public void setEmisor(String emisor) { this.emisor = emisor; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}
