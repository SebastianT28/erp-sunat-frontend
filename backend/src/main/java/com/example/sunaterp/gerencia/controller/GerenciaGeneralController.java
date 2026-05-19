package com.example.sunaterp.gerencia.controller;

import com.example.sunaterp.gerencia.dto.*;
import com.example.sunaterp.gerencia.service.GerenciaGeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gerencia")
public class GerenciaGeneralController {

    @Autowired
    private GerenciaGeneralService gerenciaService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(gerenciaService.getDashboard());
    }

    // USUARIOS
    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioGerenciaDTO>> getUsuarios() {
        return ResponseEntity.ok(gerenciaService.getUsuarios());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioGerenciaDTO> createUsuario(@RequestBody UsuarioCreateDTO dto) {
        return ResponseEntity.ok(gerenciaService.createUsuario(dto));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioGerenciaDTO> updateUsuario(@PathVariable Integer id,
            @RequestBody UsuarioCreateDTO dto) {
        UsuarioGerenciaDTO updated = gerenciaService.updateUsuario(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        gerenciaService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    // GRES
    @GetMapping("/gres")
    public ResponseEntity<List<GreGerenciaDTO>> getGres() {
        return ResponseEntity.ok(gerenciaService.getGres());
    }

    @PutMapping("/gres/{id}")
    public ResponseEntity<GreGerenciaDTO> updateGre(@PathVariable Integer id, @RequestBody GreGerenciaDTO dto) {
        GreGerenciaDTO updated = gerenciaService.updateGre(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/gres/{id}")
    public ResponseEntity<Void> deleteGre(@PathVariable Integer id) {
        gerenciaService.deleteGre(id);
        return ResponseEntity.noContent().build();
    }

    // DECLARACIONES
    @GetMapping("/declaraciones")
    public ResponseEntity<List<DeclaracionGerenciaDTO>> getDeclaraciones() {
        return ResponseEntity.ok(gerenciaService.getDeclaraciones());
    }

    @DeleteMapping("/declaraciones/{id}")
    public ResponseEntity<Void> deleteDeclaracion(@PathVariable Long id) {
        gerenciaService.deleteDeclaracion(id);
        return ResponseEntity.noContent().build();
    }
}
