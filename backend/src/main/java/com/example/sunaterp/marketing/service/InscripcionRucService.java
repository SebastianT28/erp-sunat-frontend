package com.example.sunaterp.marketing.service;

import com.example.sunaterp.marketing.dto.InscripcionRucDTO;
import com.example.sunaterp.marketing.entity.InscripcionRuc;

public interface InscripcionRucService {
    InscripcionRuc guardarInscripcion(InscripcionRucDTO dto);
    void generarYEnviarCodigo(String correo);
    boolean validarCodigo(String correo, String codigo);
}
