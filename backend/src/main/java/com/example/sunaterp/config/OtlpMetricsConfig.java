package com.example.sunaterp.config;

import io.micrometer.core.instrument.Clock;
import io.micrometer.registry.otlp.OtlpConfig;
import io.micrometer.registry.otlp.OtlpMeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * Configuración manual del exportador de métricas OTLP hacia Grafana Cloud.
 * Se hace manualmente porque Spring Boot 4.x no auto-configura OtlpMeterRegistry
 * de la misma forma que Spring Boot 3.x.
 */
@Configuration
public class OtlpMetricsConfig {

    private static final Logger log = LoggerFactory.getLogger(OtlpMetricsConfig.class);

    @Value("${GRAFANA_OTLP_URL}")
    private String otlpUrl;

    @Value("${GRAFANA_OTLP_TOKEN}")
    private String otlpToken;

    @Bean
    public OtlpMeterRegistry otlpMeterRegistry() {
        log.info("==> Inicializando OtlpMeterRegistry hacia: {}", otlpUrl);

        OtlpConfig config = new OtlpConfig() {
            @Override
            public String url() {
                return otlpUrl;
            }

            @Override
            public Map<String, String> headers() {
                // El token ya está en Base64, solo agregamos el prefijo "Basic "
                return Map.of("Authorization", "Basic " + otlpToken);
            }

            @Override
            public java.time.Duration step() {
                return java.time.Duration.ofSeconds(15);
            }

            @Override
            public Map<String, String> resourceAttributes() {
                // Esto elimina la etiqueta "unknown_service" en Grafana
                return Map.of("service.name", "erp-sunat");
            }

            @Override
            public String get(String key) {
                return null; // Usar valores por defecto para el resto
            }
        };

        OtlpMeterRegistry registry = new OtlpMeterRegistry(config, Clock.SYSTEM);
        log.info("==> OtlpMeterRegistry creado correctamente. Enviando métricas cada 15s.");
        return registry;
    }
}
