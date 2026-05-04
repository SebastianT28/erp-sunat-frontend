package com.example.sunaterp.produccion.repository;

import com.example.sunaterp.produccion.entity.Casilla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CasillaRepository extends JpaRepository<Casilla, Long> {
}
