package com.example.sunaterp.gerencia.service;

import com.example.sunaterp.gerencia.dto.*;
import com.example.sunaterp.login.entity.Contribuyente;
import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.ContribuyenteRepository;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.logistica.entity.Gre;
import com.example.sunaterp.logistica.entity.Notificacion;
import com.example.sunaterp.logistica.repository.GreRepository;
import com.example.sunaterp.logistica.repository.NotificacionRepository;
import com.example.sunaterp.produccion.entity.FormularioGeneral;
import com.example.sunaterp.produccion.repository.FormularioGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GerenciaGeneralService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContribuyenteRepository contribuyenteRepository;

    @Autowired
    private GreRepository greRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private FormularioGeneralRepository formularioRepository;

    public DashboardDTO getDashboard() {
        long totalUsuarios = usuarioRepository.count();
        long totalGres = greRepository.count();
        long totalDeclaraciones = formularioRepository.count();
        return new DashboardDTO(totalUsuarios, totalGres, totalDeclaraciones);
    }

    public List<UsuarioGerenciaDTO> getUsuarios() {
        return usuarioRepository.findAll().stream().map(u -> {
            UsuarioGerenciaDTO dto = new UsuarioGerenciaDTO();
            dto.setId(u.getIdUsuario());
            dto.setUsuario(u.getNombreUsuario());
            dto.setCorreo(u.getCorreo());
            if (u.getContribuyente() != null) {
                dto.setRuc(u.getContribuyente().getRuc());
                dto.setRazonSocial(u.getContribuyente().getRazonSocial());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public UsuarioGerenciaDTO createUsuario(UsuarioCreateDTO dto) {
        Optional<Contribuyente> cOpt = contribuyenteRepository.findById(dto.getRuc());
        Contribuyente contribuyente;
        
        if (cOpt.isPresent()) {
            contribuyente = cOpt.get();
        } else {
            contribuyente = new Contribuyente();
            contribuyente.setRuc(dto.getRuc());
            contribuyente.setRazonSocial(dto.getRazonSocial());
            contribuyente.setDireccion("Direccion S/N");
            contribuyente.setTipoContribuyente("General");
            contribuyenteRepository.save(contribuyente);
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getUsuario());
        usuario.setContrasena(dto.getPassword());
        usuario.setCorreo(dto.getCorreo() != null ? dto.getCorreo() : "sin_correo@empresa.com");
        usuario.setRol("contribuyente");
        usuario.setContribuyente(contribuyente);
        
        usuarioRepository.save(usuario);

        UsuarioGerenciaDTO response = new UsuarioGerenciaDTO();
        response.setId(usuario.getIdUsuario());
        response.setUsuario(usuario.getNombreUsuario());
        response.setCorreo(usuario.getCorreo());
        response.setRuc(contribuyente.getRuc());
        response.setRazonSocial(contribuyente.getRazonSocial());
        return response;
    }

    public UsuarioGerenciaDTO updateUsuario(Integer id, UsuarioCreateDTO dto) {
        Optional<Usuario> userOpt = usuarioRepository.findById(id);
        if (userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            usuario.setNombreUsuario(dto.getUsuario());
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                usuario.setContrasena(dto.getPassword());
            }
            usuario.setCorreo(dto.getCorreo() != null ? dto.getCorreo() : "sin_correo@empresa.com");
            
            if (dto.getRuc() != null && (usuario.getContribuyente() == null || !dto.getRuc().equals(usuario.getContribuyente().getRuc()))) {
                Optional<Contribuyente> cOpt = contribuyenteRepository.findById(dto.getRuc());
                if (cOpt.isPresent()) {
                    usuario.setContribuyente(cOpt.get());
                } else {
                    Contribuyente c = new Contribuyente();
                    c.setRuc(dto.getRuc());
                    c.setRazonSocial(dto.getRazonSocial());
                    c.setDireccion("Direccion S/N");
                    c.setTipoContribuyente("General");
                    contribuyenteRepository.save(c);
                    usuario.setContribuyente(c);
                }
            }

            usuarioRepository.save(usuario);

            UsuarioGerenciaDTO response = new UsuarioGerenciaDTO();
            response.setId(usuario.getIdUsuario());
            response.setUsuario(usuario.getNombreUsuario());
            response.setCorreo(usuario.getCorreo());
            response.setRuc(usuario.getContribuyente().getRuc());
            response.setRazonSocial(usuario.getContribuyente().getRazonSocial());
            return response;
        }
        return null;
    }

    public void deleteUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public List<GreGerenciaDTO> getGres() {
        List<Gre> gres = greRepository.findAll();
        List<Notificacion> notificaciones = notificacionRepository.findAll();

        return gres.stream().map(g -> {
            GreGerenciaDTO dto = new GreGerenciaDTO();
            dto.setId(g.getIdGre());
            dto.setSerie(g.getSerie());
            dto.setNumero(g.getNumero());
            dto.setEstado(g.getEstado());
            if (g.getUsuario() != null && g.getUsuario().getContribuyente() != null) {
                dto.setEmisor(g.getUsuario().getContribuyente().getRuc());
            }

            // check if there's any reclamo for this gre
            Optional<Notificacion> reclamo = notificaciones.stream()
                .filter(n -> n.getGre() != null && n.getGre().getIdGre().equals(g.getIdGre()))
                .findFirst();
            if (reclamo.isPresent()) {
                dto.setReclamo(reclamo.get().getMensaje());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public void deleteGre(Integer id) {
        greRepository.deleteById(id);
    }

    public GreGerenciaDTO updateGre(Integer id, GreGerenciaDTO dto) {
        Optional<Gre> greOpt = greRepository.findById(id);
        if (greOpt.isPresent()) {
            Gre gre = greOpt.get();
            if (dto.getEstado() != null) {
                gre.setEstado(dto.getEstado());
            }
            greRepository.save(gre);
            
            GreGerenciaDTO response = new GreGerenciaDTO();
            response.setId(gre.getIdGre());
            response.setSerie(gre.getSerie());
            response.setNumero(gre.getNumero());
            response.setEstado(gre.getEstado());
            if (gre.getUsuario() != null && gre.getUsuario().getContribuyente() != null) {
                response.setEmisor(gre.getUsuario().getContribuyente().getRuc());
            }
            response.setReclamo(dto.getReclamo()); // Preserve the existing reclamo
            return response;
        }
        return null;
    }

    public List<DeclaracionGerenciaDTO> getDeclaraciones() {
        return formularioRepository.findAll().stream().map(f -> {
            DeclaracionGerenciaDTO dto = new DeclaracionGerenciaDTO();
            dto.setId(f.getId());
            dto.setPeriodo(f.getPeriodoTributario() != null ? f.getPeriodoTributario().format(DateTimeFormatter.ofPattern("yyyy-MM")) : "");
            dto.setFormulario(f.getTipoDeclaracion() != null ? f.getTipoDeclaracion() : "Declaración");
            dto.setEmisor("-"); // FormularioGeneral doesn't link directly to user in current DB schema, we return empty or default
            dto.setFecha(f.getFechaModificacion() != null ? f.getFechaModificacion().toString() : "");
            return dto;
        }).collect(Collectors.toList());
    }

    public void deleteDeclaracion(Long id) {
        formularioRepository.deleteById(id);
    }
}
