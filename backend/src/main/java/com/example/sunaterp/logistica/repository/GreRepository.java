package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Gre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GreRepository extends JpaRepository<Gre, Integer> {

    List<Gre> findByUsuarioIdUsuario(Integer idUsuario);

    List<Gre> findByEstado(String estado);

    List<Gre> findByTipoGuia(String tipoGuia);
}
