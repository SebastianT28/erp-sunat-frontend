package com.example.sunaterp.marketing.controller;

import com.example.sunaterp.marketing.dto.InscripcionRucDTO;
import com.example.sunaterp.marketing.entity.InscripcionRuc;
import com.example.sunaterp.marketing.service.InscripcionRucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/marketing")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InscripcionRucController {

    @Autowired
    private InscripcionRucService inscripcionRucService;

    @PostMapping("/inscripcion/guardar")
    public ResponseEntity<InscripcionRuc> guardarInscripcion(@RequestBody InscripcionRucDTO dto) {
        try {
            InscripcionRuc nuevaInscripcion = inscripcionRucService.guardarInscripcion(dto);
            return ResponseEntity.ok(nuevaInscripcion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
