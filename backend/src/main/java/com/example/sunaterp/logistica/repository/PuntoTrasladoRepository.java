package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.PuntoTraslado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuntoTrasladoRepository extends JpaRepository<PuntoTraslado, Integer> {
}
