"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"
import { motion, AnimatePresence } from "framer-motion"

export default function NoConformidadGRE() {
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")
    const [numeroDocumento, setNumeroDocumento] = useState("")

    const [usuarioInfo, setUsuarioInfo] = useState({ ruc: "", razonSocial: "", idUsuario: 1 })

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) {
            try {
                const user = JSON.parse(stored)
                setUsuarioInfo({
                    ruc: user.contribuyente?.ruc || user.ruc || "",
                    razonSocial: user.contribuyente?.razonSocial || user.razonSocial || "",
                    idUsuario: user.idUsuario || 1
                })
            } catch (e) { }
        }
    }, [])

    const [buscando, setBuscando] = useState(false)
    const [resultados, setResultados] = useState<any[]>([])
    const [haBuscado, setHaBuscado] = useState(false)

    const [greSeleccionada, setGreSeleccionada] = useState<any | null>(null)
    const [motivoReclamo, setMotivoReclamo] = useState("")

    const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null)

    const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
        setNotificacion({ mensaje, tipo })
        setTimeout(() => setNotificacion(null), 5000)
    }

    const handleLimpiar = () => {
        setFechaDesde("")
        setFechaHasta("")
        setNumeroDocumento("")
        setResultados([])
        setHaBuscado(false)
    }

    const handleBuscar = async () => {
        if (!fechaDesde || !fechaHasta || !numeroDocumento.trim()) {
            mostrarNotificacion("Por favor, ingrese el rango de fechas y el número de documento.", "error")
            return
        }
        setBuscando(true)
        setHaBuscado(true)
        try {
            const url = `${API_BASE_URL}/api/logistica/gre/pendientes-reclamo?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&numeroDocumento=${numeroDocumento}`
            const res = await fetchWithAuth(url)
            const data = await res.json()
            if (data.success) {
                setResultados(data.data || [])
            } else {
                mostrarNotificacion(data.message || "Error al buscar guías.", "error")
            }
        } catch (err) {
            mostrarNotificacion("Error de conexión con el servidor.", "error")
        }
        setBuscando(false)
    }

    const abrirReclamo = (gre: any) => {
        setGreSeleccionada(gre)
        setMotivoReclamo("")
    }

    const enviarReclamo = async () => {
        if (!motivoReclamo.trim()) {
            mostrarNotificacion("Por favor, indique el motivo de la no conformidad.", "error")
            return
        }
        try {
            const payload = { idUsuario: usuarioInfo.idUsuario, idGre: greSeleccionada.idGre, motivo: motivoReclamo }
            const res = await fetchWithAuth(`${API_BASE_URL}/api/logistica/notificacion/reclamo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                mostrarNotificacion(`Reclamo presentado correctamente para la GRE ${greSeleccionada.serie}-${greSeleccionada.numero}.`, "exito")
                setResultados(resultados.filter(r => r.idGre !== greSeleccionada.idGre))
                setGreSeleccionada(null)
            } else {
                mostrarNotificacion(data.message || "Error al enviar el reclamo.", "error")
            }
        } catch (err) {
            mostrarNotificacion("Error de conexión al intentar enviar el reclamo.", "error")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden"
        >
            {/* Decoración de fondo */}
            <div className="absolute top-[-60px] right-[-60px] w-[240px] h-[240px] bg-amber-100/40 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] bg-blue-100/40 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-[#0063AE] font-extrabold text-2xl mb-1 flex items-center gap-3">
                            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Pendientes de Revisión
                        </h2>
                        <p className="text-gray-400 text-sm">Busque guías de remisión y presente reclamaciones de no conformidad.</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        No Conformidad GRE
                    </span>
                </div>

                {/* Formulario de búsqueda */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-gray-700 font-bold text-sm mb-5">Buscar Guías de Remisión asociadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Rango de Fechas de Emisión</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] transition-all"
                                />
                                <span className="text-gray-400 font-bold text-sm">al</span>
                                <input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Número de Documento</label>
                            <input
                                type="text"
                                value={numeroDocumento}
                                onChange={(e) => setNumeroDocumento(e.target.value)}
                                placeholder="N° de documento"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] placeholder-gray-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Condición del usuario</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 font-medium cursor-not-allowed">
                                Destinatario
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-gray-100">
                        <button
                            onClick={handleLimpiar}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={handleBuscar}
                            disabled={buscando}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95"
                        >
                            {buscando ? (
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                            {buscando ? "Buscando..." : "Buscar Coincidencias"}
                        </button>
                    </div>
                </div>

                {/* Tabla de resultados */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">N°</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">Tipo GRE</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">Numeración</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">Fecha Emisión</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">RUC Emisor</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide">Razón Social</th>
                                    <th className="py-3.5 px-4 text-[#0063AE] font-bold text-xs uppercase tracking-wide text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!haBuscado && (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-gray-400 text-sm font-medium">Use los filtros de arriba para buscar guías pendientes.</p>
                                        </td>
                                    </tr>
                                )}
                                {haBuscado && resultados.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-gray-400 text-sm font-medium">No se encontraron guías que coincidan con los criterios.</p>
                                        </td>
                                    </tr>
                                )}
                                <AnimatePresence>
                                    {resultados.map((gre, index) => (
                                        <motion.tr
                                            key={gre.idGre}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors group"
                                        >
                                            <td className="py-3.5 px-4 text-center text-gray-500 text-xs">{index + 1}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="text-xs font-bold text-[#0063AE] bg-blue-50 px-2 py-1 rounded-lg">{gre.tipoGuia}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-gray-700 font-mono font-semibold text-xs">{gre.serie}-{gre.numero}</td>
                                            <td className="py-3.5 px-4 text-center text-gray-600 text-xs">{gre.fechaEmision}</td>
                                            <td className="py-3.5 px-4 text-center text-gray-600 font-mono text-xs">{usuarioInfo.ruc}</td>
                                            <td className="py-3.5 px-4 text-gray-700 font-semibold text-xs">{usuarioInfo.razonSocial}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                <button
                                                    onClick={() => abrirReclamo(gre)}
                                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-red-500/30 hover:shadow-md transition-all active:scale-95"
                                                >
                                                    Presentar Reclamo
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Reclamo */}
            <AnimatePresence>
                {greSeleccionada && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-red-600"
                        >
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-extrabold text-red-700">Presentar Reclamo</h2>
                                    <p className="text-red-400 text-xs mt-0.5">
                                        GRE: <span className="font-bold">{greSeleccionada.serie}-{greSeleccionada.numero}</span>
                                        {greSeleccionada.razonSocialEmisor && <> · Emisor: <span className="font-bold">{greSeleccionada.razonSocialEmisor}</span></>}
                                    </p>
                                </div>
                                <button onClick={() => setGreSeleccionada(null)} className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <label className="text-gray-700 font-bold text-sm mb-2 block">
                                    Motivo de la no conformidad <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={motivoReclamo}
                                    onChange={(e) => setMotivoReclamo(e.target.value)}
                                    placeholder="Describa el problema detalladamente (ej. Cantidad incorrecta, bienes dañados, error en destinatario...)"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none h-36 placeholder-gray-400 transition-all"
                                />
                                <div className="flex justify-end gap-3 mt-5">
                                    <button onClick={() => setGreSeleccionada(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={enviarReclamo}
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-7 py-2.5 rounded-xl text-sm font-extrabold shadow hover:shadow-red-500/30 hover:shadow-lg transition-all active:scale-95"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        Enviar Reclamo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast de notificación */}
            <AnimatePresence>
                {notificacion && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${notificacion.tipo === 'exito' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                        {notificacion.tipo === 'exito'
                            ? <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            : <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }
                        <span className="font-bold text-sm max-w-xs">{notificacion.mensaje}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
