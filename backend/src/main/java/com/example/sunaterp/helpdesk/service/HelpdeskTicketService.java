package com.example.sunaterp.helpdesk.service;

import com.example.sunaterp.helpdesk.dto.AuthTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.PublicTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.TicketResponseDTO;
import com.example.sunaterp.helpdesk.entity.HelpdeskTicket;
import com.example.sunaterp.helpdesk.repository.HelpdeskTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import com.example.sunaterp.config.EmailService;

@Service
public class HelpdeskTicketService {

    @Autowired
    private HelpdeskTicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    public TicketResponseDTO crearTicketPublico(PublicTicketRequestDTO dto) {
        HelpdeskTicket ticket = new HelpdeskTicket();
        ticket.setUsernameAfectado(dto.getUsernameAfectado());
        ticket.setCorreoContacto(dto.getCorreoContacto());
        ticket.setDescripcion(dto.getDescripcion());
        ticket.setAreaAsignada("ATENCION_CLIENTE");
        
        return guardarYGenerarRespuesta(ticket);
    }

    public TicketResponseDTO crearTicketAutenticado(AuthTicketRequestDTO dto, Integer idUsuario) {
        HelpdeskTicket ticket = new HelpdeskTicket();
        ticket.setIdUsuarioLogueado(idUsuario);
        ticket.setUsernameAfectado(dto.getUsernameAfectado());
        ticket.setCorreoContacto(dto.getCorreoContacto());
        ticket.setDescripcion(dto.getDescripcion());
        
        return guardarYGenerarRespuesta(ticket);
    }
    
    public TicketResponseDTO consultarTicket(String numeroTicket) {
        return ticketRepository.findByNumeroTicket(numeroTicket)
                .map(t -> new TicketResponseDTO(t.getNumeroTicket(), t.getEstado(), t.getAreaAsignada(), t.getDescripcion()))
                .orElse(null);
    }

    public List<HelpdeskTicket> obtenerTodosLosTickets() {
        return ticketRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "fechaCreacion"));
    }

    public HelpdeskTicket actualizarEstadoTicket(String numeroTicket, String nuevoEstado, String respuesta) {
        return ticketRepository.findByNumeroTicket(numeroTicket).map(ticket -> {
            boolean notificar = false;
            
            if (nuevoEstado != null && !nuevoEstado.trim().isEmpty()) {
                ticket.setEstado(nuevoEstado);
            }
            if (respuesta != null && !respuesta.trim().isEmpty() && !respuesta.equals(ticket.getRespuestaAdministrador())) {
                ticket.setRespuestaAdministrador(respuesta);
                notificar = true;
            }
            
            HelpdeskTicket guardado = ticketRepository.save(ticket);
            
            if (notificar && ticket.getCorreoContacto() != null && !ticket.getCorreoContacto().isEmpty()) {
                String destinatario = ticket.getCorreoContacto();
                String asunto = "Respuesta a tu Ticket " + numeroTicket + " - ERP SUNAT";
                String contenido = "Hola,\\n\\n" +
                        "Tu ticket " + numeroTicket + " ha sido actualizado por nuestro equipo.\\n\\n" +
                        "Respuesta del administrador:\\n" + respuesta + "\\n\\n" +
                        "Estado actual: " + ticket.getEstado() + "\\n\\n" +
                        "Atentamente,\\nEquipo de Soporte ERP SUNAT";
                
                CompletableFuture.runAsync(() -> {
                    try {
                        emailService.enviarCorreo(destinatario, asunto, contenido);
                    } catch (Exception e) {
                        System.err.println("No se pudo enviar correo al ticket " + numeroTicket + ": " + e.getMessage());
                    }
                });
            }
            
            return guardado;
        }).orElse(null);
    }

    private TicketResponseDTO guardarYGenerarRespuesta(HelpdeskTicket ticket) {
        // Generar número de ticket
        ticket.setNumeroTicket(generarNumeroTicketUnico());
        
        // Asignar área automáticamente basada en palabras clave
        if (ticket.getAreaAsignada() == null) {
            ticket.setAreaAsignada(determinarArea(ticket.getDescripcion()));
        }
        
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
        } else if (descLower.matches(".*\\bgre\\b.*") || descLower.contains("guía") || descLower.contains("remisión")) {
            return "LOGISTICA";
        }
        
        return "ATENCION_CLIENTE";
    }
}
