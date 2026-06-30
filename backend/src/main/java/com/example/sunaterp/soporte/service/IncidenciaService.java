package com.example.sunaterp.soporte.service;

import com.example.sunaterp.soporte.dto.CierreIncidenciaDTO;
import com.example.sunaterp.soporte.dto.ReporteIncidenciaDTO;
import com.example.sunaterp.soporte.entity.CierreIncidencia;
import com.example.sunaterp.soporte.entity.ReporteIncidencia;
import com.example.sunaterp.soporte.repository.CierreIncidenciaRepository;
import com.example.sunaterp.soporte.repository.ReporteIncidenciaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidenciaService {

    private static final Logger log = LoggerFactory.getLogger(IncidenciaService.class);

    @Autowired
    private ReporteIncidenciaRepository reporteRepository;

    @Autowired
    private CierreIncidenciaRepository cierreRepository;

    @Autowired
    private JiraIntegrationService jiraIntegrationService;

    // ---- REPORTES ----

    public List<ReporteIncidenciaDTO> listarTodas() {
        return reporteRepository.findAllWithCierre()
                .stream()
                .map(this::toReporteDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReporteIncidenciaDTO crearReporte(ReporteIncidenciaDTO dto) {
        // Validar que el código no exista
        if (reporteRepository.existsByCodigo(dto.getCodigo())) {
            throw new IllegalArgumentException("Ya existe una incidencia con el código: " + dto.getCodigo());
        }

        ReporteIncidencia reporte = new ReporteIncidencia();
        reporte.setCodigo(dto.getCodigo());
        reporte.setFechaDeteccion(dto.getFechaDeteccion());
        reporte.setReportadoPor(dto.getReportadoPor());
        reporte.setAreaAfectada(dto.getAreaAfectada());
        reporte.setCategoria(dto.getCategoria());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setUrgencia(dto.getUrgencia());
        reporte.setImpacto(dto.getImpacto());
        reporte.setEstado("Abierto");

        ReporteIncidencia guardado = reporteRepository.save(reporte);

        // Crear ticket en Jira de forma asíncrona (no bloquea si Jira falla)
        String jiraKey = jiraIntegrationService.crearTicketJira(
                guardado.getCodigo(),
                guardado.getDescripcion(),
                guardado.getUrgencia(),
                guardado.getAreaAfectada(),
                guardado.getCategoria(),
                guardado.getReportadoPor()
        );
        if (jiraKey != null) {
            log.info("Incidencia {} vinculada al ticket Jira: {}", guardado.getCodigo(), jiraKey);
        }

        return toReporteDTO(guardado);
    }

    @Transactional
    public void eliminarReporte(Long id) {
        if (!reporteRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró la incidencia con id: " + id);
        }
        reporteRepository.deleteById(id);
    }

    // ---- CIERRES ----

    @Transactional
    public ReporteIncidenciaDTO registrarCierre(Long reporteId, CierreIncidenciaDTO dto) {
        ReporteIncidencia reporte = reporteRepository.findById(reporteId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la incidencia con id: " + reporteId));

        // Si ya tiene cierre, actualizarlo en lugar de crear otro (relación 1-1)
        CierreIncidencia cierre = cierreRepository.findByReporteId(reporteId)
                .orElse(new CierreIncidencia());

        cierre.setReporte(reporte);
        cierre.setTipoIncidencia(dto.getTipoIncidencia());
        cierre.setResponsableResolucion(dto.getResponsableResolucion());
        cierre.setHoraInicioAtencion(dto.getHoraInicioAtencion());
        cierre.setCausaRaiz(dto.getCausaRaiz());
        cierre.setAccionContencion(dto.getAccionContencion());
        cierre.setRequirioRollback(dto.getRequirioRollback());
        cierre.setTipoRollback(dto.getTipoRollback());
        cierre.setHoraResolucion(dto.getHoraResolucion());
        cierre.setTiempoTotalResolucion(dto.getTiempoTotalResolucion());
        cierre.setAccionPreventiva(dto.getAccionPreventiva());
        cierre.setEstadoFinal(dto.getEstadoFinal());

        cierreRepository.save(cierre);

        // Actualizar estado del reporte
        reporte.setEstado(dto.getEstadoFinal());
        reporteRepository.save(reporte);

        // Recargar con el cierre actualizado
        return toReporteDTO(reporteRepository.findById(reporteId).orElse(reporte));
    }

    // ---- MAPPERS ----

    private ReporteIncidenciaDTO toReporteDTO(ReporteIncidencia r) {
        ReporteIncidenciaDTO dto = new ReporteIncidenciaDTO();
        dto.setId(r.getId());
        dto.setCodigo(r.getCodigo());
        dto.setFechaDeteccion(r.getFechaDeteccion());
        dto.setReportadoPor(r.getReportadoPor());
        dto.setAreaAfectada(r.getAreaAfectada());
        dto.setCategoria(r.getCategoria());
        dto.setDescripcion(r.getDescripcion());
        dto.setUrgencia(r.getUrgencia());
        dto.setImpacto(r.getImpacto());
        dto.setEstado(r.getEstado());
        dto.setFechaCreacion(r.getFechaCreacion());

        if (r.getCierre() != null) {
            dto.setCierre(toCierreDTO(r.getCierre()));
        }

        return dto;
    }

    private CierreIncidenciaDTO toCierreDTO(CierreIncidencia c) {
        CierreIncidenciaDTO dto = new CierreIncidenciaDTO();
        dto.setId(c.getId());
        dto.setReporteId(c.getReporte() != null ? c.getReporte().getId() : null);
        dto.setTipoIncidencia(c.getTipoIncidencia());
        dto.setResponsableResolucion(c.getResponsableResolucion());
        dto.setHoraInicioAtencion(c.getHoraInicioAtencion());
        dto.setCausaRaiz(c.getCausaRaiz());
        dto.setAccionContencion(c.getAccionContencion());
        dto.setRequirioRollback(c.getRequirioRollback());
        dto.setTipoRollback(c.getTipoRollback());
        dto.setHoraResolucion(c.getHoraResolucion());
        dto.setTiempoTotalResolucion(c.getTiempoTotalResolucion());
        dto.setAccionPreventiva(c.getAccionPreventiva());
        dto.setEstadoFinal(c.getEstadoFinal());
        return dto;
    }
}
