package com.example.sunaterp.logistica.dto;

public class TransporteDTO {
    private String tipoTransporte; // "Privado" o "Publico"
    private String fechaInicioTraslado; // yyyy-MM-dd
    private VehiculoDTO vehiculo;
    private ConductorDTO conductor;

    public TransporteDTO() {}

    public String getTipoTransporte() { return tipoTransporte; }
    public void setTipoTransporte(String tipoTransporte) { this.tipoTransporte = tipoTransporte; }

    public String getFechaInicioTraslado() { return fechaInicioTraslado; }
    public void setFechaInicioTraslado(String fechaInicioTraslado) { this.fechaInicioTraslado = fechaInicioTraslado; }

    public VehiculoDTO getVehiculo() { return vehiculo; }
    public void setVehiculo(VehiculoDTO vehiculo) { this.vehiculo = vehiculo; }

    public ConductorDTO getConductor() { return conductor; }
    public void setConductor(ConductorDTO conductor) { this.conductor = conductor; }
}
