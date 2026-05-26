package com.example.sunaterp;

import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// Código temporal para la demostración: 
	// Crea un usuario de prueba con contraseña encriptada si no existe.
	@Bean
	CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (usuarioRepository.findByNombreUsuario("admin_demo").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setNombreUsuario("admin_demo");
				admin.setCorreo("admin@demo.com");
				// Spring Security requiere que la contraseña esté encriptada
				admin.setContrasena(passwordEncoder.encode("demo123"));
				admin.setRol("ADMIN");
				usuarioRepository.save(admin);
				System.out.println("====== USUARIO DE PRUEBA CREADO ======");
				System.out.println("Usuario: admin_demo");
				System.out.println("Contraseña: demo123");
				System.out.println("======================================");
			}
		};
	}
}
