package com.example.sunaterp.soporte.repository;

import com.example.sunaterp.soporte.entity.ReporteIncidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReporteIncidenciaRepository extends JpaRepository<ReporteIncidencia, Long> {

    Optional<ReporteIncidencia> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    @Query("SELECT r FROM ReporteIncidencia r LEFT JOIN FETCH r.cierre ORDER BY r.fechaCreacion DESC")
    List<ReporteIncidencia> findAllWithCierre();
}
