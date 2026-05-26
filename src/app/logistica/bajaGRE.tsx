"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";


import { useState } from "react"
import { API_BASE_URL } from "../../config/api"

export default function BajaGRE() {
    const [tipoGRE, setTipoGRE] = useState("")
    const [serie, setSerie] = useState("T001")
    const [numero, setNumero] = useState("")
    
    const [buscando, setBuscando] = useState(false)
    const [greEncontrada, setGreEncontrada] = useState<any | null>(null)
    const [error, setError] = useState("")
    
    const [tipoBaja, setTipoBaja] = useState("")
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false)
    
    // Estado para notificaciones flotantes
    const [notificacion, setNotificacion] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null)

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
        <div className="w-full max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm relative">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-[#0063AE] font-extrabold text-base">Baja de Guía de Remisión Electrónica</h2>
                <button className="text-red-500 text-sm font-extrabold flex items-center gap-1 hover:underline">
                    <span className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">i</span>
                    Ayuda
                </button>
            </div>

            {/* Fila de Búsqueda */}
            <div className="flex items-end gap-6 mb-8">
                <div className="w-64">
                    <label className="text-black font-extrabold text-sm mb-2 block">Tipo de GRE</label>
                    <select
                        value={tipoGRE}
                        onChange={(e) => setTipoGRE(e.target.value)}
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                    >
                        <option value="" disabled>Seleccione</option>
                        <option value="Remitente">GRE - Remitente</option>
                        <option value="Transportista">GRE - Transportista</option>
                    </select>
                </div>

                <div className="w-32">
                    <label className="text-black font-extrabold text-sm mb-2 block">Serie</label>
                    <input
                        type="text"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value.toUpperCase())}
                        placeholder="Ej: T001"
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                    />
                </div>

                <div className="w-48">
                    <label className="text-black font-extrabold text-sm mb-2 block">Número</label>
                    <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ej: 000005"
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400"
                    />
                </div>

                <button
                    onClick={handleBuscar}
                    disabled={buscando}
                    className="bg-[#0063AE] text-white px-8 py-2 rounded text-sm font-extrabold hover:bg-[#004d8a] transition-colors disabled:opacity-50 h-[38px] shadow"
                >
                    {buscando ? "Buscando..." : "Buscar"}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm font-bold -mt-4 mb-4">{error}</p>}

            {/* Panel Dinámico de Previsualización y Baja */}
            {greEncontrada && (
                <div className="border-t border-gray-200 pt-8 animate-fade-in">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-[#b42828] font-extrabold text-lg mb-4">
                            Datos de la GRE encontrada: {greEncontrada.serie} - {greEncontrada.numero}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-black mb-6">
                            <p><span className="font-extrabold text-gray-700">Estado actual:</span> <span className="text-blue-600 font-bold">{greEncontrada.estado}</span></p>
                            <p><span className="font-extrabold text-gray-700">Fecha de Emisión:</span> {greEncontrada.fechaEmision}</p>
                            <p className="col-span-2"><span className="font-extrabold text-gray-700">Destinatario:</span> {greEncontrada.destinatario}</p>
                            <p className="col-span-2"><span className="font-extrabold text-gray-700">Motivo:</span> {greEncontrada.motivoTraslado}</p>
                        </div>

                        <div className="border-t border-red-200 pt-4 mt-2">
                            <label className="text-[#b42828] font-extrabold text-sm mb-2 block">Motivo de la baja</label>
                            <div className="flex items-end gap-6">
                                <select
                                    value={tipoBaja}
                                    onChange={(e) => setTipoBaja(e.target.value)}
                                    className="border border-red-300 px-3 py-2 text-sm text-black w-96 focus:outline-none focus:border-[#b42828] bg-white"
                                >
                                    <option value="" disabled>Seleccione un motivo...</option>
                                    <option value="CambioDestinatario">Durante el traslado por cambio de destinatario</option>
                                    <option value="AntesInicio">Antes de iniciar el traslado</option>
                                </select>

                                <button
                                    onClick={confirmarBaja}
                                    className="bg-[#b42828] text-white px-10 py-2 rounded text-sm font-extrabold shadow hover:bg-red-800 transition-colors"
                                >
                                    Dar de baja definitivamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación */}
            {mostrarModalConfirmacion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[450px] text-center border-t-8 border-[#b42828]">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b42828]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-extrabold text-black mb-2">¿Estás seguro?</h2>
                        <p className="text-gray-600 text-sm mb-8">
                            Estás a punto de dar de baja la GRE <span className="font-extrabold text-black">{greEncontrada?.serie}-{greEncontrada?.numero}</span>. 
                            Esta acción es irreversible y se informará a la SUNAT.
                        </p>
                        
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setMostrarModalConfirmacion(false)}
                                className="bg-gray-200 text-black px-6 py-2 rounded text-sm font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={ejecutarBaja}
                                className="bg-[#b42828] text-white px-8 py-2 rounded text-sm font-extrabold shadow hover:bg-red-800 transition-colors"
                            >
                                Sí, dar de baja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificación flotante (Toast) */}
            {notificacion && (
                <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in ${
                    notificacion.tipo === 'exito' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {notificacion.tipo === 'exito' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                        </svg>
                    )}
                    <span className="font-extrabold text-sm">{notificacion.mensaje}</span>
                </div>
            )}
        </div>
    )
}
