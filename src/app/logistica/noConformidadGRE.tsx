"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";


import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"

export default function NoConformidadGRE() {
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")
    const [numeroDocumento, setNumeroDocumento] = useState("")
    
    // Estado del usuario en sesión
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
            } catch (e) {}
        }
    }, [])

    // Estados para la búsqueda
    const [buscando, setBuscando] = useState(false)
    const [resultados, setResultados] = useState<any[]>([])
    const [haBuscado, setHaBuscado] = useState(false)
    
    // Estados para el Modal de Reclamo
    const [greSeleccionada, setGreSeleccionada] = useState<any | null>(null)
    const [motivoReclamo, setMotivoReclamo] = useState("")
    
    // Notificación
    const [notificacion, setNotificacion] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null)

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
            alert("Por favor, indique el motivo de la no conformidad.")
            return
        }

        try {
            const payload = {
                idUsuario: usuarioInfo.idUsuario,
                idGre: greSeleccionada.idGre,
                motivo: motivoReclamo
            }

            const res = await fetchWithAuth(`${API_BASE_URL}/api/logistica/notificacion/reclamo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const data = await res.json()

            if (data.success) {
                mostrarNotificacion(`Reclamo presentado correctamente para la GRE ${greSeleccionada.serie}-${greSeleccionada.numero}.`, "exito")
                // Quitar la GRE de la lista temporalmente (como si ya estuviera observada)
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
        <div className="w-full max-w-6xl mx-auto bg-white p-6 shadow-sm rounded-sm relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#0063AE] font-extrabold text-base">Pendientes de revisión (No Conformidad)</h2>
                <button className="text-red-500 text-sm font-extrabold flex items-center gap-1 hover:underline">
                    <span className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">i</span>
                    Ayuda
                </button>
            </div>

            <h3 className="text-black font-extrabold text-sm mb-6">Buscar Guías de Remisión asociadas</h3>

            {/* Formulario de búsqueda */}
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-6 gap-y-6 items-center mb-8 bg-gray-50 p-6 rounded border border-gray-200">
                
                {/* Fechas */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap text-right">Fecha de Emisión del:</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-[#0063AE] text-black"
                    />
                    <span className="text-black font-extrabold text-sm mx-1">al</span>
                    <input 
                        type="date" 
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-[#0063AE] text-black"
                    />
                </div>

                {/* Número de Documento */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap text-right">Número de documento:</label>
                <input 
                    type="text" 
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    placeholder="Ingrese N° documento"
                    className="border border-gray-300 px-3 py-1.5 text-sm w-full focus:outline-none focus:border-[#0063AE] text-black"
                />

                {/* Condición del usuario (Solo texto) */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap text-right">Condición del usuario:</label>
                <div className="text-gray-700 font-bold text-sm px-3 py-1.5 bg-gray-100 border border-gray-200 rounded cursor-not-allowed">
                    Destinatario
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mb-8 border-b border-gray-200 pb-6">
                <button 
                    onClick={handleLimpiar}
                    className="bg-white text-gray-500 border border-gray-300 px-8 py-2 rounded text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                    Limpiar
                </button>
                <button 
                    onClick={handleBuscar}
                    disabled={buscando}
                    className="bg-[#0063AE] text-white border border-[#0063AE] px-12 py-2 rounded text-sm font-bold hover:bg-[#004d8a] transition-colors shadow disabled:opacity-50"
                >
                    {buscando ? "Buscando..." : "Buscar Coincidencias"}
                </button>
            </div>

            {/* Panel Dinámico / Tabla de resultados */}
            <div className="overflow-x-auto min-h-[200px]">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">N°</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Tipo de GRE</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Numeración</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Fecha Emisión</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">RUC Emisor</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-left">Razón social del emisor</th>
                            <th className="py-3 px-3 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!haBuscado && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-500 text-sm italic">
                                    Utilice los filtros superiores para buscar guías de remisión pendientes de revisión.
                                </td>
                            </tr>
                        )}
                        {haBuscado && resultados.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-red-500 text-sm font-bold">
                                    No se encontraron guías de remisión que coincidan con los criterios.
                                </td>
                            </tr>
                        )}
                        {resultados.map((gre, index) => (
                            <tr key={gre.idGre} className="border-b border-gray-100 hover:bg-blue-50 transition-colors animate-fade-in">
                                <td className="py-3 px-3 text-center text-black">{index + 1}</td>
                                <td className="py-3 px-3 text-center text-black font-bold">{gre.tipoGuia}</td>
                                <td className="py-3 px-3 text-center text-black">{gre.serie}-{gre.numero}</td>
                                <td className="py-3 px-3 text-center text-black">{gre.fechaEmision}</td>
                                <td className="py-3 px-3 text-center text-black">{usuarioInfo.ruc}</td>
                                <td className="py-3 px-3 text-left text-black font-bold">{usuarioInfo.razonSocial}</td>
                                <td className="py-3 px-3 text-center">
                                    <button 
                                        onClick={() => abrirReclamo(gre)}
                                        className="bg-[#b42828] text-white px-4 py-1.5 rounded text-xs font-extrabold shadow hover:bg-red-800 transition-colors"
                                    >
                                        Presentar Reclamo
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para Presentar Reclamo */}
            {greSeleccionada && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-[500px] border-t-4 border-[#b42828]">
                        <h2 className="text-xl font-extrabold text-[#b42828] mb-2">Presentar Reclamo</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Guía de Remisión: <span className="font-bold text-black">{greSeleccionada.serie}-{greSeleccionada.numero}</span><br/>
                            Emisor: <span className="font-bold text-black">{greSeleccionada.razonSocialEmisor}</span>
                        </p>

                        <div className="mb-6">
                            <label className="text-black font-extrabold text-sm mb-2 block">
                                Motivo de la no conformidad <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={motivoReclamo}
                                onChange={(e) => setMotivoReclamo(e.target.value)}
                                placeholder="Describa el problema (ej. Cantidad incorrecta, bienes dañados...)"
                                className="w-full border border-gray-300 rounded p-3 text-sm text-black focus:outline-none focus:border-[#b42828] resize-none h-32"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setGreSeleccionada(null)}
                                className="bg-gray-200 text-black px-5 py-2 rounded text-sm font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={enviarReclamo}
                                className="bg-[#b42828] text-white px-6 py-2 rounded text-sm font-extrabold shadow hover:bg-red-800 transition-colors"
                            >
                                Enviar Reclamo
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
