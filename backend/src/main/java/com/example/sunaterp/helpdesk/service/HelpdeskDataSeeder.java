package com.example.sunaterp.helpdesk.service;

import com.example.sunaterp.helpdesk.entity.HelpdeskFaq;
import com.example.sunaterp.helpdesk.entity.HelpdeskQuickAction;
import com.example.sunaterp.helpdesk.repository.HelpdeskFaqRepository;
import com.example.sunaterp.helpdesk.repository.HelpdeskQuickActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class HelpdeskDataSeeder implements CommandLineRunner {

    @Autowired
    private HelpdeskFaqRepository faqRepository;

    @Autowired
    private HelpdeskQuickActionRepository quickActionRepository;

    @Override
    public void run(String... args) throws Exception {
        seedFaqs();
        seedQuickActions();
    }

    private void seedFaqs() {
        if (faqRepository.count() == 0) {
            HelpdeskFaq faq1 = new HelpdeskFaq();
            faq1.setPregunta("¿Cómo emito una GRE?");
            faq1.setRespuesta("Para emitir una GRE debes ir al menú Logística > Emisión GRE, completar los datos del remitente, transporte y bienes, y generar el documento.");
            
            HelpdeskFaq faq2 = new HelpdeskFaq();
            faq2.setPregunta("¿Cómo declarar impuestos?");
            faq2.setRespuesta("El proceso consta de los siguientes pasos:\n1. Ingresa a la sección Operaciones > Declaraciones.\n2. Completa Ingresos y Gastos.\n3. Presiona Declarar y Pagar.");
            
            faqRepository.saveAll(Arrays.asList(faq1, faq2));
        }
    }

    private void seedQuickActions() {
        if (quickActionRepository.count() == 0) {
            List<String> actions = Arrays.asList(
                "Registrar Problema",
                "Consultar Estado de Ticket",
                "Preguntas Frecuentes",
                "Contactar Asesor"
            );
            
            int orden = 1;
            for (String actionLabel : actions) {
                HelpdeskQuickAction qa = new HelpdeskQuickAction();
                qa.setLabel(actionLabel);
                qa.setActivo(true);
                qa.setOrden(orden++);
                quickActionRepository.save(qa);
            }
            
            HelpdeskQuickAction qaIncidencia = new HelpdeskQuickAction();
            qaIncidencia.setLabel("Problemas de conexión hoy");
            qaIncidencia.setActivo(false); // Inactivo por defecto
            qaIncidencia.setOrden(orden);
            quickActionRepository.save(qaIncidencia);
        }
    }
}
