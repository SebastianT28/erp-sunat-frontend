"use client"

import { useState } from "react"

export default function ConsultaGRE() {
    const [fase, setFase] = useState<1 | 2>(1)

    // Criterios de búsqueda
    const [tipoConsulta, setTipoConsulta] = useState<"GRE emitidas" | "GRE recibidas">("GRE emitidas")
    const [tipoGRE, setTipoGRE] = useState<"GRE - Remitente" | "GRE - Transportista">("GRE - Remitente")
    const [serie, setSerie] = useState("")
    const [numero, setNumero] = useState("")

    const handleSiguiente = () => {
        if (serie.trim() !== "" && numero.trim() !== "") {
            setFase(2)
        } else {
            alert("Por favor ingrese la Serie y el Número de la GRE.")
        }
    }

    const handleLimpiar = () => {
        setSerie("")
        setNumero("")
    }

    const handleNuevaConsulta = () => {
        setTipoConsulta("GRE emitidas")
        setTipoGRE("GRE - Remitente")
        setSerie("")
        setNumero("")
        setFase(1)
    }

    if (fase === 1) {
        return (
            <div className="w-full max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm">
                <h2 className="text-[#0063AE] font-extrabold text-lg mb-6">Consulta de GRE</h2>

                {/* Selector de Tipo de Consulta */}
                <div className="bg-[#0063AE] p-4 rounded-sm flex gap-6 items-center mb-8">
                    <span className="text-white font-extrabold text-sm">Realizar consulta de:</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipoConsulta"
                            checked={tipoConsulta === "GRE emitidas"}
                            onChange={() => setTipoConsulta("GRE emitidas")}
                            className="w-4 h-4 accent-white"
                        />
                        <span className="text-white text-sm font-medium">GRE emitidas</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipoConsulta"
                            checked={tipoConsulta === "GRE recibidas"}
                            onChange={() => setTipoConsulta("GRE recibidas")}
                            className="w-4 h-4 accent-white"
                        />
                        <span className="text-white text-sm font-medium">GRE recibidas</span>
                    </label>
                </div>

                <div className="mb-6">
                    <h3 className="text-black font-extrabold text-sm mb-4">Seleccione el tipo de GRE:</h3>
                    <div className="flex flex-col gap-2 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="tipoGRE"
                                checked={tipoGRE === "GRE - Remitente"}
                                onChange={() => setTipoGRE("GRE - Remitente")}
                                className="w-4 h-4 accent-[#0063AE]"
                            />
                            <span className="text-gray-700 text-sm">GRE - Remitente</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="tipoGRE"
                                checked={tipoGRE === "GRE - Transportista"}
                                onChange={() => setTipoGRE("GRE - Transportista")}
                                className="w-4 h-4 accent-[#0063AE]"
                            />
                            <span className="text-gray-700 text-sm">GRE - Transportista</span>
                        </label>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-black font-extrabold text-sm mb-4">Ingrese la numeración de la GRE:</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <label className="text-black font-extrabold text-sm">Serie</label>
                            <input
                                type="text"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                placeholder="Ej: T004"
                                className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:border-[#0063AE] uppercase text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-black font-extrabold text-sm">Número</label>
                            <input
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                placeholder="Ej: 23312"
                                className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:border-[#0063AE] text-sm"
                            />
                        </div>
                        <button
                            onClick={handleLimpiar}
                            className="bg-white text-[#3399ff] border border-[#3399ff] px-10 py-2 rounded text-sm hover:bg-blue-50 transition-colors ml-auto"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-6">
                    <button className="bg-white text-[#3399ff] border border-[#3399ff] px-10 py-2 rounded text-sm hover:bg-blue-50 transition-colors">
                        Volver
                    </button>
                    <button
                        onClick={handleSiguiente}
                        className="bg-[#007bff] text-white px-10 py-2 rounded text-sm font-medium hover:bg-[#0056b3] transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        )
    }

    // Fase 2: Resultados
    return (
        <div className="w-full max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#0063AE] font-extrabold text-base">3. Resultado de la consulta</h2>
                <button className="text-red-500 text-sm font-extrabold flex items-center gap-1 hover:underline">
                    <span className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">i</span>
                    Ayuda
                </button>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-8 text-sm">
                <div className="flex">
                    <span className="font-extrabold text-black w-40">Tipo de consulta:</span>
                    <span className="text-gray-700">{tipoConsulta}</span>
                </div>
                <div className="flex">
                    <span className="font-extrabold text-black w-40">Tipo de búsqueda:</span>
                    <span className="text-gray-700">Individual</span>
                </div>
                <div className="flex">
                    <span className="font-extrabold text-black w-40">Tipo de GRE:</span>
                    <span className="text-gray-700">{tipoGRE}</span>
                </div>
                <div className="flex">
                    <span className="font-extrabold text-black w-40">Numeración de la GRE:</span>
                    <span className="text-gray-700">{serie} - {numero}</span>
                </div>
            </div>

            <div className="overflow-x-auto mb-16">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="border-y border-gray-200">
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Tipo de GRE</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Numeración de GRE</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">RUC del emisor</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Fecha y hora de emisión</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Estado actual</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Ver</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Descargar representación</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Descargar XML</th>
                            <th className="py-3 px-2 text-[#0063AE] font-extrabold whitespace-nowrap text-center">Cantidad de GRE - por evento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={9} className="py-6 text-gray-600 text-sm">
                                No se encuentra resultados para la serie y número de la GRE ingresada. por favor verificar.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-6">
                <button
                    onClick={() => setFase(1)}
                    className="bg-white text-[#3399ff] border border-[#3399ff] px-10 py-2 rounded text-sm hover:bg-blue-50 transition-colors"
                >
                    Volver
                </button>
                <button
                    onClick={handleNuevaConsulta}
                    className="bg-[#007bff] text-white px-10 py-2 rounded text-sm font-medium hover:bg-[#0056b3] transition-colors"
                >
                    Nueva consulta
                </button>
            </div>
        </div>
    )
}
