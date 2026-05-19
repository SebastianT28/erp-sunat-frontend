package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Bien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BienRepository extends JpaRepository<Bien, Integer> {
    Optional<Bien> findFirstByCodigoBien(String codigoBien);
}
