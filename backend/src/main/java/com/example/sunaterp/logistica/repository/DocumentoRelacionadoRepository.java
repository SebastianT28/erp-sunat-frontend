package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.DocumentoRelacionado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentoRelacionadoRepository extends JpaRepository<DocumentoRelacionado, Integer> {
    Optional<DocumentoRelacionado> findByTipoAndSerieAndNumero(String tipo, String serie, String numero);
}
