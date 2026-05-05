package com.example.sunaterp.logistica.dto;

public class DestinatarioDTO {
    private String tipoDocumentoIdentidad;
    private String numeroDocumento;
    private String nombre;

    public DestinatarioDTO() {}

    public String getTipoDocumentoIdentidad() { return tipoDocumentoIdentidad; }
    public void setTipoDocumentoIdentidad(String tipoDocumentoIdentidad) { this.tipoDocumentoIdentidad = tipoDocumentoIdentidad; }

    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
