package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Transportista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportistaRepository extends JpaRepository<Transportista, Long> {

    boolean existsByRuc(Long ruc);

    List<Transportista> findByFrecuenteTrue();
}
