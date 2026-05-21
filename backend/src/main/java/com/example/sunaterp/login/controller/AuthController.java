package com.example.sunaterp.login.controller;

import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.marketing.entity.CodigoVerificacion;
import com.example.sunaterp.marketing.repository.CodigoVerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CodigoVerificacionRepository codigoVerificacionRepository;

    @Autowired
    private JavaMailSender mailSender;

    private static final Pattern XSS_PATTERN = Pattern.compile("<script>|<html>|<body>|<iframe>",
            Pattern.CASE_INSENSITIVE);

    private boolean containsXSS(String input) {
        if (input == null)
            return false;
        return XSS_PATTERN.matcher(input).find();
    }

    @PostMapping("/recuperar-usuario")
    public ResponseEntity<Map<String, String>> recuperarUsuario(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String correo = body.get("correo");
            if (correo == null || correo.trim().isEmpty() || containsXSS(correo)) {
                response.put("error", "Correo inválido o contiene caracteres no permitidos");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
            if (usuarioOpt.isEmpty()) {
                response.put("error", "No existe un usuario asociado a este correo");
                return ResponseEntity.badRequest().body(response);
            }

            Usuario usuario = usuarioOpt.get();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(correo);
            message.setSubject("Recuperación de Usuario - SUNAT ERP");
            message.setText("Estimado contribuyente,\n\nSu nombre de usuario es: " + usuario.getNombreUsuario()
                    + "\n\nAtentamente,\nSUNAT ERP");
            mailSender.send(message);

            response.put("mensaje", "Se ha enviado su nombre de usuario al correo ingresado.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error interno al enviar el correo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/solicitar-restablecimiento")
    public ResponseEntity<Map<String, String>> solicitarRestablecimiento(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String correo = body.get("correo");
            if (correo == null || correo.trim().isEmpty() || containsXSS(correo)) {
                response.put("error", "Correo inválido o contiene caracteres no permitidos");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
            if (usuarioOpt.isEmpty()) {
                response.put("error", "No existe un usuario asociado a este correo");
                return ResponseEntity.badRequest().body(response);
            }

            String codigo = String.format("%06d", new java.util.Random().nextInt(999999));
            CodigoVerificacion cv = new CodigoVerificacion();
            cv.setCorreo(correo);
            cv.setCodigo(codigo);
            cv.setFechaExpiracion(LocalDateTime.now().plusMinutes(5));
            codigoVerificacionRepository.save(cv);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(correo);
            message.setSubject("Restablecimiento de Contraseña - SUNAT ERP");
            message.setText("Estimado contribuyente,\n\nSu código de verificación es: " + codigo
                    + "\nEste código expirará en 5 minutos.\n\nAtentamente,\nSUNAT ERP");
            mailSender.send(message);

            response.put("mensaje", "Código de restablecimiento enviado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error al procesar la solicitud: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<Map<String, String>> cambiarPassword(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        try {
            String correo = body.get("correo");
            String codigo = body.get("codigo_otp");
            String nuevaPassword = body.get("nueva_password");

            if (correo == null || codigo == null || nuevaPassword == null ||
                    containsXSS(correo) || containsXSS(codigo) || containsXSS(nuevaPassword)) {
                response.put("error", "Datos inválidos o contienen caracteres no permitidos");
                return ResponseEntity.badRequest().body(response);
            }

            CodigoVerificacion cv = codigoVerificacionRepository.findFirstByCorreoOrderByFechaExpiracionDesc(correo)
                    .orElse(null);

            if (cv == null) {
                response.put("error", "No se encontró código de verificación para este correo");
                return ResponseEntity.badRequest().body(response);
            }

            if (!cv.getCodigo().equals(codigo)) {
                response.put("error", "El código ingresado es incorrecto");
                return ResponseEntity.badRequest().body(response);
            }

            if (LocalDateTime.now().isAfter(cv.getFechaExpiracion())) {
                response.put("error", "El código de verificación ha expirado");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
            if (usuarioOpt.isEmpty()) {
                response.put("error", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }

            Usuario usuario = usuarioOpt.get();

            if (usuario.getContrasena().equals(nuevaPassword)) {
                response.put("error",
                        "La nueva contraseña no puede ser igual a la contraseña actual. Por favor, intente con una diferente.");
                return ResponseEntity.badRequest().body(response);
            }

            usuario.setContrasena(nuevaPassword);
            usuarioRepository.save(usuario);

            response.put("mensaje", "Contraseña restablecida exitosamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Error interno en la validación: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
