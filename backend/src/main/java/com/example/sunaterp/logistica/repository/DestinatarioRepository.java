package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Destinatario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DestinatarioRepository extends JpaRepository<Destinatario, Integer> {

    Optional<Destinatario> findByNumeroDocumento(String numeroDocumento);
}
