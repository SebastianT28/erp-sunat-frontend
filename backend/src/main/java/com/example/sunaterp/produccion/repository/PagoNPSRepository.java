package com.example.sunaterp.produccion.repository;

import com.example.sunaterp.produccion.entity.PagoNPS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoNPSRepository extends JpaRepository<PagoNPS, Long> {
    Optional<PagoNPS> findByNumeroOrden(String numeroOrden);
}
