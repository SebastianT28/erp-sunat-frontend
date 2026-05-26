"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";


import { useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { API_BASE_URL } from "../../config/api"
import type { Bien } from "./emisionGREBienes"
import type { Direccion } from "./emisionGREPuntoTraslado"
import type { Vehiculo, Conductor } from "./emisionGRETransporte"
import type { Transportista } from "./components/ModalTransportista"

interface DocRelacionado { tipo: string; ruc: string; serie: string; numero: string }
interface Destinatario { tipoDoc: string; numDoc: string; nombre: string; frecuente: boolean }

export interface DatosTransporte {
    modalidad: string
    fechaInicio: string
    transbordo: boolean
    vehiculoM1: boolean
    vehiculo?: Vehiculo
    conductor?: Conductor
    transportista?: Transportista
    vehiculoPublico?: Vehiculo
    conductorPublico?: Conductor
}

interface EmisionGREPreviewProps {
    tipoGuia: string
    comercioExterior: boolean
    motivoTraslado: string
    destinatarios: Destinatario[]
    documentos: DocRelacionado[]
    bienes: Bien[]
    puntoPartida: Direccion | null
    puntoLlegada: Direccion | null
    transporte: DatosTransporte
    usuarioInfo: { ruc: string; razonSocial: string; idUsuario: number }
    onVolver: () => void
    onEmitido: (resultado: { success: boolean; message: string }) => void
}

const API_URL = `${API_BASE_URL}/api/logistica/gre`

function formatFecha(fecha: string): string {
    if (!fecha) return "-"
    const [y, m, d] = fecha.split("-")
    return `${d}/${m}/${y}`
}

export default function EmisionGREPreview({
    tipoGuia, comercioExterior, motivoTraslado, destinatarios, documentos, bienes,
    puntoPartida, puntoLlegada, transporte, usuarioInfo, onVolver, onEmitido,
}: EmisionGREPreviewProps) {
    const [observaciones, setObservaciones] = useState("")
    const [emitiendo, setEmitiendo] = useState(false)
    const [mensajeError, setMensajeError] = useState("")

    const hoy = new Date()
    const fechaEmision = `${String(hoy.getDate()).padStart(2, "0")}/${String(hoy.getMonth() + 1).padStart(2, "0")}/${hoy.getFullYear()}`

    // Peso bruto total
    const pesoBrutoKg = bienes.reduce((acc, b) => {
        const p = parseFloat(b.peso) || 0
        const c = parseInt(b.cantidad) || 0
        return acc + (b.unidad === "Toneladas" ? p * c * 1000 : p * c)
    }, 0)

    // Vehículo y conductor principales
    const veh = transporte.vehiculo || transporte.vehiculoPublico
    const cond = transporte.conductor || transporte.conductorPublico

    const generarPDF = (serie: string = "T001", numero: string = "000000") => {
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
        doc.text(`Guía de Remisión Electrónica - ${tipoGuia === "remitente" ? "Remitente" : "Transportista"}`, w / 2 + 10, y + 1, { align: "left" })
        doc.text(`N° ${serie}-${numero}`, w / 2 + 10, y + 6, { align: "left" })
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
        doc.text(`Fecha de emisión: ${fechaEmision}`, 14, y)
        if (destinatarios.length > 0) {
            doc.text(destinatarios[0].nombre, w / 2 + 5, y)
            doc.text(`${destinatarios[0].tipoDoc} - ${destinatarios[0].numDoc}`, w / 2 + 5, y + 5)
        }
        doc.text(`Motivo de traslado: ${motivoTraslado}`, 14, y + 5)
        doc.text(`Comercio exterior: ${comercioExterior ? "Sí" : "No"}`, 14, y + 10)
        doc.text(`Fecha inicio de traslado: ${formatFecha(transporte.fechaInicio)}`, 14, y + 15)
        if (destinatarios.length > 1) {
            let dy = y + 10
            for (let i = 1; i < destinatarios.length; i++) {
                doc.text(`${destinatarios[i].nombre} (${destinatarios[i].tipoDoc} - ${destinatarios[i].numDoc})`, w / 2 + 5, dy)
                dy += 5
            }
        }
        y += 24

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
        if (puntoPartida) {
            doc.text(`${puntoPartida.direccionDetallada}`, 14, y)
            doc.text(`${puntoPartida.departamento} - ${puntoPartida.provincia} - ${puntoPartida.distrito}`, 14, y + 4)
        }
        if (puntoLlegada) {
            doc.text(`${puntoLlegada.direccionDetallada}`, w / 2 + 5, y)
            doc.text(`${puntoLlegada.departamento} - ${puntoLlegada.provincia} - ${puntoLlegada.distrito}`, w / 2 + 5, y + 4)
        }
        y += 14

        // Bienes
        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("Bienes a transportar", 14, y)
        y += 2

        autoTable(doc, {
            startY: y,
            head: [["N°", "Bien norm.", "Código bien", "Descripción detallada", "Unid. medida", "Cantidad"]],
            body: bienes.map((b, i) => [
                String(i + 1),
                b.normalizado ? "SÍ" : "NO",
                b.codigo,
                b.descripcion,
                b.unidad.toUpperCase(),
                b.cantidad,
            ]),
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: "bold" },
            theme: "grid",
            margin: { left: 14, right: 14 },
        })

        y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(`Unidad de medida del peso bruto: KGM`, 14, y)
        doc.text(`Peso bruto total de la carga: ${pesoBrutoKg.toFixed(2)}`, 14, y + 5)
        y += 14

        // Datos del traslado
        doc.setTextColor(180, 40, 40)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.text("Datos del traslado", 14, y)
        y += 6
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.text(`Modalidad de traslado: ${transporte.modalidad}`, 14, y)
        doc.text(`Indicador de transbordo programado: ${transporte.transbordo ? "Sí" : "No"}`, w / 2 + 5, y)
        doc.text(`Indicador de traslado en vehículos de categoría M1 o L: ${transporte.vehiculoM1 ? "Sí" : "No"}`, 14, y + 5)
        y += 14

        // Vehículos
        if (veh) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Datos de los vehículos", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.text("Principal:", 14, y)
            doc.text(`Nº de placa: ${veh.placa}`, 40, y)
            doc.text(`Entidad emisora de la autorización especial: ${veh.entidad}`, 40, y + 5)
            y += 14
        }

        // Conductores
        if (cond) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Datos de los conductores", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.text("Principal:", 14, y)
            doc.text(`${cond.tipoDocumento} - ${cond.numeroDocumento} - ${cond.nombres}`, 40, y)
            doc.text(`Nº de licencia de conducir: ${cond.licencia}`, 40, y + 5)
            y += 14
        }

        // Transportista público
        if (transporte.modalidad === "Publico" && transporte.transportista) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Datos del transportista", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            doc.text(`${transporte.transportista.razonSocial}`, 14, y)
            doc.text(`RUC: ${transporte.transportista.ruc}`, 14, y + 5)
            y += 14
        }

        // Documentos relacionados
        if (documentos.length > 0) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Documentos relacionados", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            documentos.forEach(d => {
                doc.text(`${d.tipo} — Serie: ${d.serie} — N°: ${d.numero}`, 14, y)
                y += 5
            })
            y += 4
        }

        // Observaciones
        if (observaciones.trim()) {
            doc.setTextColor(180, 40, 40)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("Observaciones:", 14, y)
            y += 6
            doc.setTextColor(0, 0, 0)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(8)
            const lines = doc.splitTextToSize(observaciones, w - 28)
            doc.text(lines, 14, y)
        }

        return doc
    }

    const handleEmitir = async () => {
        if (emitiendo) return
        setEmitiendo(true)
        setMensajeError("")

        const vehiculoData = veh ? {
            placa: veh.placa,
            entidadEmisora: veh.entidad,
            numeroAutorizacion: veh.numeroAutorizacion,
        } : { placa: "-", entidadEmisora: "-", numeroAutorizacion: "-" }

        const conductorData = cond ? {
            nombre: cond.nombres,
            tipoDocumentoIdentidad: cond.tipoDocumento,
            numeroDocumento: cond.numeroDocumento,
            numeroLicencia: cond.licencia,
        } : { nombre: "-", tipoDocumentoIdentidad: "-", numeroDocumento: "-", numeroLicencia: "-" }

        const payload = {
            tipoGuia,
            motivoTraslado,
            comercioExterior,
            observaciones: observaciones.trim() || null,
            idUsuario: usuarioInfo.idUsuario,
            destinatario: destinatarios.length > 0 ? {
                tipoDocumentoIdentidad: destinatarios[0].tipoDoc,
                numeroDocumento: destinatarios[0].numDoc,
                nombre: destinatarios[0].nombre,
            } : null,
            documentosRelacionados: documentos.map(d => ({
                tipo: d.tipo, serie: d.serie, numero: d.numero,
                fecha: new Date().toISOString().split("T")[0],
            })),
            bienes: bienes.map(b => ({
                codigoBien: b.codigo, descripcion: b.descripcion,
                unidadMedida: b.unidad, peso: parseFloat(b.peso) || 0,
                cantidad: parseInt(b.cantidad) || 1, normalizado: b.normalizado,
            })),
            puntoPartida: puntoPartida ? {
                tipo: "partida",
                direccion: { departamento: puntoPartida.departamento, provincia: puntoPartida.provincia, distrito: puntoPartida.distrito, direccionDetallada: puntoPartida.direccionDetallada },
            } : null,
            puntoLlegada: puntoLlegada ? {
                tipo: "llegada",
                direccion: { departamento: puntoLlegada.departamento, provincia: puntoLlegada.provincia, distrito: puntoLlegada.distrito, direccionDetallada: puntoLlegada.direccionDetallada },
            } : null,
            transporte: {
                tipoTransporte: transporte.modalidad,
                fechaInicioTraslado: transporte.fechaInicio,
                vehiculo: vehiculoData,
                conductor: conductorData,
            },
        }

        try {
            const response = await fetchWithAuth(`${API_URL}/emitir`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const data = await response.json()
            if (data.success) {
                // Generar y descargar PDF
                const pdf = generarPDF(data.data.serie, data.data.numero)
                pdf.save(`GRE_${data.data.serie}_${data.data.numero}_${new Date().toISOString().split("T")[0]}.pdf`)
                onEmitido({ success: true, message: `✅ GRE emitida exitosamente (N° ${data.data.serie}-${data.data.numero})` })
            } else {
                setMensajeError(`Error: ${data.message}`)
            }
        } catch (error) {
            setMensajeError(`Error de conexión: ${error}`)
        }
        setEmitiendo(false)
    }

    return (
        <div className="relative">
            <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>
            <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex-1 h-1 bg-[#002f6c] rounded" />)}
                <div className="flex-1 h-1 bg-[#3399ff] rounded" />
            </div>
            <h3 className="text-[#0063AE] font-extrabold text-base mb-6">6. Previsualización de la Guía de Remisión</h3>

            {/* === GUÍA DE REMISIÓN PREVIEW === */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                {/* Header azul */}
                <div className="bg-gradient-to-r from-[#002f6c] to-[#0063AE] px-6 py-4 flex items-center justify-between">
                    <span className="text-white font-extrabold text-sm tracking-wide">Información Preliminar</span>
                    <span className="text-blue-200 text-xs flex items-center gap-1">ℹ️ Ayuda</span>
                </div>

                <div className="p-6">
                    {/* Empresa + Cuadro de título */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-black font-extrabold text-lg">{usuarioInfo.razonSocial}</p>
                        </div>
                        <div className="border-2 border-gray-800 px-8 py-4 text-center">
                            <p className="text-black font-extrabold text-sm">Guía de Remisión Electrónica - {tipoGuia === "remitente" ? "Remitente" : "Transportista"}</p>
                            <p className="text-black font-bold text-sm mt-1">N° T001 - Serie</p>
                            <p className="text-black font-bold text-sm mt-1">RUC N° {usuarioInfo.ruc}</p>
                        </div>
                    </div>

                    {/* Datos de emisión + Destinatario */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos de emisión</h4>
                            <p className="text-black text-sm mb-1">Fecha de emisión: <span className="font-semibold">{fechaEmision}</span></p>
                            <p className="text-black text-sm mb-1">Motivo de traslado: <span className="font-semibold">{motivoTraslado}</span></p>
                            <p className="text-black text-sm mb-1">Comercio exterior: <span className="font-semibold">{comercioExterior ? "Sí" : "No"}</span></p>
                            <p className="text-black text-sm">Fecha inicio de traslado: <span className="font-semibold">{formatFecha(transporte.fechaInicio)}</span></p>
                        </div>
                        <div>
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos del Destinatario</h4>
                            {destinatarios.map((d, i) => (
                                <div key={i} className={i > 0 ? "mt-2 pt-2 border-t border-gray-100" : ""}>
                                    <p className="text-black text-sm font-semibold mb-1">{d.nombre}</p>
                                    <p className="text-black text-sm">{d.tipoDoc} - {d.numDoc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Punto de partida / llegada */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Punto de partida</h4>
                            {puntoPartida && (
                                <p className="text-black text-sm">{puntoPartida.direccionDetallada} - {puntoPartida.departamento} - {puntoPartida.provincia} - {puntoPartida.distrito}</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Punto de llegada</h4>
                            {puntoLlegada && (
                                <p className="text-black text-sm">{puntoLlegada.direccionDetallada} - {puntoLlegada.departamento} - {puntoLlegada.provincia} - {puntoLlegada.distrito}</p>
                            )}
                        </div>
                    </div>

                    {/* Bienes a transportar */}
                    <div className="mb-8">
                        <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Bienes a transportar</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-100 border-b border-gray-200 text-black font-extrabold uppercase">
                                    <tr>
                                        <th className="px-3 py-2">N°</th>
                                        <th className="px-3 py-2">Bien normalizado</th>
                                        <th className="px-3 py-2">Código bien</th>
                                        <th className="px-3 py-2">Descripción detallada</th>
                                        <th className="px-3 py-2">Unid. medida</th>
                                        <th className="px-3 py-2">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bienes.map((b, i) => (
                                        <tr key={i} className="border-b border-gray-100 text-black">
                                            <td className="px-3 py-2">{i + 1}</td>
                                            <td className="px-3 py-2">{b.normalizado ? "SÍ" : "NO"}</td>
                                            <td className="px-3 py-2">{b.codigo}</td>
                                            <td className="px-3 py-2 font-semibold">{b.descripcion}</td>
                                            <td className="px-3 py-2">{b.unidad.toUpperCase()}</td>
                                            <td className="px-3 py-2">{b.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 text-sm text-black">
                            <p>Unidad de medida del peso bruto: <span className="font-semibold ml-4">KGM</span></p>
                            <p>Peso bruto total de la carga: <span className="font-semibold ml-4">{pesoBrutoKg.toFixed(2)}</span></p>
                        </div>
                    </div>

                    {/* Datos del traslado */}
                    <div className="mb-8">
                        <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos del traslado</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-black">
                            <p>Modalidad de traslado: <span className="font-semibold">{transporte.modalidad}</span></p>
                            <p>Indicador de transbordo programado: <span className="font-semibold ml-8">{transporte.transbordo ? "Sí" : "No"}</span></p>
                            <p>Indicador de traslado en vehículos de categoría M1 o L: <span className="font-semibold">{transporte.vehiculoM1 ? "Sí" : "No"}</span></p>
                        </div>
                    </div>

                    {/* Vehículos */}
                    {veh && (
                        <div className="mb-8">
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos de los vehículos</h4>
                            <div className="text-sm text-black flex gap-8">
                                <p className="font-semibold">Principal:</p>
                                <div>
                                    <p>Nº de placa: <span className="font-semibold">{veh.placa}</span></p>
                                    <p>Entidad emisora de la autorización especial: <span className="font-semibold">{veh.entidad}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Conductores */}
                    {cond && (
                        <div className="mb-8">
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos de los conductores</h4>
                            <div className="text-sm text-black flex gap-8">
                                <p className="font-semibold">Principal:</p>
                                <div>
                                    <p>{cond.tipoDocumento} - {cond.numeroDocumento} - {cond.nombres}</p>
                                    <p>Nº de licencia de conducir: <span className="font-semibold">{cond.licencia}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transportista público */}
                    {transporte.modalidad === "Publico" && transporte.transportista && (
                        <div className="mb-8">
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Datos del transportista</h4>
                            <div className="text-sm text-black">
                                <p className="font-semibold">{transporte.transportista.razonSocial}</p>
                                <p>RUC: {transporte.transportista.ruc}{transporte.transportista.numRegistroMTC ? ` | MTC: ${transporte.transportista.numRegistroMTC}` : ""}</p>
                            </div>
                        </div>
                    )}

                    {/* Documentos relacionados */}
                    {documentos.length > 0 && (
                        <div className="mb-8">
                            <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Documentos relacionados</h4>
                            <div className="text-sm text-black">
                                {documentos.map((d, i) => (
                                    <p key={i}>{d.tipo} — Serie: {d.serie} — N°: {d.numero}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Observaciones */}
                    <div className="mb-4">
                        <h4 className="text-[#b42828] font-extrabold text-sm mb-3">Observaciones:</h4>
                        <textarea
                            value={observaciones}
                            onChange={e => setObservaciones(e.target.value)}
                            rows={3}
                            placeholder="OBSERVACIONES POR EL TRASLADO..."
                            className="w-full border border-gray-300 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#0063AE] resize-y placeholder-gray-400 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Error message */}
            {mensajeError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-bold mt-4">
                    ❌ {mensajeError}
                </div>
            )}

            {/* Botones Volver / Emitir GRE */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button
                    onClick={onVolver}
                    disabled={emitiendo}
                    className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow"
                >
                    Volver
                </button>
                <button
                    onClick={handleEmitir}
                    disabled={emitiendo}
                    className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${!emitiendo ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                    {emitiendo ? "Emitiendo..." : "Emitir GRE"}
                </button>
            </div>

            {/* Overlay emitiendo */}
            {emitiendo && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow-xl text-center">
                        <div className="w-10 h-10 border-4 border-[#0063AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-black font-extrabold text-lg">Emitiendo GRE...</p>
                        <p className="text-gray-500 text-sm mt-2">Guardando en la base de datos y generando PDF</p>
                    </div>
                </div>
            )}
        </div>
    )
}
