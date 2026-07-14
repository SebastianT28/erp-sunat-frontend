"use client"
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_BASE_URL } from '@/config/api';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

type DetalleSecuencia = {
  esquema: string;
  secuencia: string;
  tabla: string;
  valorActualizado: number;
  estado: string;
};

type FailbackResponse = {
  status: string;
  mensaje: string;
  tiempoEjecucionMs: number;
  tablasEvaluadas: number;
  secuenciasAlineadas: number;
  totalRegistrosMigrados: number;
  filasMigradasDetalle?: string[];
  detalleSecuencias: DetalleSecuencia[];
  timestamp: string;
};

export default function DrpPanel() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<FailbackResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEjecutarFailback = async () => {
    setIsSyncing(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/gerencia/drp/failback`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ mensaje: `Error de servidor HTTP ${res.status}` }));
        throw new Error(errorData.mensaje || `Fallo al sincronizar con el backend (Código ${res.status})`);
      }

      const data: FailbackResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al conectar con el servidor de contingencia.");
      console.error("Error en Failback DRP:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDescargarPDF = () => {
    if (!result) return;
    const doc = new jsPDF("p", "mm", "a4");
    const w = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header SUNAT ERP
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 99, 174); // #0063AE
    doc.text("SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA", w / 2, y, { align: "center" });
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("ACTA TÉCNICA DE CONTINUIDAD DE SERVICIOS Y REPARACIÓN (FAILBACK DRP)", w / 2, y, { align: "center" });
    y += 10;

    // Sello de Estado
    doc.setDrawColor(0, 150, 0);
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(14, y, w - 28, 16, 2, 2, "FD");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 120, 0);
    doc.text(`PARIDAD RESTABLECIDA CON ÉXITO [ESTADO: ${result.status}]`, 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Ejecutado por Administrador del Sistema — Fecha y Hora: ${new Date(result.timestamp).toLocaleString()}`, 18, y + 12);
    y += 22;

    // Resumen Ejecutivo de Métricas
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 99, 174);
    doc.text("1. Resumen Ejecutivo de Sincronización", 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Parámetro Evaluado", "Resultado Técnico"]],
      body: [
        ["Tiempo de Ejecución (Catch-up)", `${result.tiempoEjecucionMs} milisegundos`],
        ["Tablas y Entidades Auditadas", `${result.tablasEvaluadas} entidades globales`],
        ["Secuencias Alineadas (setval)", `${result.secuenciasAlineadas} de ${result.tablasEvaluadas} al 100%`],
        ["Filas Diferenciales Migradas", `${result.totalRegistrosMigrados} nuevos registros rescatados`],
      ],
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [0, 99, 174], textColor: [255, 255, 255], fontStyle: "bold" },
      theme: "grid",
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Detalle de Filas Migradas
    if (result.filasMigradasDetalle && result.filasMigradasDetalle.length > 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 99, 174);
      doc.text("2. Registros Diferenciales Migrados a Base Principal", 14, y);
      y += 4;

      const filasBody = result.filasMigradasDetalle.map((fila, idx) => [String(idx + 1), fila]);
      autoTable(doc, {
        startY: y,
        head: [["#", "Detalle de Registro / Entidad Rescatada"]],
        body: filasBody,
        styles: { fontSize: 7.5, cellPadding: 2 },
        headStyles: { fillColor: [0, 150, 0], textColor: [255, 255, 255], fontStyle: "bold" },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Auditoría de Secuencias
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 99, 174);
    doc.text("3. Auditoría Detallada de Secuencias Autoincrementables", 14, y);
    y += 4;

    const secuenciasBody = result.detalleSecuencias.map((item, idx) => [
      String(idx + 1),
      item.esquema,
      item.tabla,
      item.secuencia,
      String(item.valorActualizado),
      item.estado,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["#", "Esquema", "Tabla / Entidad", "Secuencia PostgreSQL", "Puntero ID", "Auditoría"]],
      body: secuenciasBody,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontStyle: "bold" },
      theme: "striped",
      margin: { left: 14, right: 14 },
    });

    // Guardar PDF
    doc.save(`Certificado_DRP_Failback_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col h-full overflow-y-auto relative bg-[#f4f6f9]">
      {/* Título Principal */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0063AE] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Continuidad DRP e Ingeniería del Caos (Failback)
          </h2>
          <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">
            Sincronización diferencial y alineación transaccional global (100% Tablas / 24 Secuencias)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleEjecutarFailback}
            disabled={isSyncing}
            className="bg-[#0063AE] text-white px-6 py-3 rounded-xl text-sm font-extrabold shadow-lg hover:bg-[#004d8a] hover:shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isSyncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sincronizando Servidores...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v-5"/></svg>
                Ejecutar Failback Automático (Catch-up)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tarjetas KPI de Estado del Clúster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:hidden">
        <div className="bg-white p-6 shadow-sm rounded-xl border-l-4 border-[#0063AE] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-wider">Topología de Servidores</h3>
            <span className="p-2 bg-blue-50 text-[#0063AE] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            </span>
          </div>
          <p className="text-2xl font-black text-gray-800 mt-2">Multi-Host Activo</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Supabase Principal + Réplica Lógica</p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-xl border-l-4 border-green-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-wider">Tolerancia de Conmutación</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </span>
          </div>
          <p className="text-2xl font-black text-gray-800 mt-2">Conmutación Rápida</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Recuperación automática (RTO &lt; 10s)</p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-xl border-l-4 border-orange-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-wider">Alcance del Failback</h3>
            <span className="p-2 bg-orange-50 text-orange-600 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
            </span>
          </div>
          <p className="text-2xl font-black text-gray-800 mt-2">100% (24 Tablas)</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Alineación global de contadores</p>
        </div>
      </div>

      {/* Banner explicativo de gestión y continuidad DRP para Administradores */}
      <div className="bg-gradient-to-r from-[#0063AE] to-[#003865] p-6 rounded-2xl text-white shadow-md mb-6 print:hidden">
        <h3 className="text-lg font-black flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Gestión de Continuidad de Negocio: Protocolo de Retorno a Base Principal (Failback DRP)
        </h3>
        <p className="text-sm text-blue-100 leading-relaxed max-w-4xl font-medium">
          Este módulo permite a la Administración de SUNAT sincronizar y restaurar la operación en el servidor principal tras un incidente de caída. Al presionar el botón de ejecución, el sistema detecta de forma automática todos los registros nuevos ingresados en la base de datos de contingencia (réplica) durante la emergencia y los migra de regreso a la base principal, emparejando los 24 contadores del sistema para garantizar el 100% de la integridad de los datos sin pérdida de información.
        </p>
      </div>

      {/* Mensaje de Error si ocurre */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6 animate-scale-in">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div>
            <p className="font-extrabold text-base">Atención: No se pudo completar la sincronización</p>
            <p className="text-xs text-red-600 font-medium mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Resultados de la Sincronización */}
      {result && (
        <div id="certificado-drp-print" className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
          <div className="p-6 bg-gradient-to-r from-green-600 to-green-800 text-white flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-green-700 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">Paridad Restablecida</span>
                <h3 className="text-xl font-black">Acta Técnica de Sincronización DRP</h3>
              </div>
              <p className="text-xs text-green-100 font-medium mt-1">
                Ejecutado por Administrador — {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleDescargarPDF}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargar PDF Oficial
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 border-b border-gray-100">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase">Estado General</p>
              <p className="text-lg font-black text-green-600 mt-1">{result.status}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase">Tiempo de Catch-up</p>
              <p className="text-lg font-black text-gray-800 mt-1">{result.tiempoEjecucionMs} ms</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase">Filtrado Diferencial</p>
              <p className="text-lg font-black text-[#0063AE] mt-1">{result.totalRegistrosMigrados} Filas Nuevas</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase">Secuencias Alineadas</p>
              <p className="text-lg font-black text-orange-600 mt-1">{result.secuenciasAlineadas} / {result.tablasEvaluadas}</p>
            </div>
          </div>

          <div className="p-6">
            {result.filasMigradasDetalle && result.filasMigradasDetalle.length > 0 && (
              <div className="mb-6 bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-extrabold text-[#0063AE] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Registros Diferenciales Migrados con Éxito a Base Principal:
                </h4>
                <ul className="list-disc list-inside text-xs font-bold text-gray-800 space-y-1">
                  {result.filasMigradasDetalle.map((fila, index) => (
                    <li key={index} className="font-mono bg-white px-2 py-1 rounded border border-blue-100">{fila}</li>
                  ))}
                </ul>
              </div>
            )}

            <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0063AE]"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Auditoría Detallada de las Secuencias del Sistema
            </h4>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-gray-100 font-extrabold text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Esquema</th>
                    <th className="px-4 py-3">Tabla / Entidad</th>
                    <th className="px-4 py-3">Secuencia Autoincrementable</th>
                    <th className="px-4 py-3 text-center">Nuevo Puntero (id)</th>
                    <th className="px-4 py-3 text-right">Auditoría DRP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
                  {result.detalleSecuencias.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-2.5 text-gray-400 font-bold">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-extrabold text-[#0063AE]">{item.esquema}</td>
                      <td className="px-4 py-2.5 font-bold text-gray-900">{item.tabla}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-600">{item.secuencia}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-black bg-gray-50">{item.valorActualizado}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[10px] border border-green-200">
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!result && !isSyncing && (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center my-auto flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0063AE] mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v-5"/></svg>
          </div>
          <h3 className="text-lg font-black text-gray-800">Sincronización en Espera</h3>
          <p className="text-xs text-gray-500 font-medium mt-1 max-w-md leading-relaxed">
            Pulsa el botón superior azul <b>"Ejecutar Failback Automático (Catch-up)"</b> cuando hayas retirado el prefijo <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono">CAIDO-</code> para resincronizar el 100% de las secuencias al nodo principal en tiempo real.
          </p>
        </div>
      )}
    </div>
  );
}
