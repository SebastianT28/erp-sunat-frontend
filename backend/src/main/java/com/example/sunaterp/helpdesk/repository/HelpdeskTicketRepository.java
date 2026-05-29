package com.example.sunaterp.helpdesk.repository;

import com.example.sunaterp.helpdesk.entity.HelpdeskTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HelpdeskTicketRepository extends JpaRepository<HelpdeskTicket, Integer> {
    Optional<HelpdeskTicket> findByNumeroTicket(String numeroTicket);
}
