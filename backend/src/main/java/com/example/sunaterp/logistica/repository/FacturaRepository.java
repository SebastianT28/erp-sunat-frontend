package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
    Optional<Factura> findBySerieAndNumero(String serie, String numero);
}
