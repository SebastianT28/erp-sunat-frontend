package com.example.sunaterp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class PrometheusAuthFilter extends OncePerRequestFilter {

    @Value("${grafana.prometheus.token}")
    private String expectedToken;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();

        if (path.startsWith("/actuator/prometheus")) {
            String authHeader = request.getHeader("Authorization");
            
            // Esperamos "Bearer token_secreto"
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (expectedToken.equals(token)) {
                    filterChain.doFilter(request, response);
                    return;
                }
            }
            
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Acceso no autorizado a métricas");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
