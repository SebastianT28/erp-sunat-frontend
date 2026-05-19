package com.example.sunaterp.gerencia.dto;

public class DashboardDTO {
    private long totalContribuyentes;
    private long totalGres;
    private long totalDeclaraciones;

    public DashboardDTO() {
    }

    public DashboardDTO(long totalContribuyentes, long totalGres, long totalDeclaraciones) {
        this.totalContribuyentes = totalContribuyentes;
        this.totalGres = totalGres;
        this.totalDeclaraciones = totalDeclaraciones;
    }

    public long getTotalContribuyentes() {
        return totalContribuyentes;
    }

    public void setTotalContribuyentes(long totalContribuyentes) {
        this.totalContribuyentes = totalContribuyentes;
    }

    public long getTotalGres() {
        return totalGres;
    }

    public void setTotalGres(long totalGres) {
        this.totalGres = totalGres;
    }

    public long getTotalDeclaraciones() {
        return totalDeclaraciones;
    }

    public void setTotalDeclaraciones(long totalDeclaraciones) {
        this.totalDeclaraciones = totalDeclaraciones;
    }
}
