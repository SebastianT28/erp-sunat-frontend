package com.example.sunaterp.produccion.repository;

import com.example.sunaterp.produccion.entity.FormularioGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FormularioGeneralRepository extends JpaRepository<FormularioGeneral, Long> {
    List<FormularioGeneral> findByUsuarioIdUsuario(Integer idUsuario);
    List<FormularioGeneral> findByUsuarioContribuyenteRuc(String ruc);
}
