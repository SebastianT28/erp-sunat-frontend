package com.example.sunaterp.soporte.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de integración con la API REST de Jira (Atlassian Cloud).
 * Crea automáticamente un ticket en el proyecto SCRUM cada vez que
 * se registra una nueva incidencia en el ERP.
 */
@Service
public class JiraIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(JiraIntegrationService.class);

    @Value("${jira.base-url}")
    private String jiraBaseUrl;

    @Value("${jira.email}")
    private String jiraEmail;

    @Value("${jira.api-token}")
    private String jiraApiToken;

    @Value("${jira.project-key}")
    private String jiraProjectKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Crea un ticket en Jira a partir de los datos de la incidencia.
     * El método falla silenciosamente (log de error) para no bloquear
     * el guardado local de la incidencia si Jira no está disponible.
     *
     * @param codigo      Código de la incidencia (ej. INC-001)
     * @param descripcion Descripción del incidente
     * @param urgencia    Nivel de urgencia (Crítica, Alta, Media, Baja)
     * @param area        Área o módulo afectado
     * @param categoria   Categoría de la incidencia
     * @param reportadoPor Nombre del usuario que reporta
     * @return El ID del ticket creado en Jira, o null si falló
     */
    public String crearTicketJira(String codigo, String descripcion, String urgencia,
                                   String area, String categoria, String reportadoPor) {
        try {
            String url = jiraBaseUrl + "/rest/api/3/issue";

            // Mapear urgencia ERP → prioridad Jira
            String prioridad = mapUrgenciaAPrioridad(urgencia);

            // Construir el body de la petición (API v3 de Jira usa formato ADF para description)
            Map<String, Object> body = buildJiraPayload(codigo, descripcion, prioridad, area, categoria, reportadoPor);

            HttpHeaders headers = buildHeaders();
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.CREATED && response.getBody() != null) {
                String jiraKey = (String) response.getBody().get("key");
                log.info("✅ Ticket Jira creado exitosamente: {} para incidencia {}", jiraKey, codigo);
                return jiraKey;
            } else {
                log.warn("⚠️ Jira respondió con status {} para incidencia {}", response.getStatusCode(), codigo);
                return null;
            }

        } catch (Exception e) {
            // No propagamos la excepción para no bloquear el guardado local
            log.error("❌ Error al crear ticket en Jira para incidencia {}: {}", codigo, e.getMessage());
            return null;
        }
    }

    /**
     * Construye los headers de autenticación Basic Auth para Jira.
     * Jira Cloud requiere: Base64(email:api_token)
     */
    private HttpHeaders buildHeaders() {
        String credentials = jiraEmail + ":" + jiraApiToken;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + encodedCredentials);
        return headers;
    }

    /**
     * Construye el payload JSON para la API de Jira v3.
     * La description usa el formato Atlassian Document Format (ADF).
     */
    private Map<String, Object> buildJiraPayload(String codigo, String descripcion,
                                                   String prioridad, String area,
                                                   String categoria, String reportadoPor) {
        // Título del ticket
        String summary = String.format("[%s] %s - %s", codigo, area, descripcion.length() > 60
                ? descripcion.substring(0, 60) + "..." : descripcion);

        // Cuerpo del ticket en formato ADF (requerido por Jira API v3)
        Map<String, Object> textNode = new HashMap<>();
        textNode.put("type", "text");
        textNode.put("text", String.format(
                "Código ERP: %s\nÁrea afectada: %s\nCategoría: %s\nReportado por: %s\nUrgencia: %s\n\nDescripción:\n%s",
                codigo, area, categoria, reportadoPor, prioridad, descripcion));

        Map<String, Object> paragraph = new HashMap<>();
        paragraph.put("type", "paragraph");
        paragraph.put("content", new Object[]{textNode});

        Map<String, Object> adfDescription = new HashMap<>();
        adfDescription.put("type", "doc");
        adfDescription.put("version", 1);
        adfDescription.put("content", new Object[]{paragraph});

        // Campos del issue
        Map<String, Object> fields = new HashMap<>();
        fields.put("project", Map.of("key", jiraProjectKey));
        fields.put("summary", summary);
        fields.put("description", adfDescription);
        fields.put("issuetype", Map.of("name", "Task"));
        fields.put("priority", Map.of("name", prioridad));

        Map<String, Object> payload = new HashMap<>();
        payload.put("fields", fields);
        return payload;
    }

    /**
     * Mapea la urgencia del ERP a la prioridad estándar de Jira.
     */
    private String mapUrgenciaAPrioridad(String urgencia) {
        if (urgencia == null) return "Medium";
        return switch (urgencia) {
            case "Crítica" -> "Highest";
            case "Alta"    -> "High";
            case "Media"   -> "Medium";
            case "Baja"    -> "Low";
            default        -> "Medium";
        };
    }
}
