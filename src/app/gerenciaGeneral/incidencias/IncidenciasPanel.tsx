"use client"
import React, { useState, useEffect } from 'react';

type Incidencia = {
  id: string;
  codigo: string;
  fechaDeteccion: string;
  reportadoPor: string;
  areaAfectada: string;
  descripcion: string;
  urgencia: string;
  impacto: string;
  estado: string; // Para tener un estado visual en la tabla
};

export default function IncidenciasPanel() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [codigo, setCodigo] = useState("");
  const [fechaDeteccion, setFechaDeteccion] = useState("");
  const [reportadoPor, setReportadoPor] = useState("");
  const [areaAfectada, setAreaAfectada] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [impacto, setImpacto] = useState("");

  // Generar datos mock iniciales al cargar
  useEffect(() => {
    const mockData: Incidencia[] = [
      {
        id: "1",
        codigo: "INC-001",
        fechaDeteccion: "2023-10-25T14:30",
        reportadoPor: "Juan Pérez",
        areaAfectada: "Área B (Logística)",
        descripcion: "Error al emitir guía de remisión, el sistema se queda cargando.",
        urgencia: "Alta",
        impacto: "Retraso en el despacho de 5 camiones.",
        estado: "Abierto"
      },
      {
        id: "2",
        codigo: "INC-002",
        fechaDeteccion: "2023-10-26T09:15",
        reportadoPor: "Ana Gómez",
        areaAfectada: "Infraestructura general",
        descripcion: "Caída temporal del servidor principal por 10 minutos.",
        urgencia: "Crítica",
        impacto: "Desconexión de todos los usuarios activos.",
        estado: "Resuelto"
      }
    ];
    setIncidencias(mockData);
  }, []);

  const openNewModal = () => {
    // Generar un código secuencial simple
    const nextNum = incidencias.length + 1;
    setCodigo(`INC-${nextNum.toString().padStart(3, '0')}`);
    
    // Auto-completar con la fecha actual
    const now = new Date();
    // Formato YYYY-MM-DDThh:mm compatible con input datetime-local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setFechaDeteccion(now.toISOString().slice(0,16));
    
    setReportadoPor("Administrador"); // Asumimos que lo registra el admin actual
    setAreaAfectada("");
    setDescripcion("");
    setUrgencia("");
    setImpacto("");
    setIsModalOpen(true);
  };

  const handleSaveIncidencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaAfectada || !urgencia || !descripcion) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    const nuevaIncidencia: Incidencia = {
      id: Date.now().toString(),
      codigo,
      fechaDeteccion,
      reportadoPor,
      areaAfectada,
      descripcion,
      urgencia,
      impacto,
      estado: "Abierto"
    };

    setIncidencias([nuevaIncidencia, ...incidencias]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este reporte de incidencia?")) {
      setIncidencias(incidencias.filter(i => i.id !== id));
    }
  };

  const filteredIncidencias = incidencias.filter(inc => 
    inc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inc.reportadoPor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-fade-in flex flex-col h-full overflow-hidden relative bg-[#f4f6f9]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#0063AE] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          Gestión de Incidencias
        </h2>
        
        <button 
          onClick={openNewModal}
          className="bg-[#0063AE] text-white px-5 py-2.5 rounded-lg text-sm font-extrabold shadow-md hover:bg-[#004d8a] hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Registrar Incidencia
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 shadow-sm flex items-center">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Buscar por código, usuario o descripción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0063AE] focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white flex-1 overflow-auto rounded-b-xl shadow-sm border border-t-0 border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 shadow-sm z-10">
            <tr>
              <th scope="col" className="px-6 py-4 font-extrabold">Código</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Fecha/Hora</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Área / Reportado Por</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Urgencia</th>
              <th scope="col" className="px-6 py-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidencias.length > 0 ? (
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
                    <div className="text-xs text-gray-500 font-medium">{inc.reportadoPor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border inline-block ${
                      inc.urgencia === 'Crítica' ? 'bg-red-100 text-red-800 border-red-200' :
                      inc.urgencia === 'Alta' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      inc.urgencia === 'Media' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {inc.urgencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleDelete(inc.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    <p className="font-bold text-lg text-gray-700">No hay incidencias registradas</p>
                    <p className="text-sm">Registra una nueva usando el botón superior.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL PARA REGISTRAR INCIDENCIA --- */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 flex flex-col animate-scale-in">
            <div className="bg-gradient-to-r from-[#0063AE] to-[#004d8a] p-5 flex justify-between items-center text-white rounded-t-2xl">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                Formato de Reporte de Incidente
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveIncidencia} className="p-6 flex flex-col gap-5 bg-gray-50/30">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Código de Incidente</label>
                  <input 
                    type="text" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-bold text-gray-700 bg-gray-100 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Fecha y hora de detección</label>
                  <input 
                    type="datetime-local" 
                    value={fechaDeteccion}
                    onChange={(e) => setFechaDeteccion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Reportado por</label>
                <input 
                  type="text" 
                  value={reportadoPor}
                  onChange={(e) => setReportadoPor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                  placeholder="Nombre de quien reporta"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Módulo / Área afectada <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {["Área A (Marketing)", "Área B (Logística)", "Área C (Producción)", "Área D (Gerencia)", "Infraestructura general"].map(area => (
                    <label key={area} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${areaAfectada === area ? 'border-[#0063AE] bg-blue-50 ring-1 ring-[#0063AE]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="areaAfectada" 
                        value={area} 
                        checked={areaAfectada === area}
                        onChange={(e) => setAreaAfectada(e.target.value)}
                        className="w-4 h-4 text-[#0063AE] focus:ring-[#0063AE] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Descripción del Incidente <span className="text-red-500">*</span></label>
                <textarea 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                  rows={3}
                  placeholder="Describe detalladamente el problema encontrado..."
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-2">Urgencia <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Crítica", color: "red" }, 
                    { label: "Alta", color: "orange" }, 
                    { label: "Media", color: "yellow" }, 
                    { label: "Baja", color: "green" }
                  ].map(u => (
                    <label key={u.label} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${urgencia === u.label ? `border-${u.color}-500 bg-${u.color}-50 ring-1 ring-${u.color}-500` : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="urgencia" 
                        value={u.label}
                        checked={urgencia === u.label}
                        onChange={(e) => setUrgencia(e.target.value)}
                        className={`w-4 h-4 text-${u.color}-500 focus:ring-${u.color}-500 cursor-pointer`}
                      />
                      <span className={`text-sm font-bold ${urgencia === u.label ? `text-${u.color}-700` : 'text-gray-600'}`}>{u.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wider block mb-1.5">Impacto en el usuario</label>
                <textarea 
                  value={impacto}
                  onChange={(e) => setImpacto(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                  rows={2}
                  placeholder="¿Cómo afecta este incidente a las operaciones o usuarios?"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#0063AE] text-white text-sm font-extrabold rounded-lg shadow-md hover:bg-[#004d8a] hover:shadow-lg transition-all"
                >
                  Guardar Incidente
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-scale-in {
          animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
