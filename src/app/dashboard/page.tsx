"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence, type Variants } from "framer-motion"

const modules = [
  {
    id: "logistica",
    path: "/logistica",
    title: "Emisión de Guías de Remisión",
    subtitle: "Módulo GRE",
    description: "La emisión de guías de remisión es el proceso de generar un documento electrónico que autoriza y respalda el traslado de bienes de un lugar a otro.",
    icon: "/icon-gre.png",
    accent: "#0063AE",
    accentLight: "rgba(0,99,174,0.08)",
    accentBorder: "rgba(0,99,174,0.2)",
    badge: "Logística",
    badgeColor: "text-blue-600 bg-blue-50 border-blue-100",
    gradient: "from-[#0063AE] to-[#004d8a]",
    glowColor: "rgba(0,99,174,0.15)",
    featureDetails: [
      { icon: "📄", label: "Emisión GRE", desc: "Crea y registra nuevas guías de remisión electrónicas." },
      { icon: "🔍", label: "Consulta GRE", desc: "Busca y descarga guías de remisión ya emitidas." },
      { icon: "🗑️", label: "Baja de GRE", desc: "Da de baja definitiva una guía ante la SUNAT." },
      { icon: "⚠️", label: "No conformidad", desc: "Presenta reclamos sobre guías recibidas como destinatario." },
    ],
  },
  {
    id: "operaciones",
    path: "/operaciones",
    title: "Declaración Mensual de Impuestos",
    subtitle: "Módulo Tributario",
    description: "La declaración mensual de impuestos es el proceso mediante el cual una empresa informa a la SUNAT sobre sus ingresos, ventas y tributos generados.",
    icon: "/icon-impuestos.png",
    accent: "#0063AE",
    accentLight: "rgba(0,99,174,0.08)",
    accentBorder: "rgba(0,99,174,0.2)",
    badge: "Operaciones",
    badgeColor: "text-blue-600 bg-blue-50 border-blue-100",
    gradient: "from-[#0063AE] to-[#004d8a]",
    glowColor: "rgba(0,99,174,0.15)",
    featureDetails: [
      { icon: "📊", label: "Declarar impuestos", desc: "Registra ingresos, gastos y tributos del período mensual." },
      { icon: "📋", label: "Ver historial", desc: "Consulta el historial de declaraciones anteriores." },
      { icon: "🧮", label: "Calcular IGV", desc: "Calcula automáticamente el IGV e Impuesto a la Renta." },
      { icon: "📥", label: "Exportar PDF", desc: "Descarga el comprobante de declaración en formato PDF." },
    ],
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function Dashboard() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const featuresRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    localStorage.removeItem("user")
    document.cookie = "auth_token=; path=/; max-age=0"
    document.cookie = "auth_rol=; path=/; max-age=0"
    router.push("/login")
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const u = JSON.parse(stored)
        setUserName(u.nombreUsuario || u.nombre || "Usuario")
      }
    } catch (e) { }

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Cierra el panel de features al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setExpandedFeatures(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col relative overflow-hidden">

      {/* Orbes de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-100 rounded-full blur-[140px] opacity-30"
        />
      </div>

      {/* Header glassmorphism */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm z-20 relative"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Image src="/logo-sunat.png" alt="SUNAT Logo" width={150} height={44} className="object-contain" priority />

          <div className="flex items-center gap-4">
            {currentTime && (
              <span className="text-gray-400 text-xs hidden md:block capitalize">{currentTime}</span>
            )}

            {/* Avatar + nombre */}
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0063AE] to-[#004d8a] flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              {userName && <span className="text-gray-700 font-semibold text-sm">{userName}</span>}
            </div>

            {/* Botón de salida */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </motion.header>

      {/* Barra rainbow */}
      <div className="h-1 bg-gradient-to-r from-[#0063AE] via-[#004d8a] to-[#0063AE] relative z-10" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          {/* Encabezado principal */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <h1 className="text-4xl font-extrabold text-black mb-3 leading-tight">
              ¿Qué operación deseas realizar hoy?
            </h1>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Selecciona el módulo que corresponde a la operación que deseas gestionar.
            </p>
          </motion.div>

          {/* Cards de módulos */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={featuresRef}>
            {modules.map((mod) => (
              <motion.div
                key={mod.id}
                onHoverStart={() => setHoveredCard(mod.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative cursor-pointer group"
                onClick={() => {
                  if (expandedFeatures !== mod.id) router.push(mod.path)
                }}
              >
                {/* Glow de fondo al hover */}
                <AnimatePresence>
                  {hoveredCard === mod.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -inset-2 rounded-[28px] blur-xl pointer-events-none"
                      style={{ background: mod.glowColor }}
                    />
                  )}
                </AnimatePresence>

                {/* Card principal */}
                <div
                  className="relative bg-white/80 backdrop-blur-xl rounded-3xl border shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-2xl"
                  style={{ borderColor: hoveredCard === mod.id ? mod.accentBorder : "rgba(255,255,255,0.8)" }}
                >
                  {/* Barra superior con gradiente */}
                  <div className={`h-1.5 bg-gradient-to-r ${mod.gradient}`} />

                  {/* Orbe decorativo interno */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: mod.accentLight, transform: "translate(30%, -30%)" }}
                  />

                  <div className="p-7">
                    {/* Header de card */}
                    <div className="flex items-start gap-4 mb-5">
                      <motion.div
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden"
                        style={{ background: mod.accentLight, border: `1px solid ${mod.accentBorder}` }}
                      >
                        <Image src={mod.icon} alt={mod.title} width={44} height={44} className="object-contain" />
                      </motion.div>

                      <div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest border px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                          {mod.badge}
                        </span>
                        <h2 className="text-gray-900 font-extrabold text-lg leading-snug mt-1.5">{mod.title}</h2>
                        <p className="text-gray-400 text-xs font-semibold">{mod.subtitle}</p>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{mod.description}</p>

                    {/* Panel expandible de funcionalidades */}
                    <AnimatePresence>
                      {expandedFeatures === mod.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden mb-5"
                        >
                          <div
                            className="rounded-2xl p-4 grid grid-cols-2 gap-3"
                            style={{ background: mod.accentLight, border: `1px solid ${mod.accentBorder}` }}
                          >
                            {mod.featureDetails.map((fd) => (
                              <div key={fd.label} className="flex items-start gap-2">
                                <span className="text-base flex-shrink-0">{fd.icon}</span>
                                <div>
                                  <p className="text-xs font-extrabold" style={{ color: mod.accent }}>{fd.label}</p>
                                  <p className="text-[11px] text-gray-500 leading-snug">{fd.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA row */}
                    <div className="flex items-center justify-between">
                      {/* Botón ¿Qué incluye? — ahora funcional */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedFeatures(expandedFeatures === mod.id ? null : mod.id)
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold transition-colors"
                        style={{ color: mod.accent }}
                      >
                        <motion.svg
                          animate={{ rotate: expandedFeatures === mod.id ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                        {expandedFeatures === mod.id ? "Ocultar detalles" : "¿Qué incluye?"}
                      </button>

                      {/* Botón Ingresar */}
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={(e) => { e.stopPropagation(); router.push(mod.path) }}
                        className={`flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r ${mod.gradient}`}
                      >
                        Ingresar
                        <motion.svg
                          animate={{ x: hoveredCard === mod.id ? 3 : 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer de estado del sistema */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl px-8 py-4 shadow-sm flex-wrap justify-center">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Conexión segura SSL
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Datos actualizados al día
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg className="w-4 h-4 text-[#0063AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Soporte 24/7
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}