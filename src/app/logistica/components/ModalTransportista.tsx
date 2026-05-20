"use client"

import { useState } from "react"
import { API_BASE_URL } from "../../../config/api"

const API_URL = `${API_BASE_URL}/api/logistica/transportista`

export interface Transportista {
    ruc: string
    razonSocial: string
    numRegistroMTC: string
    frecuente: boolean
}

interface ModalTransportistaProps {
    onAgregar: (t: Transportista) => void
    onCerrar: () => void
}

type EstadoRuc = "idle" | "buscando" | "encontrado" | "no_encontrado" | "error"

export default function ModalTransportista({ onAgregar, onCerrar }: ModalTransportistaProps) {
    const [ruc, setRuc] = useState("")
    const [razonSocial, setRazonSocial] = useState("")
    const [numRegistroMTC, setNumRegistroMTC] = useState("")
    const [frecuente, setFrecuente] = useState(false)
    const [errores, setErrores] = useState<Record<string, string>>({})

    // Estado de búsqueda en BD
    const [estadoRuc, setEstadoRuc] = useState<EstadoRuc>("idle")
    const [camposDeshabilitados, setCamposDeshabilitados] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [mensajeError, setMensajeError] = useState("")

    const validarRuc = (v: string) => /^\d{11}$/.test(v)

    const handleRucChange = (v: string) => {
        if (/^\d{0,11}$/.test(v)) {
            setRuc(v)
            if (errores.ruc) setErrores(e => ({ ...e, ruc: "" }))
            // Si el usuario modifica el RUC, resetear estado
            if (v.length < 11) {
                setEstadoRuc("idle")
                setRazonSocial("")
                setNumRegistroMTC("")
                setCamposDeshabilitados(false)
                setMensajeError("")
            }
            // Buscar automáticamente cuando llega a 11 dígitos
            if (v.length === 11) {
                buscarRucEnBD(v)
            }
        }
    }

    const buscarRucEnBD = async (rucValue: string) => {
        setEstadoRuc("buscando")
        setMensajeError("")
        try {
            const res = await fetch(`${API_URL}/validar/${rucValue}`)
            const data = await res.json()

            if (data.success && data.existe) {
                // Transportista encontrado: autocompletar campos
                setRazonSocial(data.data.razonSocial || "")
                setNumRegistroMTC(data.data.numRegistroMTC || "")
                setCamposDeshabilitados(true)
                setEstadoRuc("encontrado")
            } else {
                // No existe: dejar que el usuario llene los campos
                setRazonSocial("")
                setNumRegistroMTC("")
                setCamposDeshabilitados(false)
                setEstadoRuc("no_encontrado")
            }
        } catch {
            setEstadoRuc("error")
            setMensajeError("Error de conexión al validar el RUC.")
            setCamposDeshabilitados(false)
        }
    }

    const handleAgregar = async () => {
        // Validaciones frontend
        const newErrores: Record<string, string> = {}
        if (!validarRuc(ruc)) newErrores.ruc = "El RUC debe tener exactamente 11 dígitos."
        if (razonSocial.trim() === "") newErrores.razonSocial = "La razón social es requerida."
        if (Object.keys(newErrores).length > 0) { setErrores(newErrores); return }

        // Si es un transportista nuevo (no encontrado en BD), registrarlo primero
        if (estadoRuc === "no_encontrado") {
            setGuardando(true)
            setMensajeError("")
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ruc: Number(ruc),
                        razonSocial: razonSocial.trim(),
                        numRegistroMTC: numRegistroMTC.trim() || null,
                        frecuente,
                    }),
                })
                const data = await res.json()
                if (!data.success) {
                    setMensajeError(data.message || "Error al registrar el transportista.")
                    setGuardando(false)
                    return
                }
            } catch {
                setMensajeError("Error de conexión al registrar el transportista.")
                setGuardando(false)
                return
            }
            setGuardando(false)
        }

        // Si ya existe y se marca como frecuente, actualizar en BD
        if (estadoRuc === "encontrado" && frecuente) {
            try {
                await fetch(`${API_URL}/${ruc}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ frecuente: true }),
                })
            } catch {
                // No bloquear el flujo si falla la actualización de frecuente
            }
        }

        onAgregar({
            ruc,
            razonSocial: razonSocial.trim(),
            numRegistroMTC: numRegistroMTC.trim(),
            frecuente,
        })
    }

    const puedeAgregar = validarRuc(ruc) && razonSocial.trim() !== "" && !guardando && estadoRuc !== "buscando"

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[640px] rounded shadow-xl overflow-hidden flex flex-col">
                <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
                    <span className="font-extrabold text-sm">Agregar Transportista</span>
                    <button onClick={onCerrar} className="text-white text-xl font-bold hover:text-gray-200 leading-none">✕</button>
                </div>
                <div className="p-6 flex flex-col gap-5">
                    {/* Mensaje de error global */}
                    {mensajeError && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-bold">
                            ❌ {mensajeError}
                        </div>
                    )}

                    {/* RUC */}
                    <div>
                        <label className="text-black font-extrabold text-xs mb-1 block">RUC del Transportista <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                value={ruc}
                                onChange={e => handleRucChange(e.target.value)}
                                placeholder="Ingrese 11 dígitos"
                                maxLength={11}
                                className={`border px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] pr-10 ${errores.ruc ? "border-red-400 bg-red-50" : estadoRuc === "encontrado" ? "border-green-400 bg-green-50" : "border-gray-300"}`}
                            />
                            {/* Indicador de estado */}
                            {estadoRuc === "buscando" && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-[#0063AE] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            {estadoRuc === "encontrado" && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-sm">✓</span>
                            )}
                            {estadoRuc === "no_encontrado" && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-sm">⚠</span>
                            )}
                        </div>
                        {errores.ruc && <p className="text-red-500 text-xs mt-1">{errores.ruc}</p>}
                        {ruc.length > 0 && ruc.length < 11 && !errores.ruc && (
                            <p className="text-amber-500 text-xs mt-1">{ruc.length}/11 dígitos</p>
                        )}
                        {/* Mensajes de estado */}
                        {estadoRuc === "buscando" && (
                            <p className="text-blue-500 text-xs mt-1 font-medium">Buscando transportista en la base de datos...</p>
                        )}
                        {estadoRuc === "encontrado" && (
                            <p className="text-green-600 text-xs mt-1 font-bold">✓ Transportista encontrado. Los datos se han autocompletado.</p>
                        )}
                        {estadoRuc === "no_encontrado" && (
                            <p className="text-amber-600 text-xs mt-1 font-bold">⚠ Transportista no registrado. Complete los datos para agregarlo.</p>
                        )}
                    </div>

                    {/* Razón Social */}
                    <div>
                        <label className="text-black font-extrabold text-xs mb-1 block">Razón Social <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={razonSocial}
                            onChange={e => { setRazonSocial(e.target.value); if (errores.razonSocial) setErrores(er => ({ ...er, razonSocial: "" })) }}
                            placeholder="ESCRIBA"
                            disabled={camposDeshabilitados}
                            className={`border px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400 ${camposDeshabilitados ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""} ${errores.razonSocial ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                        />
                        {errores.razonSocial && <p className="text-red-500 text-xs mt-1">{errores.razonSocial}</p>}
                    </div>

                    {/* Registro MTC */}
                    <div>
                        <label className="text-black font-extrabold text-xs mb-1 block">Número de Registro MTC <span className="text-gray-400 font-normal">(opcional)</span></label>
                        <input
                            type="text"
                            value={numRegistroMTC}
                            onChange={e => setNumRegistroMTC(e.target.value)}
                            placeholder="ESCRIBA"
                            disabled={camposDeshabilitados}
                            className={`border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] uppercase placeholder-gray-400 ${camposDeshabilitados ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""}`}
                        />
                    </div>

                    {/* Frecuente */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={frecuente} onChange={e => setFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" />
                        <span className="text-gray-600 text-sm">Guardar como transportista frecuente</span>
                    </label>

                    {/* Acciones */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button onClick={onCerrar} className="px-8 py-2 text-sm font-extrabold border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handleAgregar}
                            disabled={!puedeAgregar}
                            className={`px-10 py-2 font-extrabold text-sm border transition-colors ${puedeAgregar ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}
                        >
                            {guardando ? "Guardando..." : estadoRuc === "encontrado" ? "Agregar" : "Registrar y Agregar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
