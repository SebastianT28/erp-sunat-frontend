package com.example.sunaterp.helpdesk.controller;

import com.example.sunaterp.helpdesk.entity.HelpdeskFaq;
import com.example.sunaterp.helpdesk.repository.HelpdeskFaqRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpdesk/faqs")
public class HelpdeskFaqController {

    @Autowired
    private HelpdeskFaqRepository faqRepository;

    @GetMapping
    public ResponseEntity<List<HelpdeskFaq>> getAllFaqs() {
        return ResponseEntity.ok(faqRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<HelpdeskFaq>> getActiveFaqs() {
        return ResponseEntity.ok(faqRepository.findByActivoTrue());
    }

    @PostMapping
    public ResponseEntity<HelpdeskFaq> createFaq(@RequestBody HelpdeskFaq faq) {
        return ResponseEntity.ok(faqRepository.save(faq));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HelpdeskFaq> updateFaq(@PathVariable Integer id, @RequestBody HelpdeskFaq faqDetails) {
        return faqRepository.findById(id).map(faq -> {
            faq.setPregunta(faqDetails.getPregunta());
            faq.setRespuesta(faqDetails.getRespuesta());
            faq.setActivo(faqDetails.getActivo());
            return ResponseEntity.ok(faqRepository.save(faq));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaq(@PathVariable Integer id) {
        if (faqRepository.existsById(id)) {
            faqRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
