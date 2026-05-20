package com.example.sunaterp.marketing.service.impl;

import com.example.sunaterp.login.entity.Contribuyente;
import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.ContribuyenteRepository;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.marketing.dto.InscripcionRucDTO;
import com.example.sunaterp.marketing.entity.InscripcionRuc;
import com.example.sunaterp.marketing.repository.InscripcionRucRepository;
import com.example.sunaterp.marketing.service.InscripcionRucService;
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

    @Override
    @Transactional
    public InscripcionRuc guardarInscripcion(InscripcionRucDTO dto) {
        // 1. Instanciar y guardar Contribuyente
        Contribuyente contribuyente = new Contribuyente();
        String ruc = "10" + dto.getDni() + "4";
        contribuyente.setRuc(ruc);
        contribuyente.setRazonSocial(dto.getNombres() + " " + dto.getApellidos());
        contribuyente.setDireccion(dto.getDireccionFisica());
        contribuyente.setTipoContribuyente("PERSONA NATURAL CON NEGOCIO");
        
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
}
