"use client"

import { useState } from "react"
import ModalTransportista, { Transportista } from "./components/ModalTransportista"

const entidadesAutorizacion = ["MTC", "SUCAMEC", "DIGESA", "SENASA", "SERFOR"]
const tiposDocumento = ["DNI", "Carnet de extranjería", "Pasaporte"]

export interface Vehiculo { placa: string; entidad: string; numeroAutorizacion: string }
export interface Conductor { licencia: string; tipoDocumento: string; numeroDocumento: string; nombres: string }

interface EmisionGRETransporteProps {
    onVolver?: () => void
    onSiguiente?: (data: {
        modalidad: string
        fechaInicio: string
        transbordo: boolean
        vehiculoM1: boolean
        vehiculo?: Vehiculo
        conductor?: Conductor
        transportista?: Transportista
        vehiculoPublico?: Vehiculo
        conductorPublico?: Conductor
    }) => void
}

export default function EmisionGRETransporte({ onVolver, onSiguiente }: EmisionGRETransporteProps) {
    const [modalidad, setModalidad] = useState<"Privado" | "Publico">("Privado")
    const [transbordo, setTransbordo] = useState(false)
    const [vehiculoM1, setVehiculoM1] = useState(false)
    const [fechaInicio, setFechaInicio] = useState("")
    const [retornoEnvases, setRetornoEnvases] = useState(false)
    const [retornoVacio, setRetornoVacio] = useState(false)

    // — Privado —
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
    const [conductores, setConductores] = useState<Conductor[]>([])
    const [modalVeh, setModalVeh] = useState(false)
    const [vehPlaca, setVehPlaca] = useState(""); const [vehEntidad, setVehEntidad] = useState(""); const [vehNumeroAut, setVehNumeroAut] = useState(""); const [vehFrecuente, setVehFrecuente] = useState(false)
    const puedeAgregarVeh = vehPlaca.trim() !== "" && vehEntidad !== "" && vehNumeroAut.trim() !== ""
    const handleAgregarVeh = () => { if (!puedeAgregarVeh) return; setVehiculos([...vehiculos, { placa: vehPlaca, entidad: vehEntidad, numeroAutorizacion: vehNumeroAut }]); setVehPlaca(""); setVehEntidad(""); setVehNumeroAut(""); setVehFrecuente(false); setModalVeh(false) }

    const [modalCond, setModalCond] = useState(false)
    const [condLicencia, setCondLicencia] = useState(""); const [condTipoDoc, setCondTipoDoc] = useState(""); const [condNumDoc, setCondNumDoc] = useState(""); const [condNombres, setCondNombres] = useState(""); const [condFrecuente, setCondFrecuente] = useState(false)
    const puedeAgregarCond = condLicencia.trim() !== "" && condTipoDoc !== "" && condNumDoc.trim() !== "" && condNombres.trim() !== ""
    const handleAgregarCond = () => { if (!puedeAgregarCond) return; setConductores([...conductores, { licencia: condLicencia, tipoDocumento: condTipoDoc, numeroDocumento: condNumDoc, nombres: condNombres }]); setCondLicencia(""); setCondTipoDoc(""); setCondNumDoc(""); setCondNombres(""); setCondFrecuente(false); setModalCond(false) }

    // — Público —
    const [transportista, setTransportista] = useState<Transportista | null>(null)
    const [modalTransp, setModalTransp] = useState(false)
    const [registrarVehCond, setRegistrarVehCond] = useState(false)
    // Vehículo público (modal separado)
    const [vehiculoPublico, setVehiculoPublico] = useState<Vehiculo | null>(null)
    const [modalVehPubl, setModalVehPubl] = useState(false)
    const [vehPubPlaca, setVehPubPlaca] = useState(""); const [vehPubEntidad, setVehPubEntidad] = useState(""); const [vehPubNumAut, setVehPubNumAut] = useState(""); const [vehPubFrecuente, setVehPubFrecuente] = useState(false)
    const puedeAgregarVehPub = vehPubPlaca.trim() !== "" && vehPubEntidad !== "" && vehPubNumAut.trim() !== ""
    const handleAgregarVehPub = () => { if (!puedeAgregarVehPub) return; setVehiculoPublico({ placa: vehPubPlaca, entidad: vehPubEntidad, numeroAutorizacion: vehPubNumAut }); setVehPubPlaca(""); setVehPubEntidad(""); setVehPubNumAut(""); setVehPubFrecuente(false); setModalVehPubl(false) }
    // Conductor público (modal separado)
    const [conductorPublico, setConductorPublico] = useState<Conductor | null>(null)
    const [modalCondPubl, setModalCondPubl] = useState(false)
    const [condPubLicencia, setCondPubLicencia] = useState(""); const [condPubTipoDoc, setCondPubTipoDoc] = useState(""); const [condPubNumDoc, setCondPubNumDoc] = useState(""); const [condPubNombres, setCondPubNombres] = useState(""); const [condPubFrecuente, setCondPubFrecuente] = useState(false)
    const puedeAgregarCondPub = condPubLicencia.trim() !== "" && condPubTipoDoc !== "" && condPubNumDoc.trim() !== "" && condPubNombres.trim() !== ""
    const handleAgregarCondPub = () => { if (!puedeAgregarCondPub) return; setConductorPublico({ licencia: condPubLicencia, tipoDocumento: condPubTipoDoc, numeroDocumento: condPubNumDoc, nombres: condPubNombres }); setCondPubLicencia(""); setCondPubTipoDoc(""); setCondPubNumDoc(""); setCondPubNombres(""); setCondPubFrecuente(false); setModalCondPubl(false) }

    // — Lógica de habilitación —
    const puedeEmitirPrivado = vehiculos.length > 0 && conductores.length > 0 && fechaInicio !== ""
    const puedeEmitirPublico = transportista !== null && fechaInicio !== ""

    const puedeEmitir = modalidad === "Privado" ? puedeEmitirPrivado : puedeEmitirPublico



    const handleSiguiente = () => {
        if (!puedeEmitir) return
        if (modalidad === "Privado") {
            onSiguiente?.({
                modalidad, fechaInicio, transbordo, vehiculoM1,
                vehiculo: vehiculos[0], conductor: conductores[0],
            })
        } else {
            onSiguiente?.({
                modalidad, fechaInicio, transbordo, vehiculoM1,
                transportista: transportista ?? undefined,
                vehiculoPublico: vehiculoPublico ?? undefined,
                conductorPublico: conductorPublico ?? undefined,
            })
        }
    }

    // — Cambio de modalidad: limpiar estado del otro modo —
    const handleSetModalidad = (m: "Privado" | "Publico") => {
        setModalidad(m)
        setFechaInicio("")
    }

    return (
        <div className="relative">
            <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>
            <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="flex-1 h-1 bg-[#002f6c] rounded" />)}
                <div className="flex-1 h-1 bg-[#3399ff] rounded" />
                <div className="flex-1 h-1 bg-gray-300 rounded" />
            </div>
            <h3 className="text-[#0063AE] font-extrabold text-base mb-6">5. Datos del transporte</h3>

            {/* Selector modalidad */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <div className="flex gap-4 mb-4">
                    {(["Privado", "Publico"] as const).map(m => (
                        <button key={m} onClick={() => handleSetModalidad(m)}
                            className={`flex-1 py-3 text-sm font-extrabold transition-colors border ${modalidad === m ? "bg-[#0b2982] text-white border-[#0b2982]" : "bg-white text-[#3399ff] border-[#3399ff] hover:bg-blue-50"}`}>
                            {m === "Privado" ? "Transporte Privado" : "Transporte Público"}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={transbordo} onChange={e => setTransbordo(e.target.checked)} className="accent-[#0b2982] w-4 h-4" />
                        <span className="text-gray-600 text-sm">Realiza transbordo programado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={vehiculoM1} onChange={e => setVehiculoM1(e.target.checked)} className="accent-[#0b2982] w-4 h-4" />
                        <span className="text-gray-600 text-sm">Traslado en vehículos de categoría M1 o L</span>
                    </label>
                </div>
            </div>

            {/* ======== TRANSPORTE PRIVADO ======== */}
            {modalidad === "Privado" && (<>
                {/* Vehículo */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h4 className="text-black font-extrabold text-sm mb-3">Datos del vehículo</h4>
                    {vehiculos.map((v, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                            <div className="flex items-start gap-4">
                                <span className="text-green-600 font-bold mt-1">✓</span>
                                <div><p className="font-extrabold mb-1">Placa: {v.placa}</p><p className="text-gray-600 text-xs uppercase">Aut: {v.entidad} - {v.numeroAutorizacion}</p></div>
                            </div>
                            <button onClick={() => setVehiculos(vehiculos.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                        </div>
                    ))}
                    <button onClick={() => setModalVeh(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm mt-2">+ Agregar</button>
                </div>
                {/* Conductor */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h4 className="text-black font-extrabold text-sm mb-3">Datos de conductores</h4>
                    {conductores.map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-3">
                            <div className="flex items-start gap-4">
                                <span className="text-green-600 font-bold mt-1">✓</span>
                                <div><p className="font-extrabold mb-1">{c.nombres}</p><p className="text-gray-600 text-xs uppercase">Licencia: {c.licencia} | {c.tipoDocumento}: {c.numeroDocumento}</p></div>
                            </div>
                            <button onClick={() => setConductores(conductores.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                        </div>
                    ))}
                    <button onClick={() => setModalCond(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm mt-2">+ Agregar</button>
                </div>
            </>)}

            {/* ======== TRANSPORTE PÚBLICO ======== */}
            {modalidad === "Publico" && (<>
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h4 className="text-black font-extrabold text-sm mb-3">Datos del transportista</h4>
                    {transportista ? (
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black mb-4">
                            <div className="flex items-start gap-4">
                                <span className="text-green-600 font-bold mt-1">✓</span>
                                <div>
                                    <p className="font-extrabold mb-1">{transportista.razonSocial}</p>
                                    <p className="text-gray-600 text-xs">RUC: {transportista.ruc}{transportista.numRegistroMTC ? ` | MTC: ${transportista.numRegistroMTC}` : ""}</p>
                                    {transportista.frecuente && <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Frecuente</span>}
                                </div>
                            </div>
                            <button onClick={() => { setTransportista(null); setRegistrarVehCond(false) }} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                        </div>
                    ) : (
                        <button onClick={() => setModalTransp(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm">+ Agregar transportista</button>
                    )}

                    {/* Checkbox vehículo/conductor (opcional) */}
                    {transportista && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={registrarVehCond} onChange={e => { setRegistrarVehCond(e.target.checked); if (!e.target.checked) { setVehiculoPublico(null); setConductorPublico(null) } }} className="accent-[#0063AE] w-4 h-4" />
                                <span className="text-gray-700 text-sm font-semibold">Registrar vehículo y conductor del transportista <span className="text-gray-400 font-normal">(opcional)</span></span>
                            </label>
                        </div>
                    )}

                    {/* Secciones desplegables vehículo y conductor */}
                    {transportista && registrarVehCond && (
                        <div className="mt-5 flex flex-col gap-6">
                            {/* — Vehículo — */}
                            <div className="border border-gray-200 rounded p-4">
                                <h5 className="text-black font-extrabold text-xs mb-3 uppercase tracking-wide">Vehículo del transportista</h5>
                                {vehiculoPublico ? (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black">
                                        <div className="flex items-start gap-3">
                                            <span className="text-green-600 font-bold mt-0.5">✓</span>
                                            <div>
                                                <p className="font-extrabold mb-0.5">Placa: {vehiculoPublico.placa}</p>
                                                <p className="text-gray-500 text-xs uppercase">Aut: {vehiculoPublico.entidad} - {vehiculoPublico.numeroAutorizacion}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setVehiculoPublico(null)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setModalVehPubl(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm">+ Agregar vehículo</button>
                                )}
                            </div>
                            {/* — Conductor — */}
                            <div className="border border-gray-200 rounded p-4">
                                <h5 className="text-black font-extrabold text-xs mb-3 uppercase tracking-wide">Conductor del transportista</h5>
                                {conductorPublico ? (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-black">
                                        <div className="flex items-start gap-3">
                                            <span className="text-green-600 font-bold mt-0.5">✓</span>
                                            <div>
                                                <p className="font-extrabold mb-0.5">{conductorPublico.nombres}</p>
                                                <p className="text-gray-500 text-xs uppercase">Licencia: {conductorPublico.licencia} | {conductorPublico.tipoDocumento}: {conductorPublico.numeroDocumento}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setConductorPublico(null)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setModalCondPubl(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors rounded-sm">+ Agregar conductor</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </>)}

            {/* Fecha de inicio */}
            <div className="mb-8">
                <h4 className="text-black font-extrabold text-sm mb-3">Fecha de traslado de bienes <span className="text-red-500">*</span></h4>
                <div className="w-1/2 mb-4">
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-gray-50" />
                    {fechaInicio === "" && <p className="text-amber-500 text-xs mt-1">Campo obligatorio para emitir la GRE.</p>}
                </div>
                {modalidad === "Privado" && (
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={retornoEnvases} onChange={e => setRetornoEnvases(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                            <span className="text-gray-600 text-sm">Retorno de vehículo con envases o embalajes vacíos</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={retornoVacio} onChange={e => setRetornoVacio(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                            <span className="text-gray-600 text-sm">Retorno de vehículo vacío</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button onClick={onVolver} className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow">Volver</button>
                <button onClick={handleSiguiente} disabled={!puedeEmitir}
                    className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeEmitir ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                    Siguiente
                </button>
            </div>

            {/* ====== Modal Transportista ====== */}
            {modalTransp && (
                <ModalTransportista
                    onAgregar={t => { setTransportista(t); setModalTransp(false) }}
                    onCerrar={() => setModalTransp(false)}
                />
            )}

            {/* ====== Modal Vehículo (Privado) ====== */}
            {modalVeh && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Vehículo</span>
                            <button onClick={() => setModalVeh(false)} className="text-white text-xl font-bold hover:text-gray-200 leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="w-1/2 pr-3 mb-6">
                                <label className="text-black font-extrabold text-xs mb-2 block">Número de placa</label>
                                <input type="text" value={vehPlaca} onChange={e => setVehPlaca(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                            </div>
                            <h5 className="text-black font-extrabold text-sm mb-4">Datos de la autorización especial para el traslado de la carga</h5>
                            <div className="flex gap-6 mb-12">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Entidad emisora</label>
                                    <select value={vehEntidad} onChange={e => setVehEntidad(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {entidadesAutorizacion.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de autorización</label>
                                    <input type="text" value={vehNumeroAut} onChange={e => setVehNumeroAut(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={vehFrecuente} onChange={e => setVehFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como vehículo frecuente</span>
                                </label>
                                <button onClick={handleAgregarVeh} disabled={!puedeAgregarVeh} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarVeh ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== Modal Conductor (Privado) ====== */}
            {modalCond && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Conductor</span>
                            <button onClick={() => setModalCond(false)} className="text-white text-xl font-bold hover:text-gray-200 leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-6 mb-6">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">N° de licencia de conducir</label>
                                    <input type="text" value={condLicencia} onChange={e => setCondLicencia(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Tipo de documento</label>
                                    <select value={condTipoDoc} onChange={e => setCondTipoDoc(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {tiposDocumento.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-6 mb-16">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">N° de documento</label>
                                    <input type="text" value={condNumDoc} onChange={e => setCondNumDoc(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Apellidos y Nombres</label>
                                    <input type="text" value={condNombres} onChange={e => setCondNombres(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={condFrecuente} onChange={e => setCondFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como conductor frecuente</span>
                                </label>
                                <button onClick={handleAgregarCond} disabled={!puedeAgregarCond} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarCond ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== Modal Vehículo Público ====== */}
            {modalVehPubl && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Vehículo del Transportista</span>
                            <button onClick={() => setModalVehPubl(false)} className="text-white text-xl font-bold hover:text-gray-200 leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="w-1/2 pr-3 mb-6">
                                <label className="text-black font-extrabold text-xs mb-2 block">Número de placa</label>
                                <input type="text" value={vehPubPlaca} onChange={e => setVehPubPlaca(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                            </div>
                            <h5 className="text-black font-extrabold text-sm mb-4">Datos de la autorización especial para el traslado de la carga</h5>
                            <div className="flex gap-6 mb-12">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Entidad emisora</label>
                                    <select value={vehPubEntidad} onChange={e => setVehPubEntidad(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {entidadesAutorizacion.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Número de autorización</label>
                                    <input type="text" value={vehPubNumAut} onChange={e => setVehPubNumAut(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={vehPubFrecuente} onChange={e => setVehPubFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como vehículo frecuente</span>
                                </label>
                                <button onClick={handleAgregarVehPub} disabled={!puedeAgregarVehPub} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarVehPub ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== Modal Conductor Público ====== */}
            {modalCondPubl && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                            <span className="font-medium text-sm">Agregar Conductor del Transportista</span>
                            <button onClick={() => setModalCondPubl(false)} className="text-white text-xl font-bold hover:text-gray-200 leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-6 mb-6">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">N° de licencia de conducir</label>
                                    <input type="text" value={condPubLicencia} onChange={e => setCondPubLicencia(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Tipo de documento</label>
                                    <select value={condPubTipoDoc} onChange={e => setCondPubTipoDoc(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white">
                                        <option value="">Seleccione</option>
                                        {tiposDocumento.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-6 mb-16">
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">N° de documento</label>
                                    <input type="text" value={condPubNumDoc} onChange={e => setCondPubNumDoc(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-black font-extrabold text-xs mb-2 block">Apellidos y Nombres</label>
                                    <input type="text" value={condPubNombres} onChange={e => setCondPubNombres(e.target.value)} placeholder="ESCRIBA" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={condPubFrecuente} onChange={e => setCondPubFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                                    <span className="text-gray-600 text-sm">Guardar como conductor frecuente</span>
                                </label>
                                <button onClick={handleAgregarCondPub} disabled={!puedeAgregarCondPub} className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarCondPub ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
