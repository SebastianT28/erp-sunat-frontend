package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Gre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GreRepository extends JpaRepository<Gre, Integer> {

    List<Gre> findByUsuarioIdUsuario(Integer idUsuario);

    List<Gre> findByEstado(String estado);

    List<Gre> findByTipoGuia(String tipoGuia);

    @Query("SELECT MAX(g.numero) FROM Gre g WHERE g.serie = :serie")
    String findMaxNumeroBySerie(@Param("serie") String serie);

    java.util.Optional<Gre> findBySerieAndNumero(String serie, String numero);

    java.util.Optional<Gre> findByTipoGuiaAndSerieAndNumero(String tipoGuia, String serie, String numero);

    List<Gre> findByFechaEmisionBetweenAndDestinatarioNumeroDocumento(java.time.LocalDate fechaDesde, java.time.LocalDate fechaHasta, String numeroDocumento);
}
