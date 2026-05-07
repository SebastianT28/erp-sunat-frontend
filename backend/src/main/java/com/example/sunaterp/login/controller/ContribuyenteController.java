package com.example.sunaterp.login.controller;

import com.example.sunaterp.login.entity.Contribuyente;
import com.example.sunaterp.login.repository.ContribuyenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login/contribuyentes")
public class ContribuyenteController {

    @Autowired
    private ContribuyenteRepository contribuyenteRepository;

    @GetMapping
    public ResponseEntity<List<Contribuyente>> getAllContribuyentes() {
        return ResponseEntity.ok(contribuyenteRepository.findAll());
    }

    @GetMapping("/{ruc}")
    public ResponseEntity<Contribuyente> getContribuyenteByRuc(@PathVariable String ruc) {
        return contribuyenteRepository.findById(ruc)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
