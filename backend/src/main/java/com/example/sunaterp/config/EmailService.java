package com.example.sunaterp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from.email:SUNAT ERP <onboarding@resend.dev>}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void enviarCorreo(String destinatario, String asunto, String contenido) {
        try {
            String jsonBody = "{" +
                    "\"from\":\"" + escapeJson(fromEmail) + "\"," +
                    "\"to\":[\"" + escapeJson(destinatario) + "\"]," +
                    "\"subject\":\"" + escapeJson(asunto) + "\"," +
                    "\"text\":\"" + escapeJson(contenido) + "\"" +
                    "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Error Resend API (HTTP " + response.statusCode() + "): " + response.body());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Envío de correo interrumpido", e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar correo: " + e.getMessage(), e);
        }
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    public void enviarCorreoHtml(String destinatario, String asunto, String contenidoHtml) {
        try {
            String jsonBody = "{" +
                    "\"from\":\"" + escapeJson(fromEmail) + "\"," +
                    "\"to\":[\"" + escapeJson(destinatario) + "\"]," +
                    "\"subject\":\"" + escapeJson(asunto) + "\"," +
                    "\"html\":\"" + escapeJson(contenidoHtml) + "\"" +
                    "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Error Resend API (HTTP " + response.statusCode() + "): " + response.body());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Envío de correo HTML interrumpido", e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar correo HTML: " + e.getMessage(), e);
        }
    }
}
