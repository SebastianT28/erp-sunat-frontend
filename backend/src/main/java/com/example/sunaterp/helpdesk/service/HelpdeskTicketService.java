package com.example.sunaterp.helpdesk.service;

import com.example.sunaterp.helpdesk.dto.AuthTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.PublicTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.TicketResponseDTO;
import com.example.sunaterp.helpdesk.entity.HelpdeskTicket;
import com.example.sunaterp.helpdesk.repository.HelpdeskTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class HelpdeskTicketService {

    @Autowired
    private HelpdeskTicketRepository ticketRepository;

    public TicketResponseDTO crearTicketPublico(PublicTicketRequestDTO dto) {
        HelpdeskTicket ticket = new HelpdeskTicket();
        ticket.setUsernameAfectado(dto.getUsernameAfectado());
        ticket.setCorreoContacto(dto.getCorreoContacto());
        ticket.setDescripcion(dto.getDescripcion());
        
        return guardarYGenerarRespuesta(ticket);
    }

    public TicketResponseDTO crearTicketAutenticado(AuthTicketRequestDTO dto, Integer idUsuario) {
        HelpdeskTicket ticket = new HelpdeskTicket();
        ticket.setIdUsuarioLogueado(idUsuario);
        ticket.setDescripcion(dto.getDescripcion());
        
        return guardarYGenerarRespuesta(ticket);
    }
    
    public TicketResponseDTO consultarTicket(String numeroTicket) {
        return ticketRepository.findByNumeroTicket(numeroTicket)
                .map(t -> new TicketResponseDTO(t.getNumeroTicket(), t.getEstado(), t.getAreaAsignada(), t.getDescripcion()))
                .orElse(null);
    }

    private TicketResponseDTO guardarYGenerarRespuesta(HelpdeskTicket ticket) {
        // Generar número de ticket
        ticket.setNumeroTicket(generarNumeroTicketUnico());
        
        // Asignar área automáticamente basada en palabras clave
        ticket.setAreaAsignada(determinarArea(ticket.getDescripcion()));
        
        ticket = ticketRepository.save(ticket);
        
        return new TicketResponseDTO(
                ticket.getNumeroTicket(),
                ticket.getEstado(),
                ticket.getAreaAsignada(),
                ticket.getDescripcion()
        );
    }

    private String generarNumeroTicketUnico() {
        Random random = new Random();
        String numero;
        do {
            numero = "TK-" + (1000 + random.nextInt(9000));
        } while (ticketRepository.findByNumeroTicket(numero).isPresent());
        return numero;
    }

    private String determinarArea(String descripcion) {
        if (descripcion == null) return "SOPORTE_TECNICO";
        
        String descLower = descripcion.toLowerCase();
        if (descLower.contains("login") || descLower.contains("contraseña") || descLower.contains("acceso")) {
            return "SOPORTE_TECNICO";
        } else if (descLower.contains("impuesto") || descLower.contains("declarar") || descLower.contains("pago")) {
            return "OPERACIONES";
        } else if (descLower.contains("gre") || descLower.contains("guía") || descLower.contains("remisión")) {
            return "LOGISTICA";
        }
        
        return "ATENCION_CLIENTE";
    }
}
