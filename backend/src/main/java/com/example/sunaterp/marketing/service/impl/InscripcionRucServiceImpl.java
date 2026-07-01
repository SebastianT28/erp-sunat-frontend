package com.example.sunaterp.marketing.service.impl;

import com.example.sunaterp.config.EmailService;
import com.example.sunaterp.login.entity.Contribuyente;
import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.ContribuyenteRepository;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.marketing.dto.InscripcionRucDTO;
import com.example.sunaterp.marketing.entity.InscripcionRuc;
import com.example.sunaterp.marketing.repository.InscripcionRucRepository;
import com.example.sunaterp.marketing.service.InscripcionRucService;
import com.example.sunaterp.marketing.entity.CodigoVerificacion;
import com.example.sunaterp.marketing.repository.CodigoVerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class InscripcionRucServiceImpl implements InscripcionRucService {

    @Autowired
    private InscripcionRucRepository inscripcionRucRepository;

    @Autowired
    private ContribuyenteRepository contribuyenteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CodigoVerificacionRepository codigoVerificacionRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public InscripcionRuc guardarInscripcion(InscripcionRucDTO dto) {
        // 1. Instanciar y guardar Contribuyente
        Contribuyente contribuyente = new Contribuyente();
        String rucPrefix = "10";
        String tipoContribuyente = "PERSONA NATURAL CON NEGOCIO";
        if (dto.getMotivoInscripcion() != null && 
           (dto.getMotivoInscripcion().contains("Empresa") || dto.getMotivoInscripcion().contains("Persona Jurídica"))) {
            rucPrefix = "20";
            tipoContribuyente = "PERSONA JURÍDICA";
        }
        String ruc = rucPrefix + dto.getDni() + "4";
        contribuyente.setRuc(ruc);
        contribuyente.setRazonSocial(dto.getNombres() + " " + dto.getApellidos());
        contribuyente.setDireccion(dto.getDireccionFisica());
        contribuyente.setTipoContribuyente(tipoContribuyente);
        
        contribuyente = contribuyenteRepository.save(contribuyente);

        // 2. Instanciar y guardar Usuario
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getUsername());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getClaveSol());
        usuario.setRol("CONTRIBUYENTE");
        usuario.setContribuyente(contribuyente);
        
        usuarioRepository.save(usuario);

        // 3. Instanciar y guardar Trámite (InscripcionRuc)
        InscripcionRuc inscripcion = new InscripcionRuc();
        inscripcion.setMotivoInscripcion(dto.getMotivoInscripcion());
        inscripcion.setActividadEconomica(dto.getActividadEconomica());
        inscripcion.setInicioActividades(dto.getInicioActividades());
        inscripcion.setRegimenTributario(dto.getRegimenTributario());
        inscripcion.setTelefono(dto.getTelefono());
        inscripcion.setDepartamento(dto.getDepartamento());
        inscripcion.setProvincia(dto.getProvincia());
        inscripcion.setDistrito(dto.getDistrito());
        inscripcion.setCondicionDomicilio(dto.getCondicionDomicilio());
        inscripcion.setFechaRegistro(LocalDateTime.now());
        inscripcion.setContribuyente(contribuyente);

        return inscripcionRucRepository.save(inscripcion);
    }

    @Override
    @Transactional
    public void generarYEnviarCodigo(String correo) {
        String codigo = String.format("%06d", new java.util.Random().nextInt(999999));
        
        CodigoVerificacion cv = new CodigoVerificacion();
        cv.setCorreo(correo);
        cv.setCodigo(codigo);
        cv.setFechaExpiracion(LocalDateTime.now().plusMinutes(5));
        codigoVerificacionRepository.save(cv);

        emailService.enviarCorreo(
                correo,
                "Código de Verificación - SUNAT ERP",
                "Estimado contribuyente,\n\nSu código de verificación es: " + codigo + "\nEste código expirará en 5 minutos.\n\nAtentamente,\nSUNAT ERP"
        );
    }

    @Override
    public boolean validarCodigo(String correo, String codigo) {
        CodigoVerificacion cv = codigoVerificacionRepository.findFirstByCorreoOrderByFechaExpiracionDesc(correo)
                .orElseThrow(() -> new RuntimeException("No se encontró código de verificación para este correo."));
        
        if (!cv.getCodigo().equals(codigo)) {
            throw new RuntimeException("El código ingresado es incorrecto.");
        }
        
        if (LocalDateTime.now().isAfter(cv.getFechaExpiracion())) {
            throw new RuntimeException("El código de verificación ha expirado.");
        }
        
        return true;
    }
}
