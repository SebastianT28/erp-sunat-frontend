package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Direccion;
import com.example.sunaterp.logistica.entity.PuntoTraslado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuntoTrasladoRepository extends JpaRepository<PuntoTraslado, Integer> {

    @Query("SELECT DISTINCT pt.direccion FROM PuntoTraslado pt WHERE pt.direccion.frecuente = true AND pt.tipo = :tipo")
    List<Direccion> findDireccionesFrecuentesByTipo(@Param("tipo") String tipo);

    @Query("SELECT DISTINCT pt.direccion FROM PuntoTraslado pt WHERE pt.direccion.frecuente = true")
    List<Direccion> findDireccionesFrecuentes();
}
