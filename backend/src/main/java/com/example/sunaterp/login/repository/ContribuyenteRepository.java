package com.example.sunaterp.login.repository;

import com.example.sunaterp.login.entity.Contribuyente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContribuyenteRepository extends JpaRepository<Contribuyente, String> {
}
