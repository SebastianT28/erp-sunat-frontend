"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";


import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { API_BASE_URL } from "../../config/api"

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
                
                // Calcular peso bruto
                let pesoKGM = 0
                if (gre.bienes) {
                    gre.bienes.forEach((b: any) => {
                        const p = b.peso || 0
                        const c = b.cantidad || 0
                        pesoKGM += (b.unidadMedida === "Toneladas" ? p * c * 1000 : p * c)
                    })
                }

                setGreData({...gre, pesoKGM})
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

        // Header empresa
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(usuarioInfo.razonSocial, 14, y)

        // Cuadro de título
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

        // Datos de emisión
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

        // Punto de partida / llegada
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

        // Bienes
        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("Bienes a transportar", 14, y)
        y += 2

        const bienesArray = greData.bienes ? greData.bienes.map((b: any, i: number) => [
            String(i + 1),
            b.codigoBien,
            b.descripcion,
            b.unidadMedida.toUpperCase(),
            b.cantidad,
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

        // Transporte
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

    return (
        <div className="w-full max-w-5xl mx-auto bg-white p-6 shadow-sm rounded-sm">
            <h2 className="text-[#0063AE] font-extrabold text-lg mb-6">Consulta de GRE Emitidas</h2>

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

            <div className="mb-8">
                <h3 className="text-black font-extrabold text-sm mb-4">Ingrese la numeración de la GRE:</h3>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <label className="text-black font-extrabold text-sm">Serie</label>
                        <input
                            type="text"
                            value={serie}
                            onChange={(e) => setSerie(e.target.value.toUpperCase())}
                            placeholder="Ej: T001"
                            className="border border-gray-300 rounded px-3 py-2 w-32 focus:outline-none focus:border-[#0063AE] uppercase text-sm text-black"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-black font-extrabold text-sm">Número</label>
                        <input
                            type="text"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                            placeholder="Ej: 000005"
                            className="border border-gray-300 rounded px-3 py-2 w-48 focus:outline-none focus:border-[#0063AE] text-sm text-black"
                        />
                    </div>
                    <button
                        onClick={handleLimpiar}
                        className="bg-white text-[#3399ff] border border-[#3399ff] px-6 py-2 rounded text-sm hover:bg-blue-50 transition-colors ml-auto"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={handleBuscar}
                        disabled={buscando}
                        className="bg-[#007bff] text-white px-10 py-2 rounded text-sm font-medium hover:bg-[#0056b3] transition-colors disabled:opacity-50"
                    >
                        {buscando ? "Buscando..." : "Buscar"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
            </div>

            {/* Panel dinámico de resultados */}
            {resultado && (
                <div className="mt-8 border-t border-gray-200 pt-8 animate-fade-in">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex justify-between items-start shadow-sm">
                        
                        {/* Datos de la GRE */}
                        <div className="flex-1">
                            <h3 className="text-[#0063AE] font-extrabold text-lg mb-4">
                                Resultado de Búsqueda: {resultado.serie} - {resultado.numero}
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-black">
                                <p><span className="font-extrabold text-gray-700">Estado:</span> <span className="text-green-600 font-bold">{resultado.estado}</span></p>
                                <p><span className="font-extrabold text-gray-700">Fecha de Emisión:</span> {resultado.fechaEmision}</p>
                                <p className="col-span-2"><span className="font-extrabold text-gray-700">Destinatario:</span> {resultado.destinatario}</p>
                                <p className="col-span-2"><span className="font-extrabold text-gray-700">Motivo de traslado:</span> {resultado.motivoTraslado}</p>
                                <p className="col-span-2"><span className="font-extrabold text-gray-700">Punto de Partida:</span> {resultado.puntoPartida}</p>
                                <p className="col-span-2"><span className="font-extrabold text-gray-700">Punto de Llegada:</span> {resultado.puntoLlegada}</p>
                                <p><span className="font-extrabold text-gray-700">Peso Bruto:</span> {resultado.pesoBruto}</p>
                            </div>
                        </div>

                        {/* Opciones a la derecha */}
                        <div className="flex flex-col gap-4 ml-8 pl-8 border-l border-gray-200">
                            <button
                                onClick={handleDescargarPDF}
                                className="bg-[#b42828] text-white px-6 py-3 rounded-md text-sm font-bold shadow hover:bg-red-800 transition-colors flex items-center justify-center gap-2 w-48"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                                Descargar PDF
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
