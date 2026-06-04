"use client"
import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_TICKETS = [
  { id: 'TK-1045', usuario: 'Anon (104593820)', email: 'anon@correo.com', area: 'Soporte Técnico', fecha: '2026-06-04 09:30', estado: 'Pendiente' },
  { id: 'TK-1044', usuario: 'Empresa XYZ', email: 'contacto@xyz.com', area: 'Facturación', fecha: '2026-06-03 15:20', estado: 'En Proceso' },
  { id: 'TK-1043', usuario: 'Juan Pérez', email: 'juan.p@gmail.com', area: 'Consultas Generales', fecha: '2026-06-03 11:10', estado: 'Resuelto' },
  { id: 'TK-1042', usuario: 'Anon (99382711)', email: 'urgente@empresa.pe', area: 'Soporte Técnico', fecha: '2026-06-02 16:45', estado: 'Resuelto' },
  { id: 'TK-1041', usuario: 'Consultora ABC', email: 'admin@abc.com.pe', area: 'Facturación', fecha: '2026-06-02 10:05', estado: 'Pendiente' },
];

export default function HelpdeskPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");

  // Filtramos los tickets
  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Todos" || ticket.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 animate-fade-in flex flex-col h-full overflow-hidden">
      <h2 className="text-2xl font-extrabold text-[#0063AE] mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
        Gestión de Tickets y Bot (HelpDesk)
      </h2>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-[#0063AE] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">Total Tickets</h3>
            <span className="p-2 bg-blue-50 text-[#0063AE] rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
            </span>
          </div>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">1,245</p>
          <p className="text-xs text-green-600 mt-2 flex items-center font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            +12% este mes
          </p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-green-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">Resoluciones Automáticas</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </span>
          </div>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">68%</p>
          <p className="text-xs text-gray-400 mt-2 font-semibold">Consultas resueltas por el Bot</p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-red-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">Tickets Pendientes</h3>
            <span className="p-2 bg-red-50 text-red-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
          </div>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">2</p>
          <p className="text-xs text-gray-400 mt-2 font-semibold">Requieren atención inmediata</p>
        </div>
      </div>

      {/* --- CONTROLES Y FILTROS --- */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 items-center mt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por ID de Ticket o Usuario..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0063AE] focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Filtrar Estado:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#0063AE] focus:border-[#0063AE] block w-full p-2 outline-none font-medium"
          >
            <option value="Todos">Todos los Tickets</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      {/* --- TABLA DE TICKETS --- */}
      <div className="bg-white flex-1 overflow-auto rounded-b-xl shadow-sm border border-t-0 border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 shadow-sm z-10">
            <tr>
              <th scope="col" className="px-6 py-4 font-extrabold">ID Ticket</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Usuario / Correo</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Área Asignada</th>
              <th scope="col" className="px-6 py-4 font-extrabold">Fecha Reg.</th>
              <th scope="col" className="px-6 py-4 font-extrabold text-center">Estado</th>
              <th scope="col" className="px-6 py-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, idx) => (
                <tr key={idx} className="bg-white border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0063AE]"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                      {ticket.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{ticket.usuario}</div>
                    <div className="text-xs text-gray-400">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {ticket.area}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {ticket.fecha}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ticket.estado === 'Resuelto' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : ticket.estado === 'En Proceso'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {ticket.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#0063AE] hover:text-[#004d8a] font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <p className="font-semibold text-lg">No se encontraron tickets</p>
                    <p className="text-sm">Prueba con otro filtro o término de búsqueda.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
