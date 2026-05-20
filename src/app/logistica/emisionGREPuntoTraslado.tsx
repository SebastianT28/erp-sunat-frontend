"use client"

import { useState } from "react"
import { API_BASE_URL } from "../../config/api"

const API_URL = `${API_BASE_URL}/api/logistica/punto-traslado`

const ubigeoPeru: Record<string, Record<string, string[]>> = {
    "Lima": {
        "Lima": ["Cercado de Lima", "Ate", "Barranco", "Breña", "Comas", "Chorrillos", "El Agustino", "Jesus Maria", "La Molina", "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "Puente Piedra", "Rimac", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martin de Porres", "San Miguel", "Santa Anita", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa Maria del Triunfo"],
        "Callao": ["Callao", "Bellavista", "Carmen de la Legua", "La Perla", "La Punta", "Ventanilla", "Mi Peru"]
    },
    "Arequipa": {
        "Arequipa": ["Arequipa", "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Jacobo Hunter", "Jose Luis Bustamante y Rivero", "Mariano Melgar", "Miraflores", "Paucarpata", "Sabandia", "Sachaca", "Socabaya", "Tiabaya", "Yanahuara", "Yura"],
        "Caylloma": ["Chivay", "Cabanaconde", "Maca", "Yanque"]
    },
    "Cusco": {
        "Cusco": ["Cusco", "Ccorca", "Poroy", "San Jeronimo", "San Sebastian", "Santiago", "Saylla", "Wanchaq"],
        "Urubamba": ["Urubamba", "Chinchero", "Huayllabamba", "Machupicchu", "Maras", "Ollantaytambo", "Yucay"]
    },
    "La Libertad": {
        "Trujillo": ["Trujillo", "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo", "Moche", "Salaverry", "Victor Larco Herrera"]
    },
    "Piura": {
        "Piura": ["Piura", "Castilla", "Catacaos", "Cura Mori", "El Tallan", "La Arena", "La Union", "Las Lomas", "Tambo Grande"],
        "Sullana": ["Sullana", "Bellavista", "Ignacio Escudero", "Lancones", "Marcavelica", "Miguel Checa", "Querecotillo", "Salitral"]
    }
}

export interface Direccion {
    departamento: string
    provincia: string
    distrito: string
    direccionDetallada: string
}

interface DireccionFrecuente {
    idDireccion: number
    departamento: string
    provincia: string
    distrito: string
    direccionDetallada: string
    tipoFrecuente: string
}

interface EmisionGREPuntoTrasladoProps {
    onVolver?: () => void
    onSiguiente?: (partida: Direccion, llegada: Direccion) => void
}

export default function EmisionGREPuntoTraslado({ onVolver, onSiguiente }: EmisionGREPuntoTrasladoProps) {
    const [puntoPartida, setPuntoPartida] = useState<Direccion | null>(null)
    const [puntoLlegada, setPuntoLlegada] = useState<Direccion | null>(null)

    // Estados del modal de agregar
    const [modalAbierto, setModalAbierto] = useState(false)
    const [tipoPunto, setTipoPunto] = useState<"partida" | "llegada">("partida")
    const [departamento, setDepartamento] = useState("")
    const [provincia, setProvincia] = useState("")
    const [distrito, setDistrito] = useState("")
    const [direccionDetallada, setDireccionDetallada] = useState("")
    const [guardarFrecuente, setGuardarFrecuente] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [mensajeError, setMensajeError] = useState("")

    // Estados del sub-modal de frecuentes
    const [frecuentesModalAbierto, setFrecuentesModalAbierto] = useState(false)
    const [tipoFrecuenteModal, setTipoFrecuenteModal] = useState<"partida" | "llegada">("partida")
    const [frecuentes, setFrecuentes] = useState<DireccionFrecuente[]>([])
    const [cargandoFrecuentes, setCargandoFrecuentes] = useState(false)
    const [errorFrecuentes, setErrorFrecuentes] = useState("")
    const [busquedaFrecuente, setBusquedaFrecuente] = useState("")

    // Listas dinámicas
    const departamentos = Object.keys(ubigeoPeru)
    const provincias = departamento ? Object.keys(ubigeoPeru[departamento]) : []
    const distritos = (departamento && provincia && ubigeoPeru[departamento][provincia])
        ? ubigeoPeru[departamento][provincia]
        : []

    const puedeAgregar = departamento !== "" && provincia !== "" && distrito !== "" && direccionDetallada.trim() !== "" && !guardando
    const puedeSiguiente = puntoPartida !== null && puntoLlegada !== null

    const handleAbrirModal = (tipo: "partida" | "llegada") => {
        setTipoPunto(tipo)
        setDepartamento("")
        setProvincia("")
        setDistrito("")
        setDireccionDetallada("")
        setGuardarFrecuente(false)
        setMensajeError("")
        setModalAbierto(true)
    }

    const handleCerrarModal = () => {
        setModalAbierto(false)
        setMensajeError("")
    }

    const handleAgregar = async () => {
        if (!puedeAgregar) return
        setGuardando(true)
        setMensajeError("")

        try {
            const body = {
                departamento,
                provincia,
                distrito,
                direccionDetallada: direccionDetallada.trim(),
                frecuente: guardarFrecuente,
            }

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const data = await res.json()

            if (data.success) {
                const nuevaDireccion: Direccion = { departamento, provincia, distrito, direccionDetallada: direccionDetallada.trim() }
                if (tipoPunto === "partida") setPuntoPartida(nuevaDireccion)
                else setPuntoLlegada(nuevaDireccion)
                setModalAbierto(false)
            } else {
                setMensajeError(data.message || "Error al guardar la dirección")
            }
        } catch {
            setMensajeError("Error de conexión con el servidor")
        } finally {
            setGuardando(false)
        }
    }

    const handleEliminarPunto = (tipo: "partida" | "llegada") => {
        if (tipo === "partida") setPuntoPartida(null)
        else setPuntoLlegada(null)
    }

    // Abrir sub-modal de frecuentes
    const handleAbrirFrecuentes = async (tipo: "partida" | "llegada") => {
        setTipoFrecuenteModal(tipo)
        setFrecuentesModalAbierto(true)
        setCargandoFrecuentes(true)
        setErrorFrecuentes("")
        setBusquedaFrecuente("")
        try {
            const res = await fetch(`${API_URL}/frecuentes?tipo=${tipo}`)
            const data = await res.json()
            if (data.success) {
                setFrecuentes(data.data)
            } else {
                setErrorFrecuentes("No se pudo cargar los puntos frecuentes.")
            }
        } catch {
            setErrorFrecuentes("Error de conexión al cargar frecuentes.")
        } finally {
            setCargandoFrecuentes(false)
        }
    }

    // Seleccionar frecuente y autocompletar
    const handleSeleccionarFrecuente = (dir: DireccionFrecuente) => {
        const direccion: Direccion = {
            departamento: dir.departamento,
            provincia: dir.provincia,
            distrito: dir.distrito,
            direccionDetallada: dir.direccionDetallada,
        }
        if (tipoFrecuenteModal === "partida") setPuntoPartida(direccion)
        else setPuntoLlegada(direccion)
        setFrecuentesModalAbierto(false)
        setBusquedaFrecuente("")
    }

    const frecuentesFiltrados = frecuentes.filter(f =>
        f.direccionDetallada?.toLowerCase().includes(busquedaFrecuente.toLowerCase()) ||
        f.distrito?.toLowerCase().includes(busquedaFrecuente.toLowerCase()) ||
        f.departamento?.toLowerCase().includes(busquedaFrecuente.toLowerCase())
    )

    return (
        <div className="relative">
            <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

            <div className="flex gap-1 mb-6">
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#3399ff] rounded"></div>
                <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                <div className="flex-1 h-1 bg-gray-300 rounded"></div>
            </div>

            <h3 className="text-[#0063AE] font-extrabold text-base mb-2">4. Punto de partida y punto de llegada</h3>
            <p className="text-black font-extrabold text-sm mb-6">Seleccione los puntos de traslado</p>

            {/* Punto de Partida */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-black font-extrabold text-xs mb-3">Agrega el punto de partida</h4>
                {puntoPartida ? (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                        <div className="flex items-start gap-4">
                            <span className="text-green-600 font-bold mt-1">✓</span>
                            <div>
                                <p className="font-extrabold mb-1">{puntoPartida.direccionDetallada}</p>
                                <p className="text-gray-600 text-xs uppercase">{puntoPartida.departamento} - {puntoPartida.provincia} - {puntoPartida.distrito}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEliminarPunto("partida")} className="text-red-500 hover:text-red-700 font-bold px-2" title="Eliminar punto de partida">✕</button>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <button onClick={() => handleAbrirModal("partida")} className="bg-[#007bff] text-white px-10 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm">
                            + Agregar
                        </button>
                        <button onClick={() => handleAbrirFrecuentes("partida")} className="border border-[#3399ff] text-[#3399ff] font-extrabold text-xs px-4 py-2 rounded-sm hover:bg-[#3399ff] hover:text-white transition-colors flex items-center gap-1">
                            <span className="text-sm leading-none">📍</span> Puntos frecuentes
                        </button>
                    </div>
                )}
            </div>

            {/* Punto de Llegada */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-black font-extrabold text-xs mb-3">Agrega el punto de llegada</h4>
                {puntoLlegada ? (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                        <div className="flex items-start gap-4">
                            <span className="text-green-600 font-bold mt-1">✓</span>
                            <div>
                                <p className="font-extrabold mb-1">{puntoLlegada.direccionDetallada}</p>
                                <p className="text-gray-600 text-xs uppercase">{puntoLlegada.departamento} - {puntoLlegada.provincia} - {puntoLlegada.distrito}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEliminarPunto("llegada")} className="text-red-500 hover:text-red-700 font-bold px-2" title="Eliminar punto de llegada">✕</button>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <button onClick={() => handleAbrirModal("llegada")} className="bg-[#007bff] text-white px-10 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm">
                            + Agregar
                        </button>
                        <button onClick={() => handleAbrirFrecuentes("llegada")} className="border border-[#3399ff] text-[#3399ff] font-extrabold text-xs px-4 py-2 rounded-sm hover:bg-[#3399ff] hover:text-white transition-colors flex items-center gap-1">
                            <span className="text-sm leading-none">📍</span> Puntos frecuentes
                        </button>
                    </div>
                )}
            </div>

            {/* Botones Volver / Siguiente */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button onClick={onVolver} className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow">Volver</button>
                <button
                    onClick={() => { if (puntoPartida && puntoLlegada) onSiguiente?.(puntoPartida, puntoLlegada) }}
                    disabled={!puedeSiguiente}
                    className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeSiguiente ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                    Siguiente
                </button>
            </div>

            {/* ====== Modal Agregar Dirección ====== */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[650px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#007bff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-extrabold text-sm">
                                {tipoPunto === "partida" ? "Agregar el punto de partida" : "Agregar el punto de llegada"}
                            </span>
                            <button onClick={handleCerrarModal} className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none">✕</button>
                        </div>

                        <div className="p-6">
                            {mensajeError && (
                                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-bold">
                                    ❌ {mensajeError}
                                </div>
                            )}

                            <h4 className="text-black font-extrabold text-sm mb-4">Ingrese una dirección</h4>

                            <div className="flex gap-6 mb-4">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Departamento</label>
                                    <select
                                        value={departamento}
                                        onChange={(e) => { setDepartamento(e.target.value); setProvincia(""); setDistrito("") }}
                                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                                    >
                                        <option value="">Seleccione</option>
                                        {departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Provincia</label>
                                    <select
                                        value={provincia}
                                        onChange={(e) => { setProvincia(e.target.value); setDistrito("") }}
                                        disabled={!departamento}
                                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white disabled:bg-gray-100"
                                    >
                                        <option value="">Seleccione</option>
                                        {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="w-1/2 pr-3 mb-4">
                                <label className="text-black font-extrabold text-xs mb-2 block">Distrito</label>
                                <select
                                    value={distrito}
                                    onChange={(e) => setDistrito(e.target.value)}
                                    disabled={!provincia}
                                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white disabled:bg-gray-100"
                                >
                                    <option value="">Seleccione</option>
                                    {distritos.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="text-black font-extrabold text-xs mb-2 block">Dirección detallada</label>
                                <input
                                    type="text"
                                    value={direccionDetallada}
                                    onChange={(e) => setDireccionDetallada(e.target.value)}
                                    placeholder="DIRECCION"
                                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={guardarFrecuente} onChange={(e) => setGuardarFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">
                                        Guardar como punto de {tipoPunto === "partida" ? "partida" : "llegada"} frecuente
                                    </span>
                                </label>
                                <button
                                    onClick={handleAgregar}
                                    disabled={!puedeAgregar}
                                    className={`px-8 py-2 font-extrabold text-sm border transition-colors ${puedeAgregar ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}
                                >
                                    {guardando ? "Guardando..." : "Agregar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== Sub-modal: Puntos Frecuentes ====== */}
            {frecuentesModalAbierto && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
                    <div className="bg-white w-[700px] rounded shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="bg-[#002f6c] text-white flex items-center justify-between px-5 py-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">📍</span>
                                <span className="font-extrabold text-sm">
                                    Puntos de {tipoFrecuenteModal === "partida" ? "partida" : "llegada"} frecuentes
                                </span>
                            </div>
                            <button onClick={() => { setFrecuentesModalAbierto(false); setBusquedaFrecuente("") }} className="text-white text-xl font-bold hover:text-gray-300 transition-colors leading-none">✕</button>
                        </div>

                        {/* Buscador */}
                        <div className="px-5 pt-4 pb-3 border-b border-gray-200 shrink-0">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por dirección, distrito o departamento..."
                                    value={busquedaFrecuente}
                                    onChange={e => setBusquedaFrecuente(e.target.value)}
                                    className="w-full border border-gray-300 pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-[#002f6c] rounded"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="overflow-y-auto flex-1">
                            {cargandoFrecuentes ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <div className="w-8 h-8 border-4 border-[#002f6c] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-gray-500">Cargando puntos frecuentes...</span>
                                </div>
                            ) : errorFrecuentes ? (
                                <div className="px-5 py-8 text-center text-red-600 text-sm font-bold">{errorFrecuentes}</div>
                            ) : frecuentesFiltrados.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <div className="text-4xl mb-3">📭</div>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {busquedaFrecuente
                                            ? "No se encontraron puntos con ese criterio."
                                            : `No hay puntos de ${tipoFrecuenteModal === "partida" ? "partida" : "llegada"} frecuentes registrados.`}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Puede guardar puntos frecuentes al agregar una dirección.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-white font-extrabold uppercase bg-[#0063AE] sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Dirección</th>
                                            <th className="px-4 py-3">Distrito</th>
                                            <th className="px-4 py-3">Provincia</th>
                                            <th className="px-4 py-3">Departamento</th>
                                            <th className="px-4 py-3 text-center">Usar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {frecuentesFiltrados.map((f, idx) => (
                                            <tr
                                                key={f.idDireccion}
                                                className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                                onClick={() => handleSeleccionarFrecuente(f)}
                                            >
                                                <td className="px-4 py-3 font-bold text-[#002f6c] max-w-[180px] truncate">{f.direccionDetallada}</td>
                                                <td className="px-4 py-3 text-black">{f.distrito}</td>
                                                <td className="px-4 py-3 text-gray-700">{f.provincia}</td>
                                                <td className="px-4 py-3 text-gray-700">{f.departamento}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleSeleccionarFrecuente(f) }}
                                                        className="bg-[#0063AE] text-white px-4 py-1 text-xs font-extrabold rounded hover:bg-[#004d8a] transition-colors"
                                                    >
                                                        Usar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {!cargandoFrecuentes && !errorFrecuentes && `${frecuentesFiltrados.length} punto${frecuentesFiltrados.length !== 1 ? "s" : ""} encontrado${frecuentesFiltrados.length !== 1 ? "s" : ""}`}
                            </span>
                            <button onClick={() => { setFrecuentesModalAbierto(false); setBusquedaFrecuente("") }} className="bg-gray-200 text-gray-700 px-5 py-1.5 text-xs font-extrabold rounded hover:bg-gray-300 transition-colors">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
