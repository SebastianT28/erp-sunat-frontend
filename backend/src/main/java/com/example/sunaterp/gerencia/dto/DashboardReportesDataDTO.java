package com.example.sunaterp.gerencia.dto;

import java.util.List;

public class DashboardReportesDataDTO {
    private long totalContribuyentes;
    private long totalGres;
    private long totalDeclaraciones;
    private List<GreReporteItemDTO> gres;
    private List<DeclaracionReporteItemDTO> declaraciones;
    private List<ContribuyenteReporteItemDTO> contribuyentes;

    public DashboardReportesDataDTO() {}

    public long getTotalContribuyentes() { return totalContribuyentes; }
    public void setTotalContribuyentes(long totalContribuyentes) { this.totalContribuyentes = totalContribuyentes; }

    public long getTotalGres() { return totalGres; }
    public void setTotalGres(long totalGres) { this.totalGres = totalGres; }

    public long getTotalDeclaraciones() { return totalDeclaraciones; }
    public void setTotalDeclaraciones(long totalDeclaraciones) { this.totalDeclaraciones = totalDeclaraciones; }

    public List<GreReporteItemDTO> getGres() { return gres; }
    public void setGres(List<GreReporteItemDTO> gres) { this.gres = gres; }

    public List<DeclaracionReporteItemDTO> getDeclaraciones() { return declaraciones; }
    public void setDeclaraciones(List<DeclaracionReporteItemDTO> declaraciones) { this.declaraciones = declaraciones; }

    public List<ContribuyenteReporteItemDTO> getContribuyentes() { return contribuyentes; }
    public void setContribuyentes(List<ContribuyenteReporteItemDTO> contribuyentes) { this.contribuyentes = contribuyentes; }
}
