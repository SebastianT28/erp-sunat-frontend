package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.DetalleGre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleGreRepository extends JpaRepository<DetalleGre, Integer> {
}
