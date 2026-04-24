"use client"

import { useState } from "react"

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

interface Direccion {
    departamento: string
    provincia: string
    distrito: string
    direccionDetallada: string
}

interface EmisionGREPuntoTrasladoProps {
    onVolver?: () => void
    onSiguiente?: () => void
}

export default function EmisionGREPuntoTraslado({ onVolver, onSiguiente }: EmisionGREPuntoTrasladoProps) {
    const [puntoPartida, setPuntoPartida] = useState<Direccion | null>(null)
    const [puntoLlegada, setPuntoLlegada] = useState<Direccion | null>(null)

    // Estados del modal
    const [modalAbierto, setModalAbierto] = useState(false)
    const [tipoPunto, setTipoPunto] = useState<"partida" | "llegada">("partida")

    const [departamento, setDepartamento] = useState("")
    const [provincia, setProvincia] = useState("")
    const [distrito, setDistrito] = useState("")
    const [direccionDetallada, setDireccionDetallada] = useState("")
    const [guardarFrecuente, setGuardarFrecuente] = useState(false)

    // Obtener listas dinámicas
    const departamentos = Object.keys(ubigeoPeru)
    const provincias = departamento ? Object.keys(ubigeoPeru[departamento]) : []
    const distritos = (departamento && provincia && ubigeoPeru[departamento][provincia])
        ? ubigeoPeru[departamento][provincia]
        : []

    const puedeAgregar = departamento !== "" && provincia !== "" && distrito !== "" && direccionDetallada.trim() !== ""
    const puedeSiguiente = puntoPartida !== null && puntoLlegada !== null

    const handleAbrirModal = (tipo: "partida" | "llegada") => {
        setTipoPunto(tipo)
        setDepartamento("")
        setProvincia("")
        setDistrito("")
        setDireccionDetallada("")
        setGuardarFrecuente(false)
        setModalAbierto(true)
    }

    const handleCerrarModal = () => {
        setModalAbierto(false)
    }

    const handleAgregar = () => {
        if (!puedeAgregar) return

        const nuevaDireccion: Direccion = {
            departamento,
            provincia,
            distrito,
            direccionDetallada,
        }

        if (tipoPunto === "partida") {
            setPuntoPartida(nuevaDireccion)
        } else {
            setPuntoLlegada(nuevaDireccion)
        }

        setModalAbierto(false)
    }

    const handleEliminarPunto = (tipo: "partida" | "llegada") => {
        if (tipo === "partida") setPuntoPartida(null)
        else setPuntoLlegada(null)
    }

    return (
        <div className="relative">
            {/* Título */}
            <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

            {/* Barra de progreso (5 pasos) */}
            <div className="flex gap-1 mb-6">
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 1 completado */}
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 2 completado */}
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 3 completado */}
                <div className="flex-1 h-1 bg-[#3399ff] rounded"></div> {/* Paso 4 activo */}
                <div className="flex-1 h-1 bg-gray-300 rounded"></div>
            </div>

            {/* Paso 4 */}
            <h3 className="text-[#0063AE] font-extrabold text-base mb-2">4. Punto de partida y punto de llegada</h3>

            <p className="text-black font-extrabold text-sm mb-6">Seleccione los puntos de traslado</p>

            {/* Sección Punto de partida */}
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
                        <button
                            onClick={() => handleEliminarPunto("partida")}
                            className="text-red-500 hover:text-red-700 font-bold px-2"
                            title="Eliminar punto de partida"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-6 items-center">
                        <button
                            onClick={() => handleAbrirModal("partida")}
                            className="bg-[#007bff] text-white px-16 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm"
                        >
                            + Agregar
                        </button>
                        <button className="text-[#3399ff] font-medium text-xs hover:underline flex items-center gap-1">
                            <span className="text-sm leading-none">🔍</span> Puntos de partida frecuentes
                        </button>
                    </div>
                )}
            </div>

            {/* Sección Punto de llegada */}
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
                        <button
                            onClick={() => handleEliminarPunto("llegada")}
                            className="text-red-500 hover:text-red-700 font-bold px-2"
                            title="Eliminar punto de llegada"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-6 items-center">
                        <button
                            onClick={() => handleAbrirModal("llegada")}
                            className="bg-[#007bff] text-white px-16 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm"
                        >
                            + Agregar
                        </button>
                        <button className="text-[#3399ff] font-medium text-xs hover:underline flex items-center gap-1">
                            <span className="text-sm leading-none">🔍</span> Puntos de llegada frecuentes
                        </button>
                    </div>
                )}
            </div>

            {/* Botones Volver y Siguiente */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button
                    onClick={onVolver}
                    className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow"
                >
                    Volver
                </button>
                <button
                    onClick={onSiguiente}
                    disabled={!puedeSiguiente}
                    className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeSiguiente
                            ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Siguiente
                </button>
            </div>

            {/* ====== Modal Agregar Dirección ====== */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[650px] rounded shadow-xl overflow-hidden flex flex-col">

                        {/* Header del modal */}
                        <div className="bg-[#007bff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-extrabold text-sm">
                                {tipoPunto === "partida" ? "Agregar el punto de partida" : "Agregar el punto de llegada"}
                            </span>
                            <button
                                onClick={handleCerrarModal}
                                className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Cuerpo del modal */}
                        <div className="p-6">
                            <h4 className="text-black font-extrabold text-sm mb-4">Ingrese una dirección</h4>

                            <div className="flex gap-6 mb-4">
                                {/* Departamento */}
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">
                                        Departamento
                                    </label>
                                    <select
                                        value={departamento}
                                        onChange={(e) => {
                                            setDepartamento(e.target.value)
                                            setProvincia("")
                                            setDistrito("")
                                        }}
                                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                                    >
                                        <option value="">Seleccione</option>
                                        {departamentos.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Provincia */}
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">
                                        Provincia
                                    </label>
                                    <select
                                        value={provincia}
                                        onChange={(e) => {
                                            setProvincia(e.target.value)
                                            setDistrito("")
                                        }}
                                        disabled={!departamento}
                                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white disabled:bg-gray-100"
                                    >
                                        <option value="">Seleccione</option>
                                        {provincias.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Distrito */}
                            <div className="w-1/2 pr-3 mb-4">
                                <label className="text-black font-extrabold text-xs mb-2 block">
                                    Distrito
                                </label>
                                <select
                                    value={distrito}
                                    onChange={(e) => setDistrito(e.target.value)}
                                    disabled={!provincia}
                                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white disabled:bg-gray-100"
                                >
                                    <option value="">Seleccione</option>
                                    {distritos.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dirección detallada */}
                            <div className="mb-6">
                                <label className="text-black font-extrabold text-xs mb-2 block">
                                    Dirección detallada
                                </label>
                                <input
                                    type="text"
                                    value={direccionDetallada}
                                    onChange={(e) => setDireccionDetallada(e.target.value)}
                                    placeholder="DIRECCION"
                                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                                />
                            </div>

                            {/* Checkbox y Botón Agregar */}
                            <div className="flex items-center justify-between mt-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={guardarFrecuente}
                                        onChange={(e) => setGuardarFrecuente(e.target.checked)}
                                        className="accent-[#0063AE] w-4 h-4"
                                    />
                                    <span className="text-gray-600 text-sm">
                                        Guardar como punto de {tipoPunto === "partida" ? "partida" : "llegada"} frecuente
                                    </span>
                                </label>

                                <button
                                    onClick={handleAgregar}
                                    disabled={!puedeAgregar}
                                    className={`px-8 py-2 font-extrabold text-sm border transition-colors ${puedeAgregar
                                            ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer"
                                            : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                                        }`}
                                >
                                    Agregar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
