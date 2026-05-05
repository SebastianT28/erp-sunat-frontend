"use client"

import { useState } from "react"

const entidadesAutorizacion = [
    "MTC",
    "SUCAMEC",
    "DIGESA",
    "SENASA",
    "SERFOR",
]

const tiposDocumento = [
    "DNI",
    "Carnet de extranjería",
    "Pasaporte",
]

interface Autorizacion {
    entidad: string
    numero: string
}

export interface Vehiculo {
    placa: string
    entidad: string
    numeroAutorizacion: string
}

export interface Conductor {
    licencia: string
    tipoDocumento: string
    numeroDocumento: string
    nombres: string
}

interface EmisionGRETransporteProps {
    onVolver?: () => void
    onEmitir?: (data: { vehiculo: Vehiculo; conductor: Conductor; modalidad: string; fechaInicio: string }) => void
}

export default function EmisionGRETransporte({ onVolver, onEmitir }: EmisionGRETransporteProps) {
    // Modalidad y Fecha
    const [modalidad, setModalidad] = useState<"Privado" | "Publico">("Privado")
    const [transbordo, setTransbordo] = useState(false)
    const [vehiculoM1, setVehiculoM1] = useState(false)

    const [fechaInicio, setFechaInicio] = useState("")
    const [retornoEnvases, setRetornoEnvases] = useState(false)
    const [retornoVacio, setRetornoVacio] = useState(false)

    // Listas de datos
    const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([])
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
    const [conductores, setConductores] = useState<Conductor[]>([])

    // Modal Autorización
    const [modalAutorizacionAbierto, setModalAutorizacionAbierto] = useState(false)
    const [autEntidad, setAutEntidad] = useState("")
    const [autNumero, setAutNumero] = useState("")

    const puedeAgregarAut = autEntidad !== "" && autNumero.trim() !== ""

    const handleAgregarAutorizacion = () => {
        if (!puedeAgregarAut) return
        setAutorizaciones([...autorizaciones, { entidad: autEntidad, numero: autNumero }])
        setAutEntidad("")
        setAutNumero("")
        setModalAutorizacionAbierto(false)
    }

    // Modal Vehículo
    const [modalVehiculoAbierto, setModalVehiculoAbierto] = useState(false)
    const [vehPlaca, setVehPlaca] = useState("")
    const [vehEntidad, setVehEntidad] = useState("")
    const [vehNumeroAut, setVehNumeroAut] = useState("")
    const [vehFrecuente, setVehFrecuente] = useState(false)

    const puedeAgregarVeh = vehPlaca.trim() !== "" && vehEntidad !== "" && vehNumeroAut.trim() !== ""

    const handleAgregarVehiculo = () => {
        if (!puedeAgregarVeh) return
        setVehiculos([...vehiculos, { placa: vehPlaca, entidad: vehEntidad, numeroAutorizacion: vehNumeroAut }])
        setVehPlaca("")
        setVehEntidad("")
        setVehNumeroAut("")
        setVehFrecuente(false)
        setModalVehiculoAbierto(false)
    }

    // Modal Conductor
    const [modalConductorAbierto, setModalConductorAbierto] = useState(false)
    const [condLicencia, setCondLicencia] = useState("")
    const [condTipoDoc, setCondTipoDoc] = useState("")
    const [condNumDoc, setCondNumDoc] = useState("")
    const [condNombres, setCondNombres] = useState("")
    const [condFrecuente, setCondFrecuente] = useState(false)

    const puedeAgregarCond = condLicencia.trim() !== "" && condTipoDoc !== "" && condNumDoc.trim() !== "" && condNombres.trim() !== ""

    const handleAgregarConductor = () => {
        if (!puedeAgregarCond) return
        setConductores([...conductores, { licencia: condLicencia, tipoDocumento: condTipoDoc, numeroDocumento: condNumDoc, nombres: condNombres }])
        setCondLicencia("")
        setCondTipoDoc("")
        setCondNumDoc("")
        setCondNombres("")
        setCondFrecuente(false)
        setModalConductorAbierto(false)
    }

    const puedeEmitir = vehiculos.length > 0 && conductores.length > 0

    return (
        <div className="relative">
            {/* Título */}
            <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

            {/* Barra de progreso (5 pasos) */}
            <div className="flex gap-1 mb-6">
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
                <div className="flex-1 h-1 bg-[#3399ff] rounded"></div> {/* Paso 5 activo */}
            </div>

            <h3 className="text-[#0063AE] font-extrabold text-base mb-6">5. Datos del transporte</h3>

            {/* Modalidad de traslado */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setModalidad("Privado")}
                        className={`flex-1 py-3 text-sm font-extrabold transition-colors border ${modalidad === "Privado"
                                ? "bg-[#0b2982] text-white border-[#0b2982]"
                                : "bg-white text-[#3399ff] border-[#3399ff] hover:bg-blue-50"
                            }`}
                    >
                        Transporte Privado
                    </button>
                    <button
                        onClick={() => setModalidad("Publico")}
                        className={`flex-1 py-3 text-sm font-extrabold transition-colors border ${modalidad === "Publico"
                                ? "bg-[#0b2982] text-white border-[#0b2982]"
                                : "bg-white text-[#3399ff] border-[#3399ff] hover:bg-blue-50"
                            }`}
                    >
                        Transporte Público
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={transbordo}
                            onChange={(e) => setTransbordo(e.target.checked)}
                            className="accent-[#0b2982] w-4 h-4"
                        />
                        <span className="text-gray-600 text-sm">Realiza transbordo programado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={vehiculoM1}
                            onChange={(e) => setVehiculoM1(e.target.checked)}
                            className="accent-[#0b2982] w-4 h-4"
                        />
                        <span className="text-gray-600 text-sm">Traslado en vehículos de categoría M1 o L</span>
                    </label>
                </div>
            </div>

            {/* Autorización especial */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-black font-extrabold text-sm mb-3">Datos de la autorización especial para el traslado de carga</h4>

                {autorizaciones.map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                        <div className="flex items-center gap-4">
                            <span className="text-green-600 font-bold">✓</span>
                            <p className="font-extrabold">{a.entidad} - <span className="font-normal text-gray-600">{a.numero}</span></p>
                        </div>
                        <button onClick={() => setAutorizaciones(autorizaciones.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                    </div>
                ))}

                <button
                    onClick={() => setModalAutorizacionAbierto(true)}
                    className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm mt-2"
                >
                    + Agregar
                </button>
            </div>

            {/* Vehículo */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-black font-extrabold text-sm mb-3">Datos del vehículo</h4>

                {vehiculos.map((v, i) => (
                    <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                        <div className="flex items-start gap-4">
                            <span className="text-green-600 font-bold mt-1">✓</span>
                            <div>
                                <p className="font-extrabold mb-1">Placa: {v.placa}</p>
                                <p className="text-gray-600 text-xs uppercase">Aut: {v.entidad} - {v.numeroAutorizacion}</p>
                            </div>
                        </div>
                        <button onClick={() => setVehiculos(vehiculos.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                    </div>
                ))}

                <div className="flex gap-6 items-center mt-2">
                    <button
                        onClick={() => setModalVehiculoAbierto(true)}
                        className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm"
                    >
                        + Agregar
                    </button>
                    <button className="text-[#3399ff] font-medium text-xs hover:underline flex items-center gap-1">
                        <span className="text-sm leading-none">🔍</span> Vehículos frecuentes
                    </button>
                </div>
            </div>

            {/* Conductor */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h4 className="text-black font-extrabold text-sm mb-3">Datos de conductores</h4>

                {conductores.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                        <div className="flex items-start gap-4">
                            <span className="text-green-600 font-bold mt-1">✓</span>
                            <div>
                                <p className="font-extrabold mb-1">{c.nombres}</p>
                                <p className="text-gray-600 text-xs uppercase">Licencia: {c.licencia} | {c.tipoDocumento}: {c.numeroDocumento}</p>
                            </div>
                        </div>
                        <button onClick={() => setConductores(conductores.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                    </div>
                ))}

                <div className="flex gap-6 items-center mt-2">
                    <button
                        onClick={() => setModalConductorAbierto(true)}
                        className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm"
                    >
                        + Agregar
                    </button>
                    <button className="text-[#3399ff] font-medium text-xs hover:underline flex items-center gap-1">
                        <span className="text-sm leading-none">🔍</span> Conductores frecuentes
                    </button>
                </div>
            </div>

            {/* Fecha de inicio de traslado */}
            <div className="mb-8">
                <h4 className="text-black font-extrabold text-sm mb-3">Fecha de inicio de traslado</h4>

                <div className="w-1/2 mb-4 relative">
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-gray-50 uppercase"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={retornoEnvases}
                            onChange={(e) => setRetornoEnvases(e.target.checked)}
                            className="accent-[#0063AE] w-4 h-4"
                        />
                        <span className="text-gray-600 text-sm">Retorno de vehículo con envases o embalajes vacíos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={retornoVacio}
                            onChange={(e) => setRetornoVacio(e.target.checked)}
                            className="accent-[#0063AE] w-4 h-4"
                        />
                        <span className="text-gray-600 text-sm">Retorno de vehículo vacío</span>
                    </label>
                </div>
            </div>

            {/* Botones Volver y Emitir */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button
                    onClick={onVolver}
                    className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow"
                >
                    Volver
                </button>
                <button
                    onClick={() => { if (puedeEmitir) onEmitir?.({ vehiculo: vehiculos[0], conductor: conductores[0], modalidad, fechaInicio }) }}
                    disabled={!puedeEmitir}
                    className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeEmitir
                        ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Emitir GRE
                </button>
            </div>

            {/* ====== MODAL 1: AUTORIZACIÓN ====== */}
            {modalAutorizacionAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[800px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar autorización especial para el traslado de la carga</span>
                            <button onClick={() => setModalAutorizacionAbierto(false)} className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-6 mb-16">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Entidad emisora de la autorización especial</label>
                                    <select value={autEntidad} onChange={(e) => setAutEntidad(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {entidadesAutorizacion.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de autorización especial emitido por la entidad</label>
                                    <input type="text" value={autNumero} onChange={(e) => setAutNumero(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE]" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleAgregarAutorizacion} disabled={!puedeAgregarAut} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarAut ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== MODAL 2: VEHÍCULO ====== */}
            {modalVehiculoAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Vehículo</span>
                            <button onClick={() => setModalVehiculoAbierto(false)} className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="w-1/2 pr-3 mb-6">
                                <label className="text-black font-extrabold text-xs mb-2 block">Número de placa</label>
                                <input type="text" value={vehPlaca} onChange={(e) => setVehPlaca(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase" />
                            </div>

                            <h5 className="text-black font-extrabold text-sm mb-4">Datos de la autorización especial para el traslado de la carga</h5>
                            <div className="flex gap-6 mb-12">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Entidad emisora de la autorización</label>
                                    <select value={vehEntidad} onChange={(e) => setVehEntidad(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {entidadesAutorizacion.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de autorización</label>
                                    <input type="text" value={vehNumeroAut} onChange={(e) => setVehNumeroAut(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={vehFrecuente} onChange={(e) => setVehFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como vehículo frecuente</span>
                                </label>
                                <button onClick={handleAgregarVehiculo} disabled={!puedeAgregarVeh} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarVeh ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== MODAL 3: CONDUCTOR ====== */}
            {modalConductorAbierto && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Conductor</span>
                            <button onClick={() => setModalConductorAbierto(false)} className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-6 mb-6">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de licencia de conducir</label>
                                    <input type="text" value={condLicencia} onChange={(e) => setCondLicencia(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Tipo de documento de identidad</label>
                                    <select value={condTipoDoc} onChange={(e) => setCondTipoDoc(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {tiposDocumento.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-6 mb-16">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de documento de identidad</label>
                                    <input type="text" value={condNumDoc} onChange={(e) => setCondNumDoc(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Apellidos y Nombres</label>
                                    <input type="text" value={condNombres} onChange={(e) => setCondNombres(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={condFrecuente} onChange={(e) => setCondFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como conductor frecuente</span>
                                </label>
                                <button onClick={handleAgregarConductor} disabled={!puedeAgregarCond} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarCond ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
