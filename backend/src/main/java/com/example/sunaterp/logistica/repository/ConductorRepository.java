package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Integer> {
    Optional<Conductor> findFirstByNumeroDocumento(String numeroDocumento);
}
