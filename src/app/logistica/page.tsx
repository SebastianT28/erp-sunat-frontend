"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import EmisionGRE from "./emisionGREDatos"
import ConsultaGRE from "./consultaGRE"
import BajaGRE from "./bajaGRE"
import NoConformidadGRE from "./noConformidadGRE"

export default function Logistica() {
  const router = useRouter()
  const [vistaActiva, setVistaActiva] = useState("emision")

  const sidebarButtons = [
    { id: "emision", label: "Emisión de GRE" },
    { id: "consulta", label: "Consulta de GRE" },
    { id: "baja", label: "Baja de GRE" },
    { id: "noConformidad", label: "No conformidad de GRE" }
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      
      {/* Header superior blanco */}
      <div className="bg-white/80 backdrop-blur-md px-8 py-4 shadow-sm z-20 sticky top-0 flex items-center justify-between">
        <Image
          src="/logo-sunat.png"
          alt="SUNAT Logo"
          width={150}
          height={40}
          className="object-contain"
          priority
        />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0063AE] to-[#FF4081] text-white flex items-center justify-center font-bold text-xs shadow-md">
            SU
          </div>
        </div>
      </div>

      {/* Barra de navegación principal (Gradiente Azul/Rosa sutil) */}
      <div className="h-12 bg-gradient-to-r from-[#0063AE] via-[#004d8a] to-[#0063AE] flex items-center justify-between px-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#FF4081]/20 to-transparent"></div>
        
        <span className="text-white font-bold text-sm tracking-wide z-10 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#FF4081]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Módulo Logístico - GRE
        </span>
        
        <div className="flex gap-8 z-10">
          {[
            { path: "/marketing", label: "Marketing y Ventas" },
            { path: "/logistica", label: "Logística y Almacén", active: true },
            { path: "/operaciones", label: "Producción y Operaciones" }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`text-sm font-semibold transition-all duration-300 relative group ${item.active ? 'text-white' : 'text-blue-200 hover:text-white'}`}
            >
              {item.label}
              {item.active && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FF4081] rounded-t-full" />
              )}
              <span className={`absolute -bottom-2 left-0 w-full h-1 bg-[#FF4081] rounded-t-full origin-left transform scale-x-0 transition-transform duration-300 ${!item.active ? 'group-hover:scale-x-100' : ''}`}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Fondo decorativo principal */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#FF4081]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Sidebar */}
        <div className="w-[260px] bg-white/60 backdrop-blur-xl border-r border-blue-100/50 flex flex-col shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-10 p-4 pt-6">
          
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-3 px-4 py-3 mb-6 bg-blue-50/50 rounded-xl text-[#0063AE] font-bold text-sm hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-blue-100"
          >
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-[#FF4081] group-hover:-translate-x-1 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </div>
            <span>Ir al Menú</span>
          </button>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
            Gestión de Guías
          </div>

          <div className="flex flex-col gap-2">
            {sidebarButtons.map((btn) => {
              const isActive = vistaActiva === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setVistaActiva(btn.id)}
                  className={`relative px-4 py-3 text-sm font-semibold text-left rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? "text-[#0063AE]" 
                      : "text-gray-600 hover:bg-white hover:text-[#0063AE] hover:shadow-sm"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-blue-50/80 border border-blue-200/50 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF4081] rounded-r-full" />
                  )}
                  <span className="relative z-10">{btn.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Área de vista */}
        <div className="flex-1 p-8 overflow-y-auto relative z-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={vistaActiva}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full max-w-5xl mx-auto"
            >
              {vistaActiva === "emision" && <EmisionGRE />}
              {vistaActiva === "consulta" && <ConsultaGRE />}
              {vistaActiva === "baja" && <BajaGRE />}
              {vistaActiva === "noConformidad" && <NoConformidadGRE />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
