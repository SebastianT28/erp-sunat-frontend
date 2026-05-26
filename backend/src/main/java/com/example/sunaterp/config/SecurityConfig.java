package com.example.sunaterp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

    // Bean del AuthenticationManager (necesario para JWT más adelante)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Spring Security detecta automáticamente el UserDetailsServiceImpl y el PasswordEncoder
    // y los conecta internamente sin necesidad de crear un DaoAuthenticationProvider manualmente
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (útil para APIs REST)
            .csrf(csrf -> csrf.disable())
            // 2. Configurar CORS (usará la configuración de CorsConfig)
            .cors(Customizer.withDefaults())
            // 3. Todas las rutas de la API son públicas por ahora
            //    Cuando implementemos JWT, solo /api/login/usuarios/auth y /api/auth/** serán públicas
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
            )
            // 4. Usar autenticación básica por el momento
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
