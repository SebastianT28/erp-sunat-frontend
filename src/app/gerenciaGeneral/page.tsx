"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "../../config/api"

import ContribuyentesPanel from "./contribuyentes/ContribuyentesPanel"
import GrePanel from "./gre/GrePanel"
import DeclaracionesPanel from "./declaraciones/DeclaracionesPanel"
import HelpdeskPanel from "./helpdesk/HelpdeskPanel"
import IncidenciasPanel from "./incidencias/IncidenciasPanel"
import DrpPanel from "./drp/DrpPanel"
import DashboardReportesPanel from "@/components/dashboard/DashboardReportesPanel"

import { fetchWithAuth } from "@/utils/fetchWithAuth"

export default function GerenciaGeneral() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("dashboard")
    const [adminUser, setAdminUser] = useState("Administrador")

    const [dashboardData, setDashboardData] = useState({
        totalContribuyentes: 0,
        totalGres: 0,
        totalDeclaraciones: 0
    })

    useEffect(() => {
        // Fetch dashboard metrics
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/dashboard`)
            .then(res => res.json())
            .then(data => setDashboardData(data))
            .catch(err => console.error("Error al cargar el dashboard:", err))

        const stored = localStorage.getItem("user")
        if (stored) {
            try {
                const u = JSON.parse(stored)
                setAdminUser(u.nombreUsuario || "Administrador")
            } catch (e) {}
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        document.cookie = "auth_token=; path=/; max-age=0"
        document.cookie = "auth_rol=; path=/; max-age=0"
        router.push("/login")
    }

    // --- VISTA DASHBOARD ---
    const renderDashboard = () => <DashboardReportesPanel />

    return (
        <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
            {/* BARRA LATERAL (Sidebar) */}
            <div className="w-72 bg-[#0063AE] text-white flex flex-col justify-between shadow-2xl z-20 shrink-0">
                <div>
                    {/* Header Logo */}
                    <div className="h-20 border-b border-[#004d8a] flex items-center justify-center bg-white">
                        <img src="/logo-sunat.png" alt="SUNAT" className="h-10 object-contain" />
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex flex-col mt-6">
                        <button 
                            onClick={() => setActiveTab('dashboard')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'dashboard' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>
                            Dashboard de Reportes
                        </button>

                        <button 
                            onClick={() => setActiveTab('contribuyentes')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'contribuyentes' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
                            Contribuyentes
                        </button>

                        <button 
                            onClick={() => setActiveTab('gres')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'gres' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/><path d="M3 4h10v1H3V4zm0 2h10v1H3V6zm0 2h10v1H3V8zm0 2h10v1H3v-1z"/></svg>
                            Guías de Remisión (GRE)
                        </button>

                        <button 
                            onClick={() => setActiveTab('declaraciones')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'declaraciones' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/></svg>
                            Declaraciones
                        </button>

                        <button 
                            onClick={() => setActiveTab('helpdesk')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'helpdesk' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/>
                            </svg>
                            Soporte (HelpDesk)
                        </button>

                        <button 
                            onClick={() => setActiveTab('incidencias')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'incidencias' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
                            </svg>
                            Gestión de Incidencias
                        </button>

                        <button 
                            onClick={() => setActiveTab('drp')} 
                            className={`px-6 py-4 text-left font-extrabold text-sm transition-all flex items-center gap-3
                                ${activeTab === 'drp' ? 'bg-[#004d8a] border-l-4 border-white' : 'hover:bg-[#00569e] border-l-4 border-transparent text-blue-100'}
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                            Continuidad DRP (Failback)
                        </button>
                    </nav>
                </div>

                {/* Info Inferior Izquierda */}
                <div className="bg-[#004d8a] p-5 border-t border-blue-900/50 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center font-extrabold text-lg shadow-inner">
                            {adminUser.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-blue-200 uppercase font-extrabold tracking-widest">Administrador</p>
                            <p className="text-sm font-extrabold truncate">{adminUser}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-[#b42828] hover:bg-red-800 text-white text-sm font-extrabold py-2.5 rounded shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Salir del Sistema
                    </button>
                </div>
            </div>

            {/* ÁREA DE CONTENIDO (Main Content) */}
            <div className="flex-1 overflow-hidden bg-[#f4f6f9]">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'contribuyentes' && <ContribuyentesPanel />}
                {activeTab === 'gres' && <GrePanel />}
                {activeTab === 'declaraciones' && <DeclaracionesPanel />}
                {activeTab === 'helpdesk' && <HelpdeskPanel />}
                {activeTab === 'incidencias' && <IncidenciasPanel />}
                {activeTab === 'drp' && <DrpPanel />}
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8; 
                }
            `}</style>
        </div>
    )
}
