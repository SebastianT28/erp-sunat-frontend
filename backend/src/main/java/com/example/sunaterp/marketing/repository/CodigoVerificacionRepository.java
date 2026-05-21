package com.example.sunaterp.marketing.repository;

import com.example.sunaterp.marketing.entity.CodigoVerificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, Long> {
    Optional<CodigoVerificacion> findFirstByCorreoOrderByFechaExpiracionDesc(String correo);
}
