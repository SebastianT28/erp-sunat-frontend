package com.example.sunaterp.helpdesk.repository;

import com.example.sunaterp.helpdesk.entity.HelpdeskQuickAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpdeskQuickActionRepository extends JpaRepository<HelpdeskQuickAction, Integer> {
    List<HelpdeskQuickAction> findByActivoTrueOrderByOrdenAsc();
    List<HelpdeskQuickAction> findAllByOrderByOrdenAsc();
}
