"use client"
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function HelpdeskPanel() {
  const [activeSection, setActiveSection] = useState<'tickets' | 'config'>('tickets');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  
  // Data States
  const [tickets, setTickets] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  
  // Modals / Forms
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState("");

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [newFaqPregunta, setNewFaqPregunta] = useState("");
  const [newFaqRespuesta, setNewFaqRespuesta] = useState("");

  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [newQuickActionLabel, setNewQuickActionLabel] = useState("");

  const fetchData = async () => {
    try {
      const [tRes, fRes, qRes] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/api/helpdesk/tickets/all`),
        fetchWithAuth(`${API_BASE_URL}/api/helpdesk/faqs`),
        fetchWithAuth(`${API_BASE_URL}/api/helpdesk/quick-actions`)
      ]);
      if (tRes.ok) setTickets(await tRes.json());
      if (fRes.ok) setFaqs(await fRes.json());
      if (qRes.ok) setQuickActions(await qRes.json());
    } catch (err) {
      console.error("Error fetching helpdesk data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/helpdesk/tickets/${selectedTicket.numeroTicket}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          estado: ticketStatusUpdate || selectedTicket.estado,
          respuestaAdministrador: adminResponse
        })
      });
      if (res.ok) {
        setSelectedTicket(null);
        setAdminResponse("");
        setTicketStatusUpdate("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleQuickAction = async (id: number) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/helpdesk/quick-actions/${id}/toggle`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta FAQ?")) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/helpdesk/faqs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFaq = async () => {
    if (!newFaqPregunta.trim() || !newFaqRespuesta.trim()) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/helpdesk/faqs`, {
        method: 'POST',
        body: JSON.stringify({ pregunta: newFaqPregunta, respuesta: newFaqRespuesta, activo: true })
      });
      if (res.ok) {
        setNewFaqPregunta("");
        setNewFaqRespuesta("");
        setIsFaqModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuickAction = async () => {
    if (!newQuickActionLabel.trim()) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/helpdesk/quick-actions`, {
        method: 'POST',
        body: JSON.stringify({ label: newQuickActionLabel, activo: true, orden: quickActions.length + 1 })
      });
      if (res.ok) {
        setNewQuickActionLabel("");
        setIsQuickActionModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtramos los tickets
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    const idMatches = ticket.numeroTicket?.toLowerCase().includes(searchLower);
    const userMatches = ticket.usernameAfectado?.toLowerCase().includes(searchLower) || ticket.correoContacto?.toLowerCase().includes(searchLower);
    const matchesSearch = idMatches || userMatches;
    const matchesStatus = filterStatus === "Todos" || ticket.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const resueltos = tickets.filter(t => t.estado === 'RESUELTO').length;
  const total = tickets.length;
  const resolucionPorcentaje = total > 0 ? Math.round((resueltos / total) * 100) : 0;
  const pendientes = tickets.filter(t => t.estado === 'PENDIENTE').length;

  return (
    <div className="p-8 animate-fade-in flex flex-col h-full overflow-hidden relative">
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
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{total}</p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-green-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">Tasa de Resolución</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </span>
          </div>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{resolucionPorcentaje}%</p>
        </div>

        <div className="bg-white p-6 shadow-sm rounded-lg border-l-4 border-red-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-extrabold text-sm uppercase tracking-wider">Tickets Pendientes</h3>
            <span className="p-2 bg-red-50 text-red-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
          </div>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{pendientes}</p>
        </div>
      </div>

      {/* --- NAVEGACIÓN DE PESTAÑAS INTERNAS --- */}
      <div className="flex gap-2 border-b border-gray-200 mb-4 px-2">
        <button 
          onClick={() => setActiveSection('tickets')}
          className={`py-3 px-4 font-bold text-sm transition-all border-b-2 ${
            activeSection === 'tickets' 
              ? 'border-[#0063AE] text-[#0063AE]' 
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Bandeja de Gestión de Tickets
        </button>
        <button 
          onClick={() => setActiveSection('config')}
          className={`py-3 px-4 font-bold text-sm transition-all border-b-2 ${
            activeSection === 'config' 
              ? 'border-[#0063AE] text-[#0063AE]' 
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Configuración de Sunny Bot (Base de Conocimiento)
        </button>
      </div>

      {/* --- SECCIÓN: TICKETS --- */}
      {activeSection === 'tickets' && (
        <>
          <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 items-center mt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text" 
                  placeholder="Buscar por ID de Ticket o Usuario..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0063AE] focus:border-transparent text-sm text-black transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Filtrar Estado:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#0063AE] focus:border-[#0063AE] block w-full p-2 outline-none font-medium"
              >
                <option value="Todos">Todos los Tickets</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="RESUELTO">Resuelto</option>
              </select>
            </div>
          </div>

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
                          {ticket.numeroTicket}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{ticket.usernameAfectado}</div>
                        <div className="text-xs text-gray-400">{ticket.correoContacto}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {ticket.areaAsignada}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(ticket.fechaCreacion).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                          ticket.estado === 'RESUELTO' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : ticket.estado === 'EN_PROCESO'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {ticket.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setAdminResponse(ticket.respuestaAdministrador || "");
                              setTicketStatusUpdate(ticket.estado);
                            }}
                            className="text-[#0063AE] hover:text-[#004d8a] font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                          >
                            Gestionar
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <p className="font-semibold text-lg text-gray-800">No se encontraron tickets</p>
                        <p className="text-sm">Prueba con otro filtro o término de búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- SECCIÓN: CONFIGURACIÓN BASE CONOCIMIENTO --- */}
      {activeSection === 'config' && (
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          
          {/* Gestor de FAQs */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-[#0063AE] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                Editor de Preguntas Frecuentes
              </h3>
              <button 
                onClick={() => setIsFaqModalOpen(true)}
                className="bg-[#0063AE] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#004d8a] transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Nueva FAQ
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-3">
              {faqs.map(faq => (
                <div key={faq.id} className={`border ${faq.activo ? 'border-gray-200' : 'border-red-200 bg-red-50/30'} rounded-lg p-4 hover:border-[#0063AE] transition-colors group`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold text-sm pr-4 ${faq.activo ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{faq.pregunta}</h4>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteFaq(faq.id)} className="text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.respuesta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gestor de Quick Actions */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-green-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 2.5-5-1.5 1.5 5-2.5 2 2.5 2-1.5 5 5-1.5 2 2.5 2-2.5 5 1.5-1.5-5 2.5-2-2.5-2 1.5-5-5 1.5Z"/></svg>
                Quick Actions
              </h3>
              <button 
                onClick={() => setIsQuickActionModalOpen(true)}
                className="text-green-600 bg-green-50 p-1.5 rounded hover:bg-green-100 transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-2">
              {quickActions.map(action => (
                <div key={action.id} className={`flex justify-between items-center p-3 rounded-lg border ${action.activo ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50'} transition-all`}>
                  <span className={`text-sm font-bold ${action.activo ? 'text-gray-800' : 'text-gray-400'}`}>
                    {action.label}
                  </span>
                  {/* Toggle Switch Simple */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={action.activo} 
                      onChange={() => handleToggleQuickAction(action.id)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- MODAL DE GESTIÓN DE TICKET --- */}
      {selectedTicket && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-gradient-to-r from-[#0063AE] to-[#004d8a] p-5 flex justify-between items-center text-white">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                  Gestión del Ticket: {selectedTicket.numeroTicket}
                </h3>
                <p className="text-xs text-blue-200 mt-1">Registrado el {new Date(selectedTicket.fechaCreacion).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5 bg-gray-50/50">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Usuario / Afectado</span>
                  <span className="text-sm font-bold text-gray-800 block">{selectedTicket.usernameAfectado}</span>
                  <span className="text-xs text-[#0063AE]">{selectedTicket.correoContacto}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Estado Actual</span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border inline-block mt-1 ${
                    ticketStatusUpdate === 'RESUELTO' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : ticketStatusUpdate === 'EN_PROCESO'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {ticketStatusUpdate}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Descripción del Problema</span>
                 <p className="text-sm text-gray-700 leading-relaxed font-medium">
                   "{selectedTicket.descripcion}"
                 </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                 <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-3">Actualizar Estado</span>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setTicketStatusUpdate('PENDIENTE')}
                      className={`flex-1 font-bold text-xs py-2 rounded-lg border transition-colors ${ticketStatusUpdate === 'PENDIENTE' ? 'bg-red-500 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'}`}>Pendiente</button>
                    <button 
                      onClick={() => setTicketStatusUpdate('EN_PROCESO')}
                      className={`flex-1 font-bold text-xs py-2 rounded-lg border transition-colors ${ticketStatusUpdate === 'EN_PROCESO' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100'}`}>En Proceso</button>
                    <button 
                      onClick={() => setTicketStatusUpdate('RESUELTO')}
                      className={`flex-1 font-bold text-xs py-2 rounded-lg border transition-colors ${ticketStatusUpdate === 'RESUELTO' ? 'bg-green-500 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'}`}>Resuelto</button>
                 </div>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Respuesta al Usuario</label>
                <textarea 
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full text-sm text-black border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0063AE]"
                  rows={3}
                  placeholder="Escribe la solución para enviar al correo del usuario..."
                ></textarea>
              </div>

            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdateTicket}
                className="px-6 py-2 bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:from-[#00569e] hover:to-[#004073] transition-all"
              >
                Guardar y Notificar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PARA NUEVA FAQ --- */}
      {isFaqModalOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-[#0063AE] p-4 flex justify-between items-center text-white">
              <h3 className="font-extrabold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                Crear Nueva FAQ
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Pregunta (Label)</label>
                <input 
                  type="text" 
                  value={newFaqPregunta}
                  onChange={(e) => setNewFaqPregunta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                  placeholder="Ej. ¿Cómo emito una factura?"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Respuesta del Bot</label>
                <textarea 
                  value={newFaqRespuesta}
                  onChange={(e) => setNewFaqRespuesta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-[#0063AE] focus:outline-none"
                  rows={4}
                  placeholder="Escribe la respuesta detallada que dará el bot..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
              <button onClick={handleCreateFaq} className="px-6 py-2 bg-[#0063AE] text-white text-sm font-bold rounded-lg hover:bg-[#004d8a] transition-all">Crear FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PARA NUEVA QUICK ACTION --- */}
      {isQuickActionModalOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-green-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-extrabold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 2.5-5-1.5 1.5 5-2.5 2 2.5 2-1.5 5 5-1.5 2 2.5 2-2.5 5 1.5-1.5-5 2.5-2-2.5-2 1.5-5-5 1.5Z"/></svg>
                Nueva Acción Rápida
              </h3>
              <button onClick={() => setIsQuickActionModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1">Nombre del Botón</label>
              <input 
                type="text" 
                value={newQuickActionLabel}
                onChange={(e) => setNewQuickActionLabel(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-black focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Ej. Problemas de servidor"
              />
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsQuickActionModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Cancelar</button>
              <button onClick={handleCreateQuickAction} className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-all">Añadir Acción</button>
            </div>
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
