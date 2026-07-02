package com.example.sunaterp.gerencia.service;

import com.example.sunaterp.gerencia.dto.*;
import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.logistica.entity.Gre;
import com.example.sunaterp.logistica.entity.Notificacion;
import com.example.sunaterp.logistica.repository.GreRepository;
import com.example.sunaterp.logistica.repository.NotificacionRepository;
import com.example.sunaterp.produccion.entity.FormularioGeneral;
import com.example.sunaterp.produccion.repository.FormularioGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GerenciaReportesService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GreRepository greRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private FormularioGeneralRepository formularioRepository;

    @Transactional(readOnly = true)
    public DashboardReportesDataDTO getDashboardReportesData() {
        long totalUsuarios = usuarioRepository.count();
        long totalGres = greRepository.count();
        long totalDeclaraciones = formularioRepository.count();

        List<Gre> gres = greRepository.findAll();
        List<Notificacion> notificaciones = notificacionRepository.findAll();

        List<GreReporteItemDTO> greDTOs = gres.stream().map(g -> {
            GreReporteItemDTO dto = new GreReporteItemDTO();
            dto.setId(g.getIdGre());
            dto.setSerie(g.getSerie() != null ? g.getSerie() : "");
            dto.setNumero(g.getNumero() != null ? g.getNumero() : "");
            dto.setEstado(g.getEstado() != null ? g.getEstado() : "");

            if (g.getFechaEmision() != null) {
                dto.setFechaEmision(g.getFechaEmision().toString());
            } else {
                dto.setFechaEmision("");
            }

            if (g.getUsuario() != null && g.getUsuario().getContribuyente() != null) {
                dto.setEmisor(g.getUsuario().getContribuyente().getRuc());
                dto.setRazonSocialEmisor(g.getUsuario().getContribuyente().getRazonSocial());
            } else {
                dto.setEmisor("-");
                dto.setRazonSocialEmisor("-");
            }

            Optional<Notificacion> reclamo = notificaciones.stream()
                    .filter(n -> n.getGre() != null && n.getGre().getIdGre().equals(g.getIdGre()))
                    .findFirst();
            if (reclamo.isPresent()) {
                dto.setReclamo(reclamo.get().getMensaje());
            } else {
                dto.setReclamo("");
            }

            return dto;
        }).collect(Collectors.toList());

        List<FormularioGeneral> formularios = formularioRepository.findAll();
        List<DeclaracionReporteItemDTO> declaracionDTOs = formularios.stream().map(f -> {
            DeclaracionReporteItemDTO dto = new DeclaracionReporteItemDTO();
            dto.setId(f.getId());
            dto.setFormulario(f.getTipoDeclaracion() != null ? f.getTipoDeclaracion() : "Declaración");

            if (f.getPeriodoTributario() != null) {
                dto.setPeriodo(f.getPeriodoTributario().format(DateTimeFormatter.ofPattern("yyyy-MM")));
            } else {
                dto.setPeriodo("");
            }

            if (f.getFechaModificacion() != null) {
                dto.setFecha(f.getFechaModificacion().toString());
            } else if (f.getPeriodoTributario() != null) {
                dto.setFecha(f.getPeriodoTributario().toString());
            } else {
                dto.setFecha("");
            }

            if (f.getUsuario() != null && f.getUsuario().getContribuyente() != null) {
                dto.setEmisor(f.getUsuario().getContribuyente().getRuc());
                dto.setRazonSocialEmisor(f.getUsuario().getContribuyente().getRazonSocial());
            } else {
                dto.setEmisor("-");
                dto.setRazonSocialEmisor("-");
            }

            dto.setCondicionIgv(f.getCondicionIgv() != null ? f.getCondicionIgv() : "");
            dto.setRegimenTributario(f.getRegimenTributario() != null ? f.getRegimenTributario() : "");

            return dto;
        }).collect(Collectors.toList());

        List<Usuario> usuarios = usuarioRepository.findAll();
        List<ContribuyenteReporteItemDTO> contribuyenteDTOs = usuarios.stream().map(u -> {
            ContribuyenteReporteItemDTO dto = new ContribuyenteReporteItemDTO();
            dto.setIdUsuario(u.getIdUsuario());
            dto.setUsuario(u.getNombreUsuario() != null ? u.getNombreUsuario() : "");
            dto.setCorreo(u.getCorreo() != null ? u.getCorreo() : "");
            if (u.getContribuyente() != null) {
                dto.setRuc(u.getContribuyente().getRuc() != null ? u.getContribuyente().getRuc() : "");
                dto.setRazonSocial(u.getContribuyente().getRazonSocial() != null ? u.getContribuyente().getRazonSocial() : "");
                dto.setTipoContribuyente(u.getContribuyente().getTipoContribuyente() != null ? u.getContribuyente().getTipoContribuyente() : "");
                dto.setDireccion(u.getContribuyente().getDireccion() != null ? u.getContribuyente().getDireccion() : "");
            } else {
                dto.setRuc("-");
                dto.setRazonSocial("-");
                dto.setTipoContribuyente("-");
                dto.setDireccion("-");
            }
            return dto;
        }).collect(Collectors.toList());

        DashboardReportesDataDTO response = new DashboardReportesDataDTO();
        response.setTotalContribuyentes(totalUsuarios);
        response.setTotalGres(totalGres);
        response.setTotalDeclaraciones(totalDeclaraciones);
        response.setGres(greDTOs);
        response.setDeclaraciones(declaracionDTOs);
        response.setContribuyentes(contribuyenteDTOs);

        return response;
    }
}
