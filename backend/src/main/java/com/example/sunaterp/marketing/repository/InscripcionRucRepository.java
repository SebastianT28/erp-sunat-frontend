package com.example.sunaterp.marketing.repository;

import com.example.sunaterp.marketing.entity.InscripcionRuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InscripcionRucRepository extends JpaRepository<InscripcionRuc, Long> {
}
