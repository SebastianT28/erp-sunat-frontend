"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import { useState } from "react"
import { API_BASE_URL } from "../../config/api"
import { motion, AnimatePresence } from "framer-motion"

export default function BajaGRE() {
    const [tipoGRE, setTipoGRE] = useState("")
    const [serie, setSerie] = useState("T001")
    const [numero, setNumero] = useState("")

    const [buscando, setBuscando] = useState(false)
    const [greEncontrada, setGreEncontrada] = useState<any | null>(null)
    const [error, setError] = useState("")

    const [tipoBaja, setTipoBaja] = useState("")
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false)

    const [notificacion, setNotificacion] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null)

    const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
        setNotificacion({ mensaje, tipo })
        setTimeout(() => setNotificacion(null), 5000)
    }

    const handleBuscar = async () => {
        if (!tipoGRE || serie.trim() === "" || numero.trim() === "") {
            setError("Por favor seleccione el tipo, la Serie y el Número de la GRE.")
            return
        }
        setError("")
        setBuscando(true)
        setGreEncontrada(null)
        setTipoBaja("")

        try {
            const numFormat = numero.padStart(6, '0')
            const url = `${API_BASE_URL}/api/logistica/gre/buscar-baja?tipoGuia=${tipoGRE.toLowerCase()}&serie=${serie.toUpperCase()}&numero=${numFormat}`
            const res = await fetchWithAuth(url)
            const data = await res.json()

            if (data.success && data.data) {
                const gre = data.data
                setGreEncontrada({
                    tipo: tipoGRE,
                    serie: gre.serie,
                    numero: gre.numero,
                    fechaEmision: gre.fechaEmision,
                    estado: gre.estado,
                    destinatario: gre.destinatarioNombre ? `${gre.destinatarioNombre} (${gre.destinatarioTipoDoc}: ${gre.destinatarioNumDoc})` : "-",
                    motivoTraslado: gre.motivoTraslado
                })
                setNumero(numFormat)
            } else {
                setError(data.message || "No se encontró la GRE solicitada.")
            }
        } catch (err) {
            setError("Error de conexión con el servidor.")
        }
        setBuscando(false)
    }

    const confirmarBaja = () => {
        if (tipoBaja === "") {
            mostrarNotificacion("Por favor seleccione el motivo de baja.", "error")
            return
        }
        setMostrarModalConfirmacion(true)
    }

    const ejecutarBaja = async () => {
        setMostrarModalConfirmacion(false)
        try {
            const url = `${API_BASE_URL}/api/logistica/gre/baja?tipoGuia=${tipoGRE.toLowerCase()}&serie=${greEncontrada.serie}&numero=${greEncontrada.numero}`
            const res = await fetchWithAuth(url, { method: "DELETE" })
            const data = await res.json()

            if (res.ok && data.success) {
                mostrarNotificacion(`GRE ${greEncontrada.serie}-${greEncontrada.numero} dada de baja exitosamente.`, "exito")
                setGreEncontrada(null)
                setTipoGRE("")
                setSerie("T001")
                setNumero("")
                setTipoBaja("")
            } else {
                mostrarNotificacion(data.message || 'No se pudo eliminar la GRE.', "error")
            }
        } catch (err) {
            mostrarNotificacion("Error de conexión al intentar dar de baja.", "error")
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
            <div className="absolute top-[-60px] right-[-60px] w-[240px] h-[240px] bg-red-100/40 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] bg-blue-100/40 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-[#0063AE] font-extrabold text-2xl mb-1 flex items-center gap-3">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Baja de Guía de Remisión Electrónica
                        </h2>
                        <p className="text-gray-400 text-sm">Localice la GRE y proceda con la baja definitiva ante la SUNAT.</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Acción irreversible
                    </span>
                </div>

                {/* Formulario de búsqueda */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <p className="text-gray-700 font-bold text-sm mb-4">Locate la GRE a dar de baja</p>
                    <div className="flex items-end gap-4 flex-wrap">
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Tipo de GRE</label>
                            <div className="relative">
                                <select
                                    value={tipoGRE}
                                    onChange={(e) => setTipoGRE(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-52 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] text-sm text-gray-700 font-medium transition-all"
                                >
                                    <option value="" disabled>Seleccione tipo</option>
                                    <option value="Remitente">GRE - Remitente</option>
                                    <option value="Transportista">GRE - Transportista</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Serie</label>
                            <input
                                type="text"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                placeholder="T001"
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-28 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] uppercase text-sm text-gray-800 font-mono transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Número</label>
                            <input
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                                placeholder="000005"
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-36 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] text-sm text-gray-800 font-mono transition-all"
                            />
                        </div>
                        <button
                            onClick={handleBuscar}
                            disabled={buscando}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white px-8 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95"
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
                            {buscando ? "Buscando..." : "Buscar"}
                        </button>
                    </div>
                    <AnimatePresence>
                        {error && (
                            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-[#FF4081] text-xs mt-3 font-bold flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Panel de GRE encontrada */}
                <AnimatePresence>
                    {greEncontrada && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-white rounded-2xl shadow-md border border-red-100 overflow-hidden"
                        >
                            {/* Header de la GRE encontrada */}
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-red-700 font-extrabold">GRE Encontrada: {greEncontrada.serie}-{greEncontrada.numero}</h3>
                                    <p className="text-red-400 text-xs">Verifique los datos antes de proceder con la baja</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-6">
                                    {[
                                        { label: "Estado actual", value: greEncontrada.estado, highlight: true },
                                        { label: "Fecha de Emisión", value: greEncontrada.fechaEmision },
                                        { label: "Destinatario", value: greEncontrada.destinatario, full: true },
                                        { label: "Motivo de traslado", value: greEncontrada.motivoTraslado, full: true },
                                    ].map((item) => (
                                        <div key={item.label} className={item.full ? "col-span-2" : ""}>
                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-0.5">{item.label}</span>
                                            <span className={`font-semibold ${item.highlight ? 'text-blue-600' : 'text-gray-800'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Sección de baja */}
                                <div className="border-t border-red-100 pt-5 mt-2">
                                    <p className="text-red-700 font-bold text-sm mb-3">Seleccione el motivo de baja</p>
                                    <div className="flex items-end gap-4 flex-wrap">
                                        <div className="relative flex-1 min-w-[280px]">
                                            <select
                                                value={tipoBaja}
                                                onChange={(e) => setTipoBaja(e.target.value)}
                                                className="w-full appearance-none bg-red-50/50 border border-red-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all font-medium"
                                            >
                                                <option value="" disabled>Seleccione un motivo...</option>
                                                <option value="CambioDestinatario">Durante el traslado por cambio de destinatario</option>
                                                <option value="AntesInicio">Antes de iniciar el traslado</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-red-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                        <button
                                            onClick={confirmarBaja}
                                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-red-500/30 hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Dar de baja definitivamente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal de Confirmación */}
            <AnimatePresence>
                {mostrarModalConfirmacion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-red-600"
                        >
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </motion.div>
                                <h2 className="text-xl font-extrabold text-gray-900 mb-2">¿Confirmar baja definitiva?</h2>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    Estás a punto de dar de baja la GRE <span className="font-extrabold text-gray-900">{greEncontrada?.serie}-{greEncontrada?.numero}</span>.
                                    Esta acción es <span className="text-red-600 font-bold">irreversible</span> y será notificada a la SUNAT.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setMostrarModalConfirmacion(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={ejecutarBaja}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl text-sm font-extrabold shadow hover:shadow-red-500/40 hover:shadow-lg transition-all active:scale-95"
                                    >
                                        Sí, dar de baja
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast de Notificación */}
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
                        <span className="font-bold text-sm">{notificacion.mensaje}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
