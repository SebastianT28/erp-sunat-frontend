package com.example.sunaterp.soporte.repository;

import com.example.sunaterp.soporte.entity.CierreIncidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CierreIncidenciaRepository extends JpaRepository<CierreIncidencia, Long> {

    Optional<CierreIncidencia> findByReporteId(Long reporteId);

    boolean existsByReporteId(Long reporteId);
}
