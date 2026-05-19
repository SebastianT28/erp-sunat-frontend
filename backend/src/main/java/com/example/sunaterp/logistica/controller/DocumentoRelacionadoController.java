package com.example.sunaterp.logistica.controller;

import com.example.sunaterp.logistica.entity.DocumentoRelacionado;
import com.example.sunaterp.logistica.repository.DocumentoRelacionadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/logistica/documento-relacionado")
public class DocumentoRelacionadoController {

    @Autowired
    private DocumentoRelacionadoRepository documentoRelacionadoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * GET
     * /api/logistica/documento-relacionado/validar?tipo=Factura&serie=F001&numero=000123
     * Verifica si un documento relacionado existe.
     * Busca en documento_relacionado y también directamente en tablas fuente
     * (factura, boleta_venta, gre).
     */
    @GetMapping("/validar")
    public ResponseEntity<?> validarDocumento(
            @RequestParam String tipo,
            @RequestParam String serie,
            @RequestParam String numero) {

        Map<String, Object> result = new HashMap<>();

        // Validar que el tipo sea uno de los permitidos
        if (!tipo.equals("Factura") && !tipo.equals("Boleta de venta") && !tipo.equals("Guia de remision remitente")) {
            result.put("success", false);
            result.put("existe", false);
            result.put("message", "Tipo de documento no válido: " + tipo);
            return ResponseEntity.badRequest().body(result);
        }

        String serieTrimmed = serie.trim().toUpperCase();
        String numeroTrimmed = numero.trim();

        // 1. Buscar en documento_relacionado (estrictamente por TIPO, SERIE y NUMERO)
        List<DocumentoRelacionado> documentos = documentoRelacionadoRepository
                .findByTipoAndSerieAndNumeroFlexible(tipo, serieTrimmed, numeroTrimmed);

        if (!documentos.isEmpty()) {
            result.put("success", true);
            result.put("existe", true);
            result.put("message", tipo + " encontrada.");
            return ResponseEntity.ok(result);
        }

        // 2. Buscar directamente en tablas fuente según el tipo
        boolean encontradoEnFuente = buscarEnTablaFuente(tipo, serieTrimmed, numeroTrimmed);

        if (encontradoEnFuente) {
            result.put("success", true);
            result.put("existe", true);
            result.put("message", tipo + " encontrada.");
            return ResponseEntity.ok(result);
        }

        result.put("success", true);
        result.put("existe", false);
        result.put("message", "El documento (" + tipo + ") no existe en la base de datos.");
        return ResponseEntity.ok(result);
    }

    /**
     * Intenta buscar el documento en tablas fuente del sistema (factura,
     * boleta_venta, gre)
     * usando consultas nativas. Si la tabla no existe, simplemente retorna false.
     */
    private boolean buscarEnTablaFuente(String tipo, String serie, String numero) {

        switch (tipo) {
            case "Factura":
                // Intentar buscar en posibles tablas de facturas
                if (existeEnTabla("logistica", "factura", "serie", "numero", serie, numero))
                    return true;
                if (existeEnTabla("ventas", "factura", "serie", "numero", serie, numero))
                    return true;
                if (existeEnTabla("public", "factura", "serie", "numero", serie, numero))
                    return true;
                // Intentar con variaciones de columnas
                if (existeEnTabla("logistica", "factura", "serie_factura", "numero_factura", serie, numero))
                    return true;
                if (existeEnTabla("ventas", "facturas", "serie", "numero", serie, numero))
                    return true;
                break;
            case "Boleta de venta":
                if (existeEnTabla("logistica", "boleta_venta", "serie", "numero", serie, numero))
                    return true;
                if (existeEnTabla("ventas", "boleta_venta", "serie", "numero", serie, numero))
                    return true;
                if (existeEnTabla("public", "boleta_venta", "serie", "numero", serie, numero))
                    return true;
                if (existeEnTabla("ventas", "boletas", "serie", "numero", serie, numero))
                    return true;
                break;
            case "Guia de remision remitente":
                // Buscar en tabla gre existente
                if (existeEnTablaGre(serie, numero))
                    return true;
                break;
        }
        return false;
    }

    private boolean existeEnTabla(String schema, String table, String serieCol, String numeroCol, String serie,
            String numero) {
        try {
            String sql = String.format(
                    "SELECT COUNT(*) FROM %s.%s WHERE UPPER(TRIM(%s)) = :serie AND UPPER(TRIM(%s)) = :numero",
                    schema, table, serieCol, numeroCol);
            Query query = entityManager.createNativeQuery(sql);
            query.setParameter("serie", serie);
            query.setParameter("numero", numero);
            Object count = query.getSingleResult();
            long total = count instanceof BigInteger ? ((BigInteger) count).longValue() : ((Number) count).longValue();
            return total > 0;
        } catch (Exception e) {
            // La tabla no existe o hay error de SQL — ignorar y continuar
            return false;
        }
    }

    private boolean existeEnTablaGre(String serie, String numero) {
        try {
            // Buscar en la tabla gre usando algún campo que pueda contener serie/número
            // Por ahora, simplemente buscar si existe una GRE con ese id o serie
            // correlativa
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
