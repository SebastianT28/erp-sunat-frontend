"use client"
import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type CierreDTO = {
  id?: number;
  reporteId?: number;
  tipoIncidencia?: string;
  responsableResolucion?: string;
  horaInicioAtencion?: string;
  causaRaiz?: string;
  accionContencion?: string;
  requirioRollback?: string;
  tipoRollback?: string;
  horaResolucion?: string;
  tiempoTotalResolucion?: string;
  accionPreventiva?: string;
  estadoFinal?: string;
};

type Incidencia = {
  id: number;
  codigo: string;
  fechaDeteccion: string;
  reportadoPor: string;
  areaAfectada: string;
  categoria: string;
  descripcion: string;
  urgencia: string;
  impacto: string;
  estado: string;
  fechaCreacion?: string;
  cierre?: CierreDTO;
};

function getAuthHeaders(): Record<string, string> {
  let token = null;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token;
      } catch (e) {}
    }
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function IncidenciasPanel() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCierreModalOpen, setIsCierreModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [incidenciaActiva, setIncidenciaActiva] = useState<Incidencia | null>(null);
  const [pdfType, setPdfType] = useState<'reporte' | 'cierre' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states - Registro
  const [codigo, setCodigo] = useState("");
  const [fechaDeteccion, setFechaDeteccion] = useState("");
  const [reportadoPor, setReportadoPor] = useState("");
  const [areaAfectada, setAreaAfectada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [impacto, setImpacto] = useState("");

  // Form states - Cierre
  const [tipoCierre, setTipoCierre] = useState("");
  const [responsableResolucion, setResponsableResolucion] = useState("");
  const [horaInicioAtencion, setHoraInicioAtencion] = useState("");
  const [causaRaiz, setCausaRaiz] = useState("");
  const [accionContencion, setAccionContencion] = useState("");
  const [requirioRollback, setRequirioRollback] = useState("");
  const [tipoRollback, setTipoRollback] = useState("");
  const [horaResolucion, setHoraResolucion] = useState("");
  const [tiempoTotalResolucion, setTiempoTotalResolucion] = useState("");
  const [accionPreventiva, setAccionPreventiva] = useState("");
  const [estadoFinal, setEstadoFinal] = useState("");

  // ----- API CALLS -----

  const fetchIncidencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/soporte/incidencias`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Incidencia[] = await res.json();
      setIncidencias(data);
    } catch (err) {
      setError("No se pudieron cargar las incidencias. Verifique la conexión con el servidor.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidencias();
  }, [fetchIncidencias]);

  const generarCodigo = () => {
    const nextNum = incidencias.length + 1;
    return `INC-${nextNum.toString().padStart(3, '0')}`;
  };

  const openNewModal = () => {
    setCodigo(generarCodigo());
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setFechaDeteccion(now.toISOString().slice(0, 16));
    setReportadoPor("Administrador");
    setAreaAfectada("");
    setCategoria("");
    setDescripcion("");
    setUrgencia("");
    setImpacto("");
    setIsModalOpen(true);
  };

  const handleSaveIncidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaAfectada || !urgencia || !descripcion || !categoria) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }
    setIsSaving(true);
    try {
      const body = { codigo, fechaDeteccion, reportadoPor, areaAfectada, categoria, descripcion, urgencia, impacto };
      const res = await fetch(`${API_BASE}/api/soporte/incidencias`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert("Error al guardar: " + msg);
        return;
      }
      setIsModalOpen(false);
      await fetchIncidencias();
    } catch (err) {
      alert("Error de conexión al guardar la incidencia.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const openCierreModal = (inc: Incidencia) => {
    setIncidenciaActiva(inc);
    const c = inc.cierre;
    setTipoCierre(c?.tipoIncidencia || "");
    setResponsableResolucion(c?.responsableResolucion || "");
    setHoraInicioAtencion(c?.horaInicioAtencion ? c.horaInicioAtencion.slice(0, 16) : "");
    setCausaRaiz(c?.causaRaiz || "");
    setAccionContencion(c?.accionContencion || "");
    setRequirioRollback(c?.requirioRollback || "");
    setTipoRollback(c?.tipoRollback || "");
    setHoraResolucion(c?.horaResolucion ? c.horaResolucion.slice(0, 16) : "");
    setTiempoTotalResolucion(c?.tiempoTotalResolucion || "");
    setAccionPreventiva(c?.accionPreventiva || "");
    setEstadoFinal(c?.estadoFinal || "");
    setIsCierreModalOpen(true);
  };

  const handleSaveCierre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidenciaActiva || !tipoCierre || !estadoFinal) {
      alert("Por favor complete los campos obligatorios del cierre.");
      return;
    }
    setIsSaving(true);
    try {
      const body = {
        tipoIncidencia: tipoCierre, responsableResolucion, horaInicioAtencion,
        causaRaiz, accionContencion, requirioRollback, tipoRollback,
        horaResolucion, tiempoTotalResolucion, accionPreventiva, estadoFinal,
      };
      const res = await fetch(`${API_BASE}/api/soporte/incidencias/${incidenciaActiva.id}/cierre`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert("Error al guardar el cierre: " + msg);
        return;
      }
      setIsCierreModalOpen(false);
      await fetchIncidencias();
    } catch (err) {
      alert("Error de conexión al guardar el cierre.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este reporte de incidencia?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/soporte/incidencias/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        alert("Error al eliminar la incidencia.");
        return;
      }
      await fetchIncidencias();
    } catch (err) {
      alert("Error de conexión al eliminar.");
      console.error(err);
    }
  };

  const handlePrintPdf = () => window.print();

  const filteredIncidencias = incidencias.filter(inc =>
    inc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.reportadoPor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 animate-fade-in flex flex-col h-full overflow-y-auto relative bg-[#f4f6f9]">

      {/* Contenido principal */}
      <div className="print:hidden flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-extrabold text-[#0063AE] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            Gestión de Incidencias
          </h2>
          <div className="flex gap-3">
            <a
              href="https://fondbanister1606.grafana.net/public-dashboards/73fb293cd7334e54b406d06913ce38e2"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-extrabold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Ver métricas de incidencias
            </a>
            <button onClick={openNewModal} className="bg-[#0063AE] text-white px-5 py-2.5 rounded-lg text-sm font-extrabold shadow-md hover:bg-[#004d8a] hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Registrar Incidencia
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Buscar por código, usuario o descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0063AE] focus:border-transparent text-sm text-black placeholder-gray-500 transition-all" />
          </div>
          <button onClick={fetchIncidencias} className="ml-3 p-2 rounded-lg text-gray-400 hover:text-[#0063AE] hover:bg-blue-50 transition-colors" title="Actualizar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          </button>
        </div>

        {/* Estado de carga y error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white overflow-hidden overflow-x-auto rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-extrabold">Código</th>
                <th scope="col" className="px-6 py-4 font-extrabold">Fecha/Hora</th>
                <th scope="col" className="px-6 py-4 font-extrabold">Área / Categoría</th>
                <th scope="col" className="px-6 py-4 font-extrabold text-center">Estado / Urgencia</th>
                <th scope="col" className="px-6 py-4 font-extrabold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-3">
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Cargando incidencias...
                  </div>
                </td></tr>
              ) : filteredIncidencias.length > 0 ? (
                filteredIncidencias.map((inc) => (
                  <tr key={inc.id} className="bg-white border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded border text-xs">{inc.codigo}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {new Date(inc.fechaDeteccion).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0063AE]">{inc.areaAfectada}</div>
                      <div className="text-xs text-gray-500 font-medium">{inc.categoria}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border inline-block ${inc.estado === 'Abierto' ? 'bg-blue-100 text-blue-800 border-blue-200' : inc.estado.includes('Resuelto') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>{inc.estado}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border inline-block ${inc.urgencia === 'Crítica' ? 'bg-red-50 text-red-700 border-red-200' : inc.urgencia === 'Alta' ? 'bg-orange-50 text-orange-700 border-orange-200' : inc.urgencia === 'Media' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{inc.urgencia}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openCierreModal(inc)} className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-bold shadow-sm flex items-center gap-1 ${inc.estado !== 'Abierto' ? 'text-green-700 bg-green-100 hover:bg-green-200 border border-green-200' : 'text-white bg-green-600 hover:bg-green-700'}`} title={inc.estado !== 'Abierto' ? "Ver/Editar Cierre" : "Adjuntar Cierre"}>
                          {inc.estado !== 'Abierto' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          )}
                          Cierre
                        </button>
                        <button onClick={() => handleDelete(inc.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors" title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    <p className="font-bold text-lg text-gray-700">No hay incidencias registradas</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* APARTADO DE DOCUMENTOS PDF */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-4 mb-10">
          <h3 className="text-lg font-extrabold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12v6"/><path d="M8 15h4"/><path d="M16 12v6"/></svg>
            Exportar / Ver Documentos (PDF)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidencias.map(inc => (
              <div key={`pdf-${inc.id}`} className="flex flex-col border border-gray-200 rounded-lg hover:border-[#0063AE] transition-all bg-gray-50 overflow-hidden">
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-[#0063AE] text-white px-2 py-0.5 rounded text-xs font-bold">{inc.codigo}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{inc.estado}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 truncate" title={inc.descripcion}>{inc.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(inc.fechaDeteccion).toLocaleDateString()}</p>
                </div>
                <div className="flex border-t border-gray-200 bg-white">
                  <button onClick={() => { setIncidenciaActiva(inc); setPdfType('reporte'); setIsPdfModalOpen(true); }} className="flex-1 py-3 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors flex justify-center items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Reporte
                  </button>
                  {inc.cierre && (
                    <button onClick={() => { setIncidenciaActiva(inc); setPdfType('cierre'); setIsPdfModalOpen(true); }} className="flex-1 py-3 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors border-l border-gray-200 flex justify-center items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Cierre
                    </button>
                  )}
                </div>
              </div>
            ))}
            {incidencias.length === 0 && !isLoading && (
              <div className="col-span-full py-8 text-center text-sm text-gray-400">Aún no hay documentos para exportar.</div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL REGISTRAR INCIDENCIA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[95vh] animate-scale-in">
            <div className="bg-gradient-to-r from-[#0063AE] to-[#004d8a] p-5 flex justify-between items-center text-white rounded-t-2xl shrink-0">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                Formato de Reporte de Incidente
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveIncidencia} className="p-6 flex flex-col gap-5 bg-gray-50 overflow-y-auto rounded-b-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Código de Incidente</label>
                  <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-bold text-gray-700 bg-gray-100 focus:outline-none" readOnly />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Fecha y hora de detección</label>
                  <input type="datetime-local" value={fechaDeteccion} onChange={(e) => setFechaDeteccion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Reportado por</label>
                <input type="text" value={reportadoPor} onChange={(e) => setReportadoPor(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none" placeholder="Nombre de quien reporta" required />
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Módulo / Área afectada <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {["Área A (Marketing)", "Área B (Logística)", "Área C (Producción)", "Área D (Gerencia)", "Infraestructura general"].map(area => (
                    <label key={area} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${areaAfectada === area ? 'border-[#0063AE] bg-blue-50 ring-1 ring-[#0063AE]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="areaAfectada" value={area} checked={areaAfectada === area} onChange={(e) => setAreaAfectada(e.target.value)} className="w-4 h-4 text-[#0063AE] focus:ring-[#0063AE] cursor-pointer" />
                      <span className="text-sm font-medium text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Categoría <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {["Infraestructura", "Aplicaciones", "Base de datos", "Redes y comunicaciones", "Seguridad", "Documentación", "Otros"].map(cat => (
                    <label key={cat} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all select-none ${categoria === cat ? 'border-[#0063AE] bg-blue-50 ring-1 ring-[#0063AE]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="categoria" value={cat} checked={categoria === cat} onChange={(e) => setCategoria(e.target.value)} className="w-4 h-4 text-[#0063AE] focus:ring-[#0063AE] cursor-pointer" />
                      <span className={`text-sm font-medium ${categoria === cat ? 'text-[#0063AE] font-bold' : 'text-gray-700'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Descripción del Incidente <span className="text-red-500">*</span></label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none" rows={3} placeholder="Describe detalladamente el problema encontrado..." required />
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Urgencia <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {[{ label: "Crítica", color: "red" }, { label: "Alta", color: "orange" }, { label: "Media", color: "yellow" }, { label: "Baja", color: "green" }].map(u => (
                    <label key={u.label} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${urgencia === u.label ? `border-${u.color}-500 bg-${u.color}-50 ring-1 ring-${u.color}-500` : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="urgencia" value={u.label} checked={urgencia === u.label} onChange={(e) => setUrgencia(e.target.value)} className={`w-4 h-4 text-${u.color}-500 focus:ring-${u.color}-500 cursor-pointer`} />
                      <span className={`text-sm font-bold ${urgencia === u.label ? `text-${u.color}-700` : 'text-gray-600'}`}>{u.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Impacto en el usuario</label>
                <textarea value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none" rows={2} placeholder="¿Cómo afecta este incidente a las operaciones o usuarios?" />
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 pb-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-[#0063AE] text-white text-sm font-extrabold rounded-lg shadow-md hover:bg-[#004d8a] hover:shadow-lg transition-all disabled:opacity-60">
                  {isSaving ? "Guardando..." : "Guardar Incidente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CIERRE DE INCIDENCIA --- */}
      {isCierreModalOpen && incidenciaActiva && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] animate-scale-in">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-5 flex justify-between items-center text-white rounded-t-2xl shrink-0">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Formato de Cierre de Incidente
              </h3>
              <button onClick={() => setIsCierreModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveCierre} className="p-6 flex flex-col gap-5 bg-gray-50 overflow-y-auto rounded-b-2xl">
              <div className="flex flex-wrap md:flex-nowrap gap-4 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Código de Incidente</label>
                  <span className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded border shadow-sm">{incidenciaActiva.codigo}</span>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Urgencia Inicial</label>
                  <span className="text-sm font-bold text-gray-800">{incidenciaActiva.urgencia}</span>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Categoría Inicial</label>
                  <span className="text-sm font-bold text-[#0063AE]">{incidenciaActiva.categoria}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Tipo <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Disponibilidad", "Autenticación", "Lógica de negocio", "Rendimiento", "Frontend/UI", "Backend/API"].map(t => (
                    <label key={t} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all select-none ${tipoCierre === t ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="tipoCierre" value={t} checked={tipoCierre === t} onChange={(e) => setTipoCierre(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-600 cursor-pointer accent-green-600" />
                      <span className={`text-sm font-medium ${tipoCierre === t ? 'text-green-700 font-bold' : 'text-gray-700'}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Responsable de resolución <span className="text-red-500">*</span></label>
                  <input type="text" value={responsableResolucion} onChange={(e) => setResponsableResolucion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" placeholder="Ej. Ing. Carlos Pérez" required />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Hora de inicio de atención <span className="text-red-500">*</span></label>
                  <input type="datetime-local" value={horaInicioAtencion} onChange={(e) => setHoraInicioAtencion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Causa raíz identificada <span className="text-red-500">*</span></label>
                <textarea value={causaRaiz} onChange={(e) => setCausaRaiz(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" rows={2} placeholder="Explique el origen del problema..." required />
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Acción de contención aplicada</label>
                <textarea value={accionContencion} onChange={(e) => setAccionContencion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" rows={2} placeholder="¿Qué medidas inmediatas se tomaron?" />
              </div>
              <div className="p-4 border rounded-xl bg-white border-gray-200">
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-3">¿Requiere Rollback?</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    {["Sí", "No", "No aplica"].map(r => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="requirioRollback" value={r} checked={requirioRollback === r} onChange={(e) => { setRequirioRollback(e.target.value); if (e.target.value !== "Sí") setTipoRollback(""); }} className="w-4 h-4 accent-green-600 cursor-pointer" />
                        <span className="text-sm font-medium text-gray-700">{r}</span>
                      </label>
                    ))}
                  </div>
                  {requirioRollback === "Sí" && (
                    <div className="mt-2 pl-4 border-l-2 border-green-200">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">Tipo de Rollback</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {["git revert", "Rollback de contenedor Docker", "Otro"].map(tr => (
                          <label key={tr} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tipoRollback" value={tr} checked={tipoRollback === tr} onChange={(e) => setTipoRollback(e.target.value)} className="w-4 h-4 accent-green-600 cursor-pointer" />
                            <span className="text-sm font-medium text-gray-700">{tr}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Hora de resolución</label>
                  <input type="datetime-local" value={horaResolucion} onChange={(e) => setHoraResolucion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Tiempo total de resolución</label>
                  <input type="text" value={tiempoTotalResolucion} onChange={(e) => setTiempoTotalResolucion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" placeholder="Ej. 2 horas 30 minutos" />
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Acción preventiva definida</label>
                <textarea value={accionPreventiva} onChange={(e) => setAccionPreventiva(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-green-600 focus:outline-none" rows={2} placeholder="¿Qué se hará para evitar que vuelva a ocurrir?" />
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Estado Final <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {["Resuelto", "Resuelto con seguimiento", "Reabierto"].map(ef => (
                    <label key={ef} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${estadoFinal === ef ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input type="radio" name="estadoFinal" value={ef} checked={estadoFinal === ef} onChange={(e) => setEstadoFinal(e.target.value)} className="w-4 h-4 accent-green-600 cursor-pointer" />
                      <span className={`text-sm font-bold ${estadoFinal === ef ? 'text-green-700' : 'text-gray-600'}`}>{ef}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 pb-2">
                <button type="button" onClick={() => setIsCierreModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-green-600 text-white text-sm font-extrabold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {isSaving ? "Guardando..." : "Confirmar Cierre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL VISTA PDF --- */}
      {isPdfModalOpen && incidenciaActiva && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl print:hidden">
              <h3 className="font-extrabold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                Vista previa — {pdfType === 'reporte' ? 'Reporte' : 'Cierre'} ({incidenciaActiva.codigo})
              </h3>
              <div className="flex gap-2">
                <button onClick={handlePrintPdf} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                  Guardar PDF / Imprimir
                </button>
                <button onClick={() => setIsPdfModalOpen(false)} className="w-9 h-9 flex justify-center items-center rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-200 flex-1 print:p-0 print:bg-white print:overflow-visible">
              <div className="print-area max-w-[21cm] mx-auto bg-white shadow-lg print:shadow-none p-10 md:p-14 print:p-0 text-black text-sm">
                <div className="border-b-2 border-gray-800 pb-6 mb-8 print:pb-4 print:mb-4 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-black uppercase mb-1 print:text-2xl">{pdfType === 'reporte' ? 'Reporte de Incidencia' : 'Cierre de Incidencia'}</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Sistema ERP - SUNAT</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-2xl print:text-xl">{incidenciaActiva.codigo}</p>
                    <p className="text-sm text-gray-600 font-bold mt-1">Generado: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                {pdfType === 'reporte' ? (
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      {[
                        ["Fecha y Hora de Detección:", new Date(incidenciaActiva.fechaDeteccion).toLocaleString()],
                        ["Reportado por:", incidenciaActiva.reportadoPor],
                        ["Módulo/Área Afectada:", incidenciaActiva.areaAfectada],
                        ["Categoría:", incidenciaActiva.categoria],
                        ["Urgencia:", incidenciaActiva.urgencia],
                        ["Descripción del Incidente:", incidenciaActiva.descripcion],
                        ["Impacto en el Usuario:", incidenciaActiva.impacto || "No especificado"],
                      ].map(([label, value]) => (
                        <tr key={label as string} className="border-b border-gray-300">
                          <td className="p-3 print:p-2 bg-gray-50 font-bold w-1/3 border-r border-gray-300 align-top">{label}</td>
                          <td className="p-3 print:p-2 font-medium whitespace-pre-wrap">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      {[
                        ["Tipo de Incidencia:", incidenciaActiva.cierre?.tipoIncidencia || "-"],
                        ["Responsable de Resolución:", incidenciaActiva.cierre?.responsableResolucion || "-"],
                        ["Hora de Inicio de Atención:", incidenciaActiva.cierre?.horaInicioAtencion ? new Date(incidenciaActiva.cierre.horaInicioAtencion).toLocaleString() : "-"],
                        ["Causa Raíz Identificada:", incidenciaActiva.cierre?.causaRaiz || "-"],
                        ["Acción de Contención:", incidenciaActiva.cierre?.accionContencion || "-"],
                        ["¿Requirió Rollback?:", `${incidenciaActiva.cierre?.requirioRollback || "-"}${incidenciaActiva.cierre?.requirioRollback === 'Sí' && incidenciaActiva.cierre?.tipoRollback ? ` (${incidenciaActiva.cierre.tipoRollback})` : ''}`],
                        ["Hora de Resolución:", incidenciaActiva.cierre?.horaResolucion ? new Date(incidenciaActiva.cierre.horaResolucion).toLocaleString() : "-"],
                        ["Tiempo Total:", incidenciaActiva.cierre?.tiempoTotalResolucion || "-"],
                        ["Acción Preventiva:", incidenciaActiva.cierre?.accionPreventiva || "-"],
                        ["Estado Final:", incidenciaActiva.cierre?.estadoFinal || incidenciaActiva.estado],
                      ].map(([label, value]) => (
                        <tr key={label as string} className="border-b border-gray-300">
                          <td className="p-3 print:p-2 bg-gray-50 font-bold w-1/3 border-r border-gray-300 align-top">{label}</td>
                          <td className="p-3 print:p-2 font-medium whitespace-pre-wrap">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="mt-20 pt-10 print:mt-10 print:pt-4 border-t border-gray-300 flex justify-between">
                  <div className="text-center w-1/3"><div className="border-b border-gray-400 h-8 mb-2"></div><p className="font-bold text-xs">Firma del Reportante</p></div>
                  <div className="text-center w-1/3"><div className="border-b border-gray-400 h-8 mb-2"></div><p className="font-bold text-xs">Firma de Aprobación</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          body * { 
            visibility: hidden; 
          }
          
          .print-area, .print-area * { 
            visibility: visible; 
          }

          .print-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }

          /* FORZAR 1 SOLA PÁGINA: Eliminar scroll fantasma y alturas desbordadas */
          html, body {
            height: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
