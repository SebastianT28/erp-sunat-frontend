package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.DocumentoRelacionado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoRelacionadoRepository extends JpaRepository<DocumentoRelacionado, Integer> {
    List<DocumentoRelacionado> findByTipoAndSerieAndNumero(String tipo, String serie, String numero);

    @Query("SELECT d FROM DocumentoRelacionado d WHERE UPPER(TRIM(d.tipo)) = UPPER(TRIM(:tipo)) AND UPPER(TRIM(d.serie)) = UPPER(TRIM(:serie)) AND UPPER(TRIM(d.numero)) = UPPER(TRIM(:numero))")
    List<DocumentoRelacionado> findByTipoAndSerieAndNumeroFlexible(@Param("tipo") String tipo,
            @Param("serie") String serie, @Param("numero") String numero);

    @Query("SELECT d FROM DocumentoRelacionado d WHERE UPPER(TRIM(d.serie)) = UPPER(TRIM(:serie)) AND UPPER(TRIM(d.numero)) = UPPER(TRIM(:numero))")
    List<DocumentoRelacionado> findBySerieAndNumeroFlexible(@Param("serie") String serie,
            @Param("numero") String numero);
}
