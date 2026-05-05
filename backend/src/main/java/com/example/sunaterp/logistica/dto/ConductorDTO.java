package com.example.sunaterp.logistica.dto;

public class ConductorDTO {
    private String nombre;
    private String tipoDocumentoIdentidad;
    private String numeroDocumento;
    private String numeroLicencia;

    public ConductorDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipoDocumentoIdentidad() { return tipoDocumentoIdentidad; }
    public void setTipoDocumentoIdentidad(String tipoDocumentoIdentidad) { this.tipoDocumentoIdentidad = tipoDocumentoIdentidad; }

    public String getNumeroDocumento() { return numeroDocumento; }
    public void setNumeroDocumento(String numeroDocumento) { this.numeroDocumento = numeroDocumento; }

    public String getNumeroLicencia() { return numeroLicencia; }
    public void setNumeroLicencia(String numeroLicencia) { this.numeroLicencia = numeroLicencia; }
}
