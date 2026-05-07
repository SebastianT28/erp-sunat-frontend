package com.example.sunaterp.produccion.controller;

import com.example.sunaterp.produccion.dto.FormularioDTO;
import com.example.sunaterp.produccion.entity.FormularioGeneral;
import com.example.sunaterp.produccion.service.FormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produccion/formularios")
public class FormularioController {

    @Autowired
    private FormularioService formularioService;

    @PostMapping
    public ResponseEntity<?> guardarFormulario(@RequestBody FormularioDTO formularioDTO) {
        try {
            FormularioGeneral guardado = formularioService.guardarFormulario(formularioDTO);
            return new ResponseEntity<>(guardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar el formulario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
