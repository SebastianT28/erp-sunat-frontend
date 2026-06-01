"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { API_BASE_URL } from "../../config/api"
import { motion, AnimatePresence } from "framer-motion"

export default function ConsultaGRE() {
    const [tipoGRE, setTipoGRE] = useState<"GRE - Remitente" | "GRE - Transportista">("GRE - Remitente")
    const [serie, setSerie] = useState("T001")
    const [numero, setNumero] = useState("")
    const [resultado, setResultado] = useState<any | null>(null)
    const [greData, setGreData] = useState<any | null>(null)
    const [buscando, setBuscando] = useState(false)
    const [error, setError] = useState("")
    const [usuarioInfo, setUsuarioInfo] = useState({ ruc: "20498697381", razonSocial: "TRANSPORTES ELIO S.A.C.", idUsuario: 1 })

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) {
            try {
                const user = JSON.parse(stored)
                setUsuarioInfo({
                    ruc: user.contribuyente?.ruc || "20498697381",
                    razonSocial: user.contribuyente?.razonSocial || user.nombre || "TRANSPORTES ELIO S.A.C.",
                    idUsuario: user.idUsuario || 1
                })
            } catch (e) { console.error("Error leyendo localStorage") }
        }
    }, [])

    const handleBuscar = async () => {
        if (!serie.trim() || !numero.trim()) {
            setError("Por favor ingrese la Serie y el Número de la GRE.")
            return
        }
        setError("")
        setBuscando(true)
        setResultado(null)
        setGreData(null)

        try {
            const numFormateado = numero.padStart(6, '0')
            const res = await fetchWithAuth(`${API_BASE_URL}/api/logistica/gre/buscar?serie=${serie.toUpperCase()}&numero=${numFormateado}`)
            const data = await res.json()

            if (data.success && data.data) {
                const gre = data.data

                let pesoKGM = 0
                if (gre.bienes) {
                    gre.bienes.forEach((b: any) => {
                        const p = b.peso || 0
                        const c = b.cantidad || 0
                        pesoKGM += (b.unidadMedida === "Toneladas" ? p * c * 1000 : p * c)
                    })
                }

                setGreData({ ...gre, pesoKGM })
                setResultado({
                    serie: gre.serie,
                    numero: gre.numero,
                    fechaEmision: gre.fechaEmision,
                    estado: gre.estado,
                    destinatario: gre.destinatarioNombre ? `${gre.destinatarioNombre} (${gre.destinatarioTipoDoc}: ${gre.destinatarioNumDoc})` : "-",
                    motivoTraslado: gre.motivoTraslado,
                    puntoPartida: gre.puntoPartida ? `${gre.puntoPartida.direccion.direccionDetallada} - ${gre.puntoPartida.direccion.departamento}` : "-",
                    puntoLlegada: gre.puntoLlegada ? `${gre.puntoLlegada.direccion.direccionDetallada} - ${gre.puntoLlegada.direccion.departamento}` : "-",
                    pesoBruto: `${pesoKGM.toFixed(2)} KGM`
                })
                setNumero(numFormateado)
            } else {
                setError(data.message || "No se encontró la GRE solicitada.")
            }
        } catch (err) {
            setError("Error de conexión al servidor.")
        }
        setBuscando(false)
    }

    const handleLimpiar = () => {
        setSerie("T001")
        setNumero("")
        setResultado(null)
        setGreData(null)
        setError("")
    }

    const handleDescargarPDF = () => {
        if (!greData) return;
        const doc = new jsPDF("p", "mm", "a4")
        const w = doc.internal.pageSize.getWidth()
        let y = 15

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(usuarioInfo.razonSocial, 14, y)

        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.rect(w / 2 + 5, y - 6, w / 2 - 19, 18)
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(`Guía de Remisión Electrónica - ${tipoGRE.includes("Remitente") ? "Remitente" : "Transportista"}`, w / 2 + 10, y + 1, { align: "left" })
        doc.text(`N° ${greData.serie}-${greData.numero}`, w / 2 + 10, y + 6, { align: "left" })
        doc.setFontSize(9)
        doc.text(`RUC N° ${usuarioInfo.ruc}`, w / 2 + 10, y + 11, { align: "left" })
        y += 22

        doc.setFontSize(9)
        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.text("Datos de emisión", 14, y)
        doc.text("Datos del Destinatario", w / 2 + 5, y)
        y += 6

        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(`Fecha de emisión: ${greData.fechaEmision}`, 14, y)
        if (greData.destinatarioNombre) {
            doc.text(greData.destinatarioNombre, w / 2 + 5, y)
            doc.text(`${greData.destinatarioTipoDoc} - ${greData.destinatarioNumDoc}`, w / 2 + 5, y + 5)
        }
        doc.text(`Motivo de traslado: ${greData.motivoTraslado}`, 14, y + 5)
        if (greData.transporte) {
            doc.text(`Fecha inicio de traslado: ${greData.transporte.fechaInicioTraslado}`, 14, y + 10)
        }
        y += 20

        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("Punto de partida", 14, y)
        doc.text("Punto de llegada", w / 2 + 5, y)
        y += 6

        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        if (greData.puntoPartida && greData.puntoPartida.direccion) {
            const dirP = greData.puntoPartida.direccion
            doc.text(`${dirP.direccionDetallada}`, 14, y)
            doc.text(`${dirP.departamento} - ${dirP.provincia} - ${dirP.distrito}`, 14, y + 4)
        }
        if (greData.puntoLlegada && greData.puntoLlegada.direccion) {
            const dirL = greData.puntoLlegada.direccion
            doc.text(`${dirL.direccionDetallada}`, w / 2 + 5, y)
            doc.text(`${dirL.departamento} - ${dirL.provincia} - ${dirL.distrito}`, w / 2 + 5, y + 4)
        }
        y += 14

        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("Bienes a transportar", 14, y)
        y += 2

        const bienesArray = greData.bienes ? greData.bienes.map((b: any, i: number) => [
            String(i + 1), b.codigoBien, b.descripcion, b.unidadMedida.toUpperCase(), b.cantidad,
        ]) : []

        autoTable(doc, {
            startY: y,
            head: [["N°", "Código bien", "Descripción detallada", "Unid. medida", "Cantidad"]],
            body: bienesArray,
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: "bold" },
            theme: "grid",
            margin: { left: 14, right: 14 },
        })

        y = (doc as any).lastAutoTable.finalY + 4
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(`Unidad de medida del peso bruto: KGM`, 14, y)
        doc.text(`Peso bruto total de la carga: ${greData.pesoKGM.toFixed(2)}`, 14, y + 5)
        y += 14

        if (greData.transporte) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Datos del traslado", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.text(`Modalidad de traslado: ${greData.transporte.tipoTransporte}`, 14, y)
            y += 10
            if (greData.transporte.vehiculo && greData.transporte.vehiculo.placa !== "-") {
                doc.setTextColor(180, 40, 40)
                doc.setFont("helvetica", "bold")
                doc.text("Vehículo Principal", 14, y)
                y += 5
                doc.setTextColor(0, 0, 0)
                doc.setFont("helvetica", "normal")
                doc.text(`Placa: ${greData.transporte.vehiculo.placa}`, 14, y)
                y += 10
            }
            if (greData.transporte.conductor && greData.transporte.conductor.nombre !== "-") {
                doc.setTextColor(180, 40, 40)
                doc.setFont("helvetica", "bold")
                doc.text("Conductor Principal", 14, y)
                y += 5
                doc.setTextColor(0, 0, 0)
                doc.setFont("helvetica", "normal")
                doc.text(`${greData.transporte.conductor.nombre} (Licencia: ${greData.transporte.conductor.numeroLicencia})`, 14, y)
                y += 10
            }
        }

        doc.save(`GRE_${greData.serie}_${greData.numero}.pdf`)
    }

    const estadoColor = resultado?.estado === "VIGENTE" || resultado?.estado === "ACEPTADO"
        ? "text-emerald-600 bg-emerald-50 border-emerald-200"
        : resultado?.estado === "BAJA"
            ? "text-red-600 bg-red-50 border-red-200"
            : "text-amber-600 bg-amber-50 border-amber-200"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden"
        >
            {/* Decoración de fondo */}
            <div className="absolute top-[-60px] right-[-60px] w-[240px] h-[240px] bg-blue-100/60 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] bg-pink-100/40 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <h2 className="text-[#0063AE] font-extrabold text-2xl mb-2 flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#FF4081]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Consulta de GRE Emitidas
                </h2>
                <p className="text-gray-400 text-sm mb-8">Busca y descarga guías de remisión por serie y número.</p>

                {/* Tipo de GRE */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 mb-6">
                    <p className="text-gray-700 font-bold text-sm mb-4">Seleccione el tipo de GRE</p>
                    <div className="flex gap-4">
                        {(["GRE - Remitente", "GRE - Transportista"] as const).map((tipo) => (
                            <button
                                key={tipo}
                                onClick={() => setTipoGRE(tipo)}
                                className={`relative overflow-hidden px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${tipoGRE === tipo ? "text-white shadow-lg shadow-blue-500/20" : "text-gray-600 bg-gray-50 hover:bg-gray-100"}`}
                            >
                                {tipoGRE === tipo && (
                                    <motion.div layoutId="tipoGREBg" className="absolute inset-0 bg-gradient-to-r from-[#0063AE] to-[#004d8a] z-0" />
                                )}
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 relative ${tipoGRE === tipo ? 'border-white' : 'border-gray-400'}`}>
                                    {tipoGRE === tipo && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="relative z-10">{tipo}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Formulario de búsqueda */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 mb-6">
                    <p className="text-gray-700 font-bold text-sm mb-4">Ingrese la numeración de la GRE</p>
                    <div className="flex items-end gap-4 flex-wrap">
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Serie</label>
                            <input
                                type="text"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                placeholder="Ej: T001"
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-32 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] uppercase text-sm text-gray-800 font-mono transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 font-bold text-xs uppercase tracking-wide mb-2 block">Número</label>
                            <input
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                                placeholder="Ej: 000005"
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-44 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] text-sm text-gray-800 font-mono transition-all"
                            />
                        </div>
                        <div className="flex gap-3 ml-auto">
                            <button
                                onClick={handleLimpiar}
                                className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={handleBuscar}
                                disabled={buscando}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white px-8 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {buscando ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                {buscando ? "Buscando..." : "Buscar GRE"}
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-[#FF4081] text-xs mt-3 font-bold flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Panel de Resultados */}
                <AnimatePresence>
                    {resultado && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="bg-white rounded-2xl shadow-md border border-blue-50 overflow-hidden"
                        >
                            {/* Header del resultado */}
                            <div className="bg-gradient-to-r from-[#0063AE]/5 to-[#FF4081]/5 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0063AE]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-[#0063AE] font-extrabold text-base">{resultado.serie}-{resultado.numero}</h3>
                                        <p className="text-gray-400 text-xs">Resultado encontrado</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${estadoColor}`}>
                                    {resultado.estado}
                                </span>
                            </div>

                            <div className="p-6 flex gap-8">
                                {/* Datos */}
                                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    {[
                                        { label: "Fecha de Emisión", value: resultado.fechaEmision },
                                        { label: "Peso Bruto Total", value: resultado.pesoBruto },
                                        { label: "Destinatario", value: resultado.destinatario, full: true },
                                        { label: "Motivo de Traslado", value: resultado.motivoTraslado, full: true },
                                        { label: "Punto de Partida", value: resultado.puntoPartida, full: true },
                                        { label: "Punto de Llegada", value: resultado.puntoLlegada, full: true },
                                    ].map((item) => (
                                        <div key={item.label} className={item.full ? "col-span-2" : ""}>
                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-0.5">{item.label}</span>
                                            <span className="text-gray-800 font-semibold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Acciones */}
                                <div className="flex flex-col gap-3 border-l border-gray-100 pl-8 min-w-[160px] justify-center">
                                    <button
                                        onClick={handleDescargarPDF}
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-red-500/30 hover:shadow-lg transition-all active:scale-95"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Descargar PDF
                                    </button>
                                    <button
                                        onClick={handleLimpiar}
                                        className="flex items-center justify-center gap-2 text-gray-500 bg-gray-100 px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Nueva búsqueda
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
