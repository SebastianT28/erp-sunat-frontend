package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Transporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransporteRepository extends JpaRepository<Transporte, Integer> {
}
