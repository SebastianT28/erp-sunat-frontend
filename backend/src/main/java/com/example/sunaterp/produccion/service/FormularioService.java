package com.example.sunaterp.produccion.service;

import com.example.sunaterp.login.repository.UsuarioRepository;
import com.example.sunaterp.produccion.dto.CasillaDTO;
import com.example.sunaterp.produccion.dto.FormularioDTO;
import com.example.sunaterp.produccion.entity.Casilla;
import com.example.sunaterp.produccion.entity.FormularioGeneral;
import com.example.sunaterp.produccion.repository.FormularioGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FormularioService {

    @Autowired
    private FormularioGeneralRepository formularioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public FormularioGeneral guardarFormulario(FormularioDTO dto) {
        FormularioGeneral formulario = new FormularioGeneral();
        
        if (dto.getIdUsuario() != null) {
            usuarioRepository.findById(dto.getIdUsuario()).ifPresent(formulario::setUsuario);
        }
        
        // El frontend envía MM/AAAA, lo convertimos a 01/MM/AAAA
        if (dto.getPeriodoTributario() != null && !dto.getPeriodoTributario().isEmpty()) {
            String[] partes = dto.getPeriodoTributario().split("/");
            if (partes.length == 2) {
                String mes = partes[0].trim();
                String anio = partes[1].trim();
                // Aseguramos que el mes tenga dos dígitos
                if (mes.length() == 1) {
                    mes = "0" + mes;
                }
                String fechaStr = "01/" + mes + "/" + anio;
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                formulario.setPeriodoTributario(LocalDate.parse(fechaStr, formatter));
            }
        }

        formulario.setTipoDeclaracion(dto.getTipoDeclaracion());
        formulario.setCondicionIgv(dto.getCondicionIgv());
        formulario.setVentasNoGravadas(dto.getVentasNoGravadas());
        formulario.setIvap(dto.getIvap());
        formulario.setRegimenTributario(dto.getRegimenTributario());
        formulario.setOtrosRegimenes(dto.getOtrosRegimenes());
        formulario.setTipoCambio(dto.getTipoCambio());
        formulario.setSuspensionPagos(dto.getSuspensionPagos());
        formulario.setPdt625(dto.getPdt625());
        formulario.setNumeroResolucion(dto.getNumeroResolucion());

        if (dto.getFechaModificacion() != null && !dto.getFechaModificacion().isEmpty()) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            formulario.setFechaModificacion(LocalDate.parse(dto.getFechaModificacion(), dtf));
        }

        formulario.setCoeficienteSunat(dto.getCoeficienteSunat());

        if (dto.getCasillas() != null) {
            for (CasillaDTO casillaDTO : dto.getCasillas()) {
                Casilla casilla = new Casilla();
                casilla.setNumeroCasilla(casillaDTO.getNumeroCasilla());
                casilla.setValor(casillaDTO.getValor());
                formulario.addCasilla(casilla); // Usamos el método helper para mantener sincronía
            }
        }

        return formularioRepository.save(formulario);
    }

    @Transactional(readOnly = true)
    public List<FormularioGeneral> listarFormularios() {
        return formularioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<FormularioGeneral> listarFormulariosPorUsuario(Integer idUsuario) {
        return formularioRepository.findByUsuarioIdUsuario(idUsuario);
    }
}
