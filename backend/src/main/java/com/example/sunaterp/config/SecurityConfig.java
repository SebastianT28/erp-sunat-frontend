package com.example.sunaterp.config;

import com.example.sunaterp.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // Configura cómo Spring encripta y compara contraseñas
    // Usamos NoOpPasswordEncoder temporalmente para no romper tus contraseñas actuales en texto plano
    @Bean
    public PasswordEncoder passwordEncoder() {
        return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
    }

    // Configura el proveedor que unirá el UserDetailsService con el PasswordEncoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Bean del AuthenticationManager (necesario si luego implementamos JWT)
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
            // 3. Configuración de acceso a rutas:
            //    - Rutas de la API son públicas (el frontend no envía credenciales en cada petición todavía)
            //    - Cuando implementemos JWT, solo /api/login/usuarios/auth y /api/auth/** serán públicas
            //    - y el resto requerirá el token JWT en el header Authorization
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
            )
            // 4. Usar autenticación básica (usuario/contraseña en headers) por el momento
            .httpBasic(Customizer.withDefaults());
            
        // Le indicamos que use nuestro proveedor de autenticación con base de datos
        http.authenticationProvider(authenticationProvider());
            
        return http.build();
    }
}
