package com.example.sunaterp.logistica.service;

import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.logistica.dto.ReclamoDTO;
import com.example.sunaterp.logistica.entity.Gre;
import com.example.sunaterp.logistica.entity.Notificacion;
import com.example.sunaterp.logistica.repository.GreRepository;
import com.example.sunaterp.logistica.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private GreRepository greRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Notificacion crearReclamo(ReclamoDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Gre gre = greRepository.findById(dto.getIdGre())
                .orElseThrow(() -> new RuntimeException("GRE no encontrada"));

        Notificacion n = new Notificacion();
        n.setUsuario(usuario);
        n.setGre(gre);
        n.setTitulo("No Conformidad GRE " + gre.getSerie() + "-" + gre.getNumero());
        n.setMensaje(dto.getMotivo());
        n.setTipo("Reclamo");
        n.setEstado("Pendiente");
        n.setFecha(LocalDateTime.now());

        return notificacionRepository.save(n);
    }
}
