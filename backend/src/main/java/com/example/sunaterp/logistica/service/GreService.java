package com.example.sunaterp.logistica.service;

import com.example.sunaterp.login.entity.Usuario;
import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.logistica.dto.*;
import com.example.sunaterp.logistica.entity.*;
import com.example.sunaterp.logistica.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class GreService {

    @Autowired
    private GreRepository greRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DestinatarioRepository destinatarioRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private BienRepository bienRepository;

    /**
     * Emite una nueva GRE con todos los datos de los 5 pasos.
     */
    @Transactional
    public Gre emitirGre(EmisionGreDTO dto) {

        // 1. Obtener usuario
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getIdUsuario()));

        // 2. Obtener o Crear Destinatario
        Destinatario destinatario = destinatarioRepository
                .findFirstByNumeroDocumento(dto.getDestinatario().getNumeroDocumento())
                .orElseGet(() -> {
                    Destinatario nuevo = new Destinatario();
                    nuevo.setNombre(dto.getDestinatario().getNombre());
                    nuevo.setTipoDocumentoIdentidad(dto.getDestinatario().getTipoDocumentoIdentidad());
                    nuevo.setNumeroDocumento(dto.getDestinatario().getNumeroDocumento());
                    return nuevo;
                });

        // 3. Obtener o Crear Vehículo
        Vehiculo vehiculo = vehiculoRepository
                .findFirstByPlaca(dto.getTransporte().getVehiculo().getPlaca())
                .orElseGet(() -> {
                    Vehiculo nuevo = new Vehiculo();
                    nuevo.setPlaca(dto.getTransporte().getVehiculo().getPlaca());
                    nuevo.setEntidadEmisora(dto.getTransporte().getVehiculo().getEntidadEmisora());
                    nuevo.setNumeroAutorizacion(dto.getTransporte().getVehiculo().getNumeroAutorizacion());
                    return nuevo;
                });

        // 4. Obtener o Crear Conductor
        Conductor conductor = conductorRepository
                .findFirstByNumeroDocumento(dto.getTransporte().getConductor().getNumeroDocumento())
                .orElseGet(() -> {
                    Conductor nuevo = new Conductor();
                    nuevo.setNombre(dto.getTransporte().getConductor().getNombre());
                    nuevo.setTipoDocumentoIdentidad(dto.getTransporte().getConductor().getTipoDocumentoIdentidad());
                    nuevo.setNumeroDocumento(dto.getTransporte().getConductor().getNumeroDocumento());
                    nuevo.setNumeroLicencia(dto.getTransporte().getConductor().getNumeroLicencia());
                    return nuevo;
                });

        // 5. Crear Transporte
        Transporte transporte = new Transporte();
        transporte.setVehiculo(vehiculo);
        transporte.setConductor(conductor);
        transporte.setTipoTransporte(dto.getTransporte().getTipoTransporte());
        transporte.setFechaInicioTraslado(LocalDate.parse(dto.getTransporte().getFechaInicioTraslado()));

        // 6. Crear GRE principal
        Gre gre = new Gre();
        gre.setUsuario(usuario);
        gre.setTransporte(transporte);
        gre.setDestinatario(destinatario);
        gre.setTipoGuia(dto.getTipoGuia());
        gre.setFechaEmision(LocalDate.now());
        gre.setMotivoTraslado(dto.getMotivoTraslado());
        gre.setEstado("Emitido");

        // Generar Serie y Número
        String serieDefecto = "T001";
        String maxNumero = greRepository.findMaxNumeroBySerie(serieDefecto);
        int nextNum = (maxNumero != null && !maxNumero.isEmpty()) ? Integer.parseInt(maxNumero) + 1 : 1;
        gre.setSerie(serieDefecto);
        gre.setNumero(String.format("%06d", nextNum));

        // 7. Agregar Bienes (Detalle GRE)
        if (dto.getBienes() != null) {
            for (BienDTO bienDTO : dto.getBienes()) {
                Bien bien = bienRepository
                        .findFirstByCodigoBien(bienDTO.getCodigoBien())
                        .orElseGet(() -> {
                            Bien nuevo = new Bien();
                            nuevo.setCodigoBien(bienDTO.getCodigoBien());
                            nuevo.setDescripcion(bienDTO.getDescripcion());
                            nuevo.setUnidadMedida(bienDTO.getUnidadMedida());
                            nuevo.setPeso(bienDTO.getPeso());
                            nuevo.setNormalizado(bienDTO.getNormalizado() != null ? bienDTO.getNormalizado() : false);
                            return nuevo;
                        });

                DetalleGre detalle = new DetalleGre();
                detalle.setBien(bien);
                detalle.setCantidad(bienDTO.getCantidad());

                gre.addDetalle(detalle);
            }
        }

        // 8. Agregar Documentos Relacionados
        if (dto.getDocumentosRelacionados() != null) {
            for (DocumentoRelacionadoDTO docDTO : dto.getDocumentosRelacionados()) {
                DocumentoRelacionado doc = new DocumentoRelacionado();
                doc.setTipo(docDTO.getTipo());
                doc.setSerie(docDTO.getSerie());
                doc.setNumero(docDTO.getNumero());
                doc.setFecha(docDTO.getFecha() != null && !docDTO.getFecha().isEmpty()
                        ? LocalDate.parse(docDTO.getFecha())
                        : LocalDate.now());

                gre.addDocumentoRelacionado(doc);
            }
        }

        // 9. Agregar Puntos de Traslado
        if (dto.getPuntoPartida() != null) {
            PuntoTraslado ptPartida = crearPuntoTraslado(dto.getPuntoPartida(), "partida");
            gre.addPuntoTraslado(ptPartida);
        }

        if (dto.getPuntoLlegada() != null) {
            PuntoTraslado ptLlegada = crearPuntoTraslado(dto.getPuntoLlegada(), "llegada");
            gre.addPuntoTraslado(ptLlegada);
        }

        // 10. Guardar todo en cascada
        return greRepository.save(gre);
    }

    /**
     * Obtiene todas las GREs emitidas.
     */
    @Transactional(readOnly = true)
    public List<Gre> listarGres() {
        return greRepository.findAll();
    }

    /**
     * Obtiene una GRE por su ID.
     */
    @Transactional(readOnly = true)
    public Gre obtenerGrePorId(Integer id) {
        return greRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("GRE no encontrada con ID: " + id));
    }

    /**
     * Obtiene GREs por estado.
     */
    @Transactional(readOnly = true)
    public List<Gre> listarGresPorEstado(String estado) {
        return greRepository.findByEstado(estado);
    }

    /**
     * Convierte una entidad GRE a GreResponseDTO.
     */
    public GreResponseDTO convertirAResponseDTO(Gre gre) {
        GreResponseDTO response = new GreResponseDTO();
        response.setIdGre(gre.getIdGre());
        response.setTipoGuia(gre.getTipoGuia());
        response.setFechaEmision(gre.getFechaEmision());
        response.setMotivoTraslado(gre.getMotivoTraslado());
        response.setEstado(gre.getEstado());
        response.setSerie(gre.getSerie());
        response.setNumero(gre.getNumero());

        // Destinatario
        if (gre.getDestinatario() != null) {
            response.setDestinatarioNombre(gre.getDestinatario().getNombre());
            response.setDestinatarioTipoDoc(gre.getDestinatario().getTipoDocumentoIdentidad());
            response.setDestinatarioNumDoc(gre.getDestinatario().getNumeroDocumento());
        }

        // Bienes
        List<BienDTO> bienesDTO = new ArrayList<>();
        if (gre.getDetalles() != null) {
            for (DetalleGre detalle : gre.getDetalles()) {
                BienDTO bienDTO = new BienDTO();
                bienDTO.setCodigoBien(detalle.getBien().getCodigoBien());
                bienDTO.setDescripcion(detalle.getBien().getDescripcion());
                bienDTO.setUnidadMedida(detalle.getBien().getUnidadMedida());
                bienDTO.setPeso(detalle.getBien().getPeso());
                bienDTO.setCantidad(detalle.getCantidad());
                bienesDTO.add(bienDTO);
            }
        }
        response.setBienes(bienesDTO);

        // Documentos
        List<DocumentoRelacionadoDTO> docsDTO = new ArrayList<>();
        if (gre.getDocumentosRelacionados() != null) {
            for (DocumentoRelacionado doc : gre.getDocumentosRelacionados()) {
                DocumentoRelacionadoDTO docDTO = new DocumentoRelacionadoDTO();
                docDTO.setTipo(doc.getTipo());
                docDTO.setSerie(doc.getSerie());
                docDTO.setNumero(doc.getNumero());
                docDTO.setFecha(doc.getFecha() != null ? doc.getFecha().toString() : null);
                docsDTO.add(docDTO);
            }
        }
        response.setDocumentosRelacionados(docsDTO);

        // Puntos de traslado
        if (gre.getPuntosTraslado() != null) {
            for (PuntoTraslado pt : gre.getPuntosTraslado()) {
                PuntoTrasladoDTO ptDTO = new PuntoTrasladoDTO();
                ptDTO.setTipo(pt.getTipo());
                ptDTO.setRucAsociado(pt.getRucAsociado());

                DireccionDTO dirDTO = new DireccionDTO();
                dirDTO.setDepartamento(pt.getDireccion().getDepartamento());
                dirDTO.setProvincia(pt.getDireccion().getProvincia());
                dirDTO.setDistrito(pt.getDireccion().getDistrito());
                dirDTO.setDireccionDetallada(pt.getDireccion().getDireccionDetallada());
                ptDTO.setDireccion(dirDTO);

                if ("partida".equals(pt.getTipo())) {
                    response.setPuntoPartida(ptDTO);
                } else if ("llegada".equals(pt.getTipo())) {
                    response.setPuntoLlegada(ptDTO);
                }
            }
        }

        // Transporte
        if (gre.getTransporte() != null) {
            TransporteDTO transporteDTO = new TransporteDTO();
            transporteDTO.setTipoTransporte(gre.getTransporte().getTipoTransporte());
            transporteDTO.setFechaInicioTraslado(gre.getTransporte().getFechaInicioTraslado().toString());

            if (gre.getTransporte().getVehiculo() != null) {
                VehiculoDTO vehDTO = new VehiculoDTO();
                vehDTO.setPlaca(gre.getTransporte().getVehiculo().getPlaca());
                vehDTO.setEntidadEmisora(gre.getTransporte().getVehiculo().getEntidadEmisora());
                vehDTO.setNumeroAutorizacion(gre.getTransporte().getVehiculo().getNumeroAutorizacion());
                transporteDTO.setVehiculo(vehDTO);
            }

            if (gre.getTransporte().getConductor() != null) {
                ConductorDTO condDTO = new ConductorDTO();
                condDTO.setNombre(gre.getTransporte().getConductor().getNombre());
                condDTO.setTipoDocumentoIdentidad(gre.getTransporte().getConductor().getTipoDocumentoIdentidad());
                condDTO.setNumeroDocumento(gre.getTransporte().getConductor().getNumeroDocumento());
                condDTO.setNumeroLicencia(gre.getTransporte().getConductor().getNumeroLicencia());
                transporteDTO.setConductor(condDTO);
            }

            response.setTransporte(transporteDTO);
        }

        return response;
    }

    private PuntoTraslado crearPuntoTraslado(PuntoTrasladoDTO dto, String tipo) {
        Direccion direccion = new Direccion();
        direccion.setDepartamento(dto.getDireccion().getDepartamento());
        direccion.setProvincia(dto.getDireccion().getProvincia());
        direccion.setDistrito(dto.getDireccion().getDistrito());
        direccion.setDireccionDetallada(dto.getDireccion().getDireccionDetallada());

        PuntoTraslado punto = new PuntoTraslado();
        punto.setDireccion(direccion);
        punto.setTipo(tipo);
        punto.setRucAsociado(dto.getRucAsociado());

        return punto;
    }
}
