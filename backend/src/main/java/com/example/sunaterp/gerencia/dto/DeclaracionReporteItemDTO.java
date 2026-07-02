package com.example.sunaterp.gerencia.dto;

public class DeclaracionReporteItemDTO {
    private Long id;
    private String periodo;
    private String formulario;
    private String emisor;
    private String razonSocialEmisor;
    private String fecha;
    private String condicionIgv;
    private String regimenTributario;

    public DeclaracionReporteItemDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }

    public String getFormulario() { return formulario; }
    public void setFormulario(String formulario) { this.formulario = formulario; }

    public String getEmisor() { return emisor; }
    public void setEmisor(String emisor) { this.emisor = emisor; }

    public String getRazonSocialEmisor() { return razonSocialEmisor; }
    public void setRazonSocialEmisor(String razonSocialEmisor) { this.razonSocialEmisor = razonSocialEmisor; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getCondicionIgv() { return condicionIgv; }
    public void setCondicionIgv(String condicionIgv) { this.condicionIgv = condicionIgv; }

    public String getRegimenTributario() { return regimenTributario; }
    public void setRegimenTributario(String regimenTributario) { this.regimenTributario = regimenTributario; }
}
