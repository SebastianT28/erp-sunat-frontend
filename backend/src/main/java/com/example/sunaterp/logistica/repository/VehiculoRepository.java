package com.example.sunaterp.logistica.repository;

import com.example.sunaterp.logistica.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer> {
    Optional<Vehiculo> findFirstByPlaca(String placa);
}
