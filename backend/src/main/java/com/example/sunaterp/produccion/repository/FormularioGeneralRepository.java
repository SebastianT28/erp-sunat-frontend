package com.example.sunaterp.produccion.repository;

import com.example.sunaterp.produccion.entity.FormularioGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormularioGeneralRepository extends JpaRepository<FormularioGeneral, Long> {
}
