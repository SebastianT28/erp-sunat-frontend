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
                String asunto = "Actualización de tu Ticket " + numeroTicket + " - ERP SUNAT";
                
                String colorEstado = ticket.getEstado().equalsIgnoreCase("RESUELTO") ? "#10B981" : "#F59E0B";
                
                String contenidoHtml = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);\">" +
                        "<div style=\"background-color: #0063AE; color: white; padding: 25px; text-align: center;\">" +
                        "<h2 style=\"margin: 0; font-size: 22px;\">ERP SUNAT - Soporte y Ayuda</h2>" +
                        "</div>" +
                        "<div style=\"padding: 30px; background-color: #ffffff;\">" +
                        "<h3 style=\"color: #1f2937; margin-top: 0;\">¡Hola!</h3>" +
                        "<p style=\"color: #4b5563; line-height: 1.6; font-size: 15px;\">Tu ticket <strong>" + numeroTicket + "</strong> acaba de ser revisado y actualizado por un agente de nuestro equipo.</p>" +
                        "<div style=\"background-color: #f8fafc; border-left: 4px solid #0063AE; padding: 18px; margin: 25px 0; border-radius: 0 4px 4px 0;\">" +
                        "<p style=\"margin: 0 0 10px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; font-weight: bold;\">Respuesta del Administrador:</p>" +
                        "<p style=\"margin: 0; color: #334155; line-height: 1.5; font-size: 15px;\">" + respuesta.replace("\n", "<br>") + "</p>" +
                        "</div>" +
                        "<p style=\"margin: 0; color: #4b5563; font-size: 15px;\">Estado del ticket: <span style=\"background-color: " + colorEstado + "; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-left: 5px; display: inline-block;\">" + ticket.getEstado().replace("_", " ") + "</span></p>" +
                        "</div>" +
                        "<div style=\"background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;\">" +
                        "<p style=\"margin: 0;\">Atentamente,<br><strong style=\"color: #475569; margin-top: 4px; display: inline-block;\">Equipo de Soporte ERP SUNAT</strong></p>" +
                        "</div>" +
                        "</div>";
                
                CompletableFuture.runAsync(() -> {
                    try {
                        emailService.enviarCorreoHtml(destinatario, asunto, contenidoHtml);
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
