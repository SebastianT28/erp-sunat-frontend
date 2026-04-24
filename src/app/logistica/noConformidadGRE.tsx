"use client"

import { useState } from "react"

export default function NoConformidadGRE() {
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")
    const [numeroRUC, setNumeroRUC] = useState("")
    const [condicionUsuario, setCondicionUsuario] = useState("")

    const handleLimpiar = () => {
        setFechaDesde("")
        setFechaHasta("")
        setNumeroRUC("")
        setCondicionUsuario("")
    }

    const handleBuscar = () => {
        // Lógica de búsqueda
        alert("Buscando guías de remisión...")
    }

    return (
        <div className="w-full max-w-6xl mx-auto bg-white p-6 shadow-sm rounded-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#0063AE] font-extrabold text-base">Pendientes de revisión</h2>
                <button className="text-red-500 text-sm font-extrabold flex items-center gap-1 hover:underline">
                    <span className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">i</span>
                    Ayuda
                </button>
            </div>

            <h3 className="text-black font-extrabold text-sm mb-6">Guías de remisión</h3>

            {/* Formulario de búsqueda */}
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-4 gap-y-6 items-center mb-8">
                {/* Fechas */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap">Fecha de Emisión del:</label>
                <div className="flex items-center gap-4">
                    <input 
                        type="date" 
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#0063AE]"
                    />
                    <span className="text-black font-extrabold text-sm">al</span>
                    <input 
                        type="date" 
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#0063AE]"
                    />
                </div>

                {/* Número de RUC */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap text-right pr-4">Número de RUC:</label>
                <input 
                    type="text" 
                    value={numeroRUC}
                    onChange={(e) => setNumeroRUC(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 text-sm w-full focus:outline-none focus:border-[#0063AE]"
                />

                {/* Condición del usuario */}
                <label className="text-black font-extrabold text-sm whitespace-nowrap">Condición del usuario:</label>
                <select 
                    value={condicionUsuario}
                    onChange={(e) => setCondicionUsuario(e.target.value)}
                    className="border border-gray-300 px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#0063AE] bg-white"
                >
                    <option value="" disabled>Seleccione</option>
                    <option value="Destinatario">Destinatario</option>
                    <option value="Transportista">Transportista</option>
                </select>
                
                {/* Espacio vacío para alinear la grilla */}
                <div className="col-span-2"></div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 mb-8">
                <button 
                    onClick={handleBuscar}
                    className="bg-white text-gray-400 border border-gray-300 px-24 py-2 rounded-sm text-sm hover:bg-gray-50 transition-colors"
                >
                    Buscar
                </button>
                <button 
                    onClick={handleLimpiar}
                    className="bg-[#007bff] text-white border border-[#007bff] px-24 py-2 rounded-sm text-sm hover:bg-[#0056b3] transition-colors"
                >
                    Limpiar
                </button>
            </div>

            {/* Tabla de resultados */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">N°</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Tipo de GRE</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Numeración de la GRE</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Fecha y hora de Emisión</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Ruc del Emisor</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Nombre o razón social del emisor</th>
                            <th className="py-4 px-2 text-[#007bff] font-extrabold whitespace-nowrap text-center">Condición del usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí irían las filas de la tabla si hubiera datos */}
                        <tr>
                            <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                                Utilice los filtros para buscar guías de remisión pendientes de revisión.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
