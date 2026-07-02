package com.example.sunaterp.gerencia.controller;

import com.example.sunaterp.gerencia.dto.DashboardReportesDataDTO;
import com.example.sunaterp.gerencia.service.GerenciaReportesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gerencia/reportes")
public class GerenciaReportesController {

    @Autowired
    private GerenciaReportesService gerenciaReportesService;

    @GetMapping("/data")
    public ResponseEntity<DashboardReportesDataDTO> getReportesData() {
        return ResponseEntity.ok(gerenciaReportesService.getDashboardReportesData());
    }
}
