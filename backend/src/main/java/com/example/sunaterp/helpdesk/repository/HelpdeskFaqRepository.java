package com.example.sunaterp.helpdesk.repository;

import com.example.sunaterp.helpdesk.entity.HelpdeskFaq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpdeskFaqRepository extends JpaRepository<HelpdeskFaq, Integer> {
    List<HelpdeskFaq> findByActivoTrue();
}
