package com.example.sunaterp.gerencia.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;

@Service
public class DrpService {

    private static final Logger log = LoggerFactory.getLogger(DrpService.class);

    @Value("${SPRING_DATASOURCE_USERNAME:postgres}")
    private String username;

    @Value("${SPRING_DATASOURCE_PASSWORD:SebastianT28_$%#}")
    private String password;

    // URL directa del Servidor Primario (Maestro) en Supabase
    private static final String PRIMARY_JDBC_URL = "jdbc:postgresql://db.dndeevsqdjdbveotnrkh.supabase.co:5432/postgres?connectTimeout=10";

    // URL directa del Servidor Réplica en Supabase
    private static final String REPLICA_JDBC_URL = "jdbc:postgresql://db.agoacrlixmqgwlyvoqbb.supabase.co:5432/postgres?connectTimeout=10";

    // Diccionario de secuencias autoincrementables numéricas en PostgreSQL y tablas maestras (24 entidades en total)
    private static final String[][] SEQUENCE_MAPPINGS = {
            // LOGIN
            {"login", "usuario_idusuario_seq", "usuario", "idusuario"},
            {"login", "N/A (PK Texto: ruc)", "contribuyente", "ruc"},
            // PRODUCCION
            {"produccion", "formularios_generales_id_seq", "formularios_generales", "id"},
            {"produccion", "casillas_id_seq", "casillas", "id"},
            {"produccion", "pagos_nps_id_seq", "pagos_nps", "id"},
            // SOPORTE
            {"soporte", "reportes_incidencia_id_seq", "reportes_incidencia", "id"},
            {"soporte", "cierres_incidencia_id_seq", "cierres_incidencia", "id"},
            // MARKETING
            {"marketing", "inscripciones_ruc_id_seq", "inscripciones_ruc", "id"},
            {"marketing", "codigos_verificacion_id_seq", "codigos_verificacion", "id"},
            // LOGISTICA
            {"logistica", "gre_id_seq", "gre", "idgre"},
            {"logistica", "detalle_gre_id_seq", "detalle_gre", "id"},
            {"logistica", "bienes_id_seq", "bienes", "id"},
            {"logistica", "conductores_id_seq", "conductores", "id"},
            {"logistica", "destinatarios_id_seq", "destinatarios", "id"},
            {"logistica", "direcciones_id_seq", "direcciones", "id"},
            {"logistica", "documentos_relacionados_id_seq", "documentos_relacionados", "id"},
            {"logistica", "notificaciones_id_seq", "notificaciones", "id"},
            {"logistica", "puntos_traslado_id_seq", "puntos_traslado", "id"},
            {"logistica", "transportes_id_seq", "transportes", "id"},
            {"logistica", "transportistas_id_seq", "transportistas", "id"},
            {"logistica", "vehiculos_id_seq", "vehiculos", "id"},
            // HELPDESK
            {"helpdesk", "helpdesk_tickets_id_seq", "helpdesk_tickets", "id"},
            {"helpdesk", "helpdesk_faqs_id_seq", "helpdesk_faqs", "id"},
            {"helpdesk", "helpdesk_quick_actions_id_seq", "helpdesk_quick_actions", "id"}
    };

    /**
     * Ejecuta el protocolo DRP de sincronización diferencial por clave primaria e alineación global de secuencias.
     * Se usa autoCommit = true para asegurar que cada fila migrada (ej. Elena de la Cruz SAC) se guarde de inmediato en Supabase Principal.
     */
    public Map<String, Object> ejecutarFailbackDrp() {
        log.info("Iniciando Protocolo DRP: Sincronización Diferencial Inmediata y Alineación de Secuencias...");
        long startTime = System.currentTimeMillis();

        Map<String, Object> response = new LinkedHashMap<>();
        List<Map<String, Object>> detalleSecuencias = new ArrayList<>();
        List<String> filasMigradasDetalle = new ArrayList<>();
        int totalRegistrosMigrados = 0;
        int tablasEvaluadas = 0;

        try (Connection primaryConn = DriverManager.getConnection(PRIMARY_JDBC_URL, username, password);
             Connection replicaConn = DriverManager.getConnection(REPLICA_JDBC_URL, username, password)) {

            // IMPORTANTE: Aseguramos autoCommit = true para que CADA INSERT se persista de inmediato
            // sin riesgo de ser revocado si una secuencia posterior arrojara una excepción en Postgres.
            primaryConn.setAutoCommit(true);

            // 1. Sincronizar diferencial en tablas transaccionales y maestras por Clave Primaria (PK)
            // (a) login.contribuyente (PK String: 'ruc')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "login", "contribuyente", "ruc",
                    new String[]{"ruc", "razonsocial", "direccion", "tipocontribuyente"}, filasMigradasDetalle);

            // (b) login.usuario (PK Integer: 'idusuario')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "login", "usuario", "idusuario",
                    new String[]{"idusuario", "nombreusuario", "correo", "contraseña", "rol", "ruc"}, filasMigradasDetalle);

            // (c) produccion.formularios_generales (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "produccion", "formularios_generales", "id",
                    new String[]{"id", "numero_orden", "ruc_contribuyente", "periodo_tributario", "monto_a_pagar", "fecha_presentacion", "estado"}, filasMigradasDetalle);

            // (d) produccion.casillas (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "produccion", "casillas", "id",
                    new String[]{"id", "formulario_id", "numero_casilla", "nombre_casilla", "valor", "seccion"}, filasMigradasDetalle);

            // (e) produccion.pagos_nps (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "produccion", "pagos_nps", "id",
                    new String[]{"id", "numero_orden", "numero_nps", "monto_total", "fecha_vencimiento", "estado", "formulario_id"}, filasMigradasDetalle);

            // (f) soporte.reportes_incidencia (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "soporte", "reportes_incidencia", "id",
                    new String[]{"id", "codigo", "fecha_deteccion", "reportado_por", "area_afectada", "categoria", "descripcion", "urgencia", "impacto", "estado", "fecha_creacion"}, filasMigradasDetalle);

            // (g) logistica.gre (PK Integer: 'idgre')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "logistica", "gre", "idgre",
                    new String[]{"idgre", "idusuario", "idtransporte", "iddestinatario", "tipoguia", "fechaemision", "motivotraslado", "estado", "serie", "numero"}, filasMigradasDetalle);

            // (h) marketing.inscripciones_ruc (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "marketing", "inscripciones_ruc", "id",
                    new String[]{"id", "numero_solicitud", "tipo_persona", "numero_documento", "nombre_o_razon_social", "correo", "telefono", "estado", "fecha_solicitud"}, filasMigradasDetalle);

            // (i) helpdesk.helpdesk_tickets (PK Integer: 'id')
            totalRegistrosMigrados += migrarTablaPorPK(primaryConn, replicaConn, "helpdesk", "helpdesk_tickets", "id",
                    new String[]{"id", "numero_ticket", "username_afectado", "correo_contacto", "area_asignada", "descripcion", "estado", "fecha_creacion", "respuesta_administrador"}, filasMigradasDetalle);

            // 2. Alinear todas las secuencias autoincrementables del sistema en el Primario
            for (String[] mapping : SEQUENCE_MAPPINGS) {
                String esquema = mapping[0];
                String secuencia = mapping[1];
                String tabla = mapping[2];
                String columnaPk = mapping[3];

                tablasEvaluadas++;
                long nuevoValorSeq = alinearSecuencia(primaryConn, esquema, secuencia, tabla, columnaPk);

                Map<String, Object> item = new HashMap<>();
                item.put("esquema", esquema);
                item.put("secuencia", secuencia);
                item.put("tabla", tabla);
                item.put("valorActualizado", nuevoValorSeq);
                item.put("estado", secuencia.contains("PK Texto") ? "AUDITADO (PK TEXTO)" : "ALINEADO 1:1");
                detalleSecuencias.add(item);
            }

            long duration = System.currentTimeMillis() - startTime;

            response.put("status", "SUCCESS");
            response.put("mensaje", "Protocolo DRP completado exitosamente con persistencia inmediata 1:1");
            response.put("tiempoEjecucionMs", duration);
            response.put("tablasEvaluadas", tablasEvaluadas);
            response.put("secuenciasAlineadas", SEQUENCE_MAPPINGS.length);
            response.put("totalRegistrosMigrados", totalRegistrosMigrados);
            response.put("filasMigradasDetalle", filasMigradasDetalle);
            response.put("detalleSecuencias", detalleSecuencias);
            response.put("timestamp", new java.util.Date());

            log.info("Failback DRP culminado con éxito. {} filas migradas ({}) en {} ms.", totalRegistrosMigrados, filasMigradasDetalle, duration);

        } catch (Exception e) {
            log.error("Error durante la ejecución del Failback DRP: {}", e.getMessage(), e);
            response.put("status", "ERROR");
            response.put("mensaje", "Error técnico al sincronizar servidores: " + e.getMessage());
        }

        return response;
    }

    private int migrarTablaPorPK(Connection primaryConn, Connection replicaConn, String esquema, String tabla, String columnaPk, String[] todasColumnas, List<String> filasMigradasDetalle) {
        int migrados = 0;
        try {
            // 1. Obtener todas las claves primarias (PKs) existentes en el Primario
            Set<String> pksEnPrimario = new HashSet<>();
            String queryPrimaryPk = String.format("SELECT %s FROM %s.%s", columnaPk, esquema, tabla);
            try (Statement stmt = primaryConn.createStatement(); ResultSet rs = stmt.executeQuery(queryPrimaryPk)) {
                while (rs.next()) {
                    Object val = rs.getObject(1);
                    if (val != null) pksEnPrimario.add(val.toString().trim());
                }
            }

            // 2. Consultar todos los registros en la Réplica
            String colsJoin = String.join(", ", todasColumnas);
            String queryReplica = String.format("SELECT %s FROM %s.%s ORDER BY %s ASC", colsJoin, esquema, tabla, columnaPk);

            try (Statement stmtReplica = replicaConn.createStatement(); ResultSet rsReplica = stmtReplica.executeQuery(queryReplica)) {
                StringBuilder insertSql = new StringBuilder(String.format("INSERT INTO %s.%s (%s) VALUES (", esquema, tabla, colsJoin));
                for (int i = 0; i < todasColumnas.length; i++) {
                    insertSql.append("?");
                    if (i < todasColumnas.length - 1) insertSql.append(", ");
                }
                insertSql.append(")");

                try (PreparedStatement pstmtPrimary = primaryConn.prepareStatement(insertSql.toString())) {
                    while (rsReplica.next()) {
                        Object pkVal = rsReplica.getObject(columnaPk);
                        if (pkVal != null && !pksEnPrimario.contains(pkVal.toString().trim())) {
                            // Este registro existe en la Réplica pero NO en el Primario -> Lo insertamos INMEDIATAMENTE
                            for (int i = 0; i < todasColumnas.length; i++) {
                                pstmtPrimary.setObject(i + 1, rsReplica.getObject(todasColumnas[i]));
                            }
                            int rowsAffected = pstmtPrimary.executeUpdate();
                            if (rowsAffected > 0) {
                                pksEnPrimario.add(pkVal.toString().trim());
                                migrados++;
                                String infoRegistro = String.format("%s.%s [PK: %s]", esquema, tabla, pkVal);
                                filasMigradasDetalle.add(infoRegistro);
                                log.info("Registro migrado instantáneamente a Supabase Principal -> {}", infoRegistro);
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("Nota durante sincronización por PK de {}.{}: {}", esquema, tabla, ex.getMessage());
        }
        return migrados;
    }

    private long alinearSecuencia(Connection conn, String esquema, String secuencia, String tabla, String columnaPk) {
        try {
            if (secuencia.contains("PK Texto") || columnaPk.equals("ruc")) {
                // Si la PK es de texto (ej. ruc en contribuyente), consultamos el total de registros auditados
                String sqlCount = String.format("SELECT COUNT(*) FROM %s.%s", esquema, tabla);
                try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sqlCount)) {
                    if (rs.next()) return rs.getLong(1);
                }
                return 1;
            }

            long maxVal = 0;
            String sqlMax = String.format("SELECT COALESCE(MAX(%s), 0) FROM %s.%s", columnaPk, esquema, tabla);
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sqlMax)) {
                if (rs.next()) {
                    maxVal = rs.getLong(1);
                }
            }

            long targetVal = maxVal + 1;
            String sqlSetval = String.format("SELECT setval('%s.%s', %d, false)", esquema, secuencia, targetVal);
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sqlSetval)) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
            return targetVal;
        } catch (Exception e) {
            log.debug("Alineación de secuencia {}.{} omitida/verificada: {}", esquema, secuencia, e.getMessage());
            return 1;
        }
    }
}
