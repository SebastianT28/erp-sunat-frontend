package com.example.sunaterp.helpdesk.controller;

import com.example.sunaterp.helpdesk.dto.AuthTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.PublicTicketRequestDTO;
import com.example.sunaterp.helpdesk.dto.TicketResponseDTO;
import com.example.sunaterp.helpdesk.service.HelpdeskTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/helpdesk/tickets")
public class HelpdeskTicketController {

    @Autowired
    private HelpdeskTicketService ticketService;

    // Endpoint público para usuarios que no pueden iniciar sesión
    @PostMapping("/public")
    public ResponseEntity<TicketResponseDTO> createPublicTicket(@RequestBody PublicTicketRequestDTO request) {
        TicketResponseDTO response = ticketService.crearTicketPublico(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Endpoint protegido para usuarios logueados
    @PostMapping("/auth")
    public ResponseEntity<TicketResponseDTO> createAuthTicket(@RequestBody AuthTicketRequestDTO request) {
        // Obtener el usuario autenticado del contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer idUsuario = request.getIdUsuario();
        
        TicketResponseDTO response = ticketService.crearTicketAutenticado(request, idUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Consulta de estado de ticket
    @GetMapping("/status/{numeroTicket}")
    public ResponseEntity<TicketResponseDTO> getTicketStatus(@PathVariable String numeroTicket) {
        TicketResponseDTO response = ticketService.consultarTicket(numeroTicket);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
