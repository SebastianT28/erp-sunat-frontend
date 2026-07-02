package com.example.sunatErp;

import com.example.sunaterp.gerencia.dto.DashboardReportesDataDTO;
import com.example.sunaterp.gerencia.service.GerenciaReportesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class GerenciaReportesTest {

    @Autowired
    private GerenciaReportesService gerenciaReportesService;

    @Test
    public void testGetDashboardReportesData() {
        DashboardReportesDataDTO data = gerenciaReportesService.getDashboardReportesData();
        assertNotNull(data);
        System.out.println("=== RESULTADO DE PRUEBA DE REPORTES ===");
        System.out.println("Total Usuarios: " + data.getTotalContribuyentes());
        System.out.println("Total GREs: " + data.getTotalGres());
        System.out.println("Total Declaraciones: " + data.getTotalDeclaraciones());
        if (data.getGres() != null && !data.getGres().isEmpty()) {
            System.out.println("Primera GRE Fecha Emision: " + data.getGres().get(0).getFechaEmision());
        }
        if (data.getDeclaraciones() != null && !data.getDeclaraciones().isEmpty()) {
            System.out.println("Primera Declaracion Fecha: " + data.getDeclaraciones().get(0).getFecha());
        }
        System.out.println("=======================================");
    }
}
