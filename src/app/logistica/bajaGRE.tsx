"use client"

import { useState } from "react"

export default function BajaGRE() {
    const [tipoGRE, setTipoGRE] = useState("")
    const [serie, setSerie] = useState("")
    const [numero, setNumero] = useState("")
    const [tipoBaja, setTipoBaja] = useState("")

    const puedeDarBaja = tipoGRE !== "" && serie.trim() !== "" && numero.trim() !== "" && tipoBaja !== ""

    const handleDarBaja = () => {
        if (!puedeDarBaja) return
        alert(`Baja registrada para GRE ${serie}-${numero} exitosamente.`)
        // Limpiar formulario si se desea
        setTipoGRE("")
        setSerie("")
        setNumero("")
        setTipoBaja("")
    }

    return (
        <div className="w-full max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-[#0063AE] font-extrabold text-base">Datos de Guía de Remisión Electrónica</h2>
                <button className="text-red-500 text-sm font-extrabold flex items-center gap-1 hover:underline">
                    <span className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">i</span>
                    Ayuda
                </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-12">
                {/* Tipo de GRE */}
                <div>
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

                {/* Serie de la GRE */}
                <div>
                    <label className="text-black font-extrabold text-sm mb-2 block">Serie de la GRE</label>
                    <input
                        type="text"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value.toUpperCase())}
                        placeholder="ESCRIBA"
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                    />
                </div>

                {/* Número de la GRE */}
                <div>
                    <label className="text-black font-extrabold text-sm mb-2 block">Número de la GRE</label>
                    <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="ESCRIBA"
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400"
                    />
                </div>

                {/* Tipo de baja */}
                <div>
                    <label className="text-black font-extrabold text-sm mb-2 block">Tipo de baja</label>
                    <select
                        value={tipoBaja}
                        onChange={(e) => setTipoBaja(e.target.value)}
                        className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                    >
                        <option value="" disabled>Seleccione</option>
                        <option value="CambioDestinatario">Durante el traslado por cambio de destinatario</option>
                        <option value="AntesInicio">Antes de iniciar el traslado</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end border-t border-gray-200 pt-6">
                <button
                    onClick={handleDarBaja}
                    disabled={!puedeDarBaja}
                    className={`px-10 py-2 rounded text-sm font-extrabold transition-colors shadow ${puedeDarBaja
                            ? "bg-[#007bff] text-white hover:bg-[#0056b3] cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Dar de baja
                </button>
            </div>
        </div>
    )
}
