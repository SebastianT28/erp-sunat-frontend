package com.example.sunaterp.helpdesk.controller;

import com.example.sunaterp.helpdesk.entity.HelpdeskQuickAction;
import com.example.sunaterp.helpdesk.repository.HelpdeskQuickActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpdesk/quick-actions")
public class HelpdeskQuickActionController {

    @Autowired
    private HelpdeskQuickActionRepository quickActionRepository;

    @GetMapping
    public ResponseEntity<List<HelpdeskQuickAction>> getAllQuickActions() {
        return ResponseEntity.ok(quickActionRepository.findAllByOrderByOrdenAsc());
    }

    @GetMapping("/active")
    public ResponseEntity<List<HelpdeskQuickAction>> getActiveQuickActions() {
        return ResponseEntity.ok(quickActionRepository.findByActivoTrueOrderByOrdenAsc());
    }

    @PostMapping
    public ResponseEntity<HelpdeskQuickAction> createQuickAction(@RequestBody HelpdeskQuickAction action) {
        return ResponseEntity.ok(quickActionRepository.save(action));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<HelpdeskQuickAction> toggleQuickAction(@PathVariable Integer id) {
        return quickActionRepository.findById(id).map(action -> {
            action.setActivo(!action.getActivo());
            return ResponseEntity.ok(quickActionRepository.save(action));
        }).orElse(ResponseEntity.notFound().build());
    }
}
