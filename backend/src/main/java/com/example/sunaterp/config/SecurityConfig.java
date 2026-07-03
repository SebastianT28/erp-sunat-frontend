package com.example.sunaterp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private com.example.sunaterp.security.JwtRequestFilter jwtRequestFilter;

    @Autowired
    private com.example.sunaterp.security.PrometheusAuthFilter prometheusAuthFilter;

    // Configura cómo Spring compara contraseñas
    // Usamos un encoder de texto plano ya que las contraseñas en la BD no están encriptadas aún
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }

    // Bean del AuthenticationManager (necesario para JWT)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (útil para APIs REST)
            .csrf(csrf -> csrf.disable())
            // 2. Configurar CORS (usará la configuración de CorsConfig)
            .cors(Customizer.withDefaults())
            // 3. Configurar qué rutas son públicas y cuáles protegidas
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/login/usuarios/auth").permitAll() // Login
                .requestMatchers("/api/auth/**").permitAll()             // Recuperación de clave
                .requestMatchers("/api/marketing/**").permitAll()        // Módulo público
                .requestMatchers("/api/helpdesk/tickets/public").permitAll()   // Creación de tickets sin login
                .requestMatchers("/api/helpdesk/tickets/status/**").permitAll() // Consulta de tickets
                .requestMatchers("/api/helpdesk/faqs/active").permitAll()       // FAQs públicas para el chatbot
                .requestMatchers("/api/helpdesk/quick-actions/active").permitAll() // Quick Actions para el chatbot
                .requestMatchers("/actuator/prometheus").permitAll()     // Métricas (Protegido por PrometheusAuthFilter)
                .requestMatchers("/actuator/health").permitAll()         // Health check (Público para Render)
                // /api/soporte/incidencias/** requiere autenticación (cubierto por anyRequest)
                .anyRequest().authenticated()                            // Todo lo demás protegido
            )
            // 4. Configurar manejo de sesión a STATELESS porque usamos JWT
            .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS));

        // 5. Añadir nuestro filtro JWT antes del filtro de validación de usuario y contraseña
        http.addFilterBefore(prometheusAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtRequestFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
