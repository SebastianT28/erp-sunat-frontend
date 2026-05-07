package com.example.sunaterp.login.controller;

import com.example.sunaterp.login.dto.LoginRequestDTO;
import com.example.sunaterp.login.dto.UsuarioDTO;
import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/login/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/auth")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDTO loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(loginRequest.getNombreUsuario());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (!usuario.getContrasena().equals(loginRequest.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        if ("contribuyente".equalsIgnoreCase(usuario.getRol())) {
            if (loginRequest.getRuc() == null || loginRequest.getRuc().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("RUC es requerido para contribuyentes");
            }
            if (usuario.getContribuyente() == null
                    || !usuario.getContribuyente().getRuc().equals(loginRequest.getRuc())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("RUC incorrecto o no asociado al usuario");
            }
        }

        UsuarioDTO responseDTO = new UsuarioDTO();
        responseDTO.setIdUsuario(usuario.getIdUsuario());
        responseDTO.setNombreUsuario(usuario.getNombreUsuario());
        responseDTO.setCorreo(usuario.getCorreo());
        responseDTO.setRol(usuario.getRol());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
