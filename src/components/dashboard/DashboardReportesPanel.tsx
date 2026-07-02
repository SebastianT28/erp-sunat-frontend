"use client"

import { useState, useEffect, useMemo } from "react"
import { API_BASE_URL } from "@/config/api"
import { fetchWithAuth } from "@/utils/fetchWithAuth"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface GreReporteItem {
    id: number
    serie: string
    numero: string
    emisor: string
    razonSocialEmisor: string
    estado: string
    reclamo: string
    fechaEmision: string
}

interface DeclaracionReporteItem {
    id: number
    periodo: string
    formulario: string
    emisor: string
    razonSocialEmisor: string
    fecha: string
    condicionIgv: string
    regimenTributario: string
}

interface ContribuyenteReporteItem {
    idUsuario: number
    usuario: string
    correo: string
    ruc: string
    razonSocial: string
    tipoContribuyente: string
    direccion: string
}

interface DashboardReportesData {
    totalContribuyentes: number
    totalGres: number
    totalDeclaraciones: number
    gres?: GreReporteItem[]
    declaraciones?: DeclaracionReporteItem[]
    contribuyentes?: ContribuyenteReporteItem[]
}

export default function DashboardReportesPanel() {
    const [activeSection, setActiveSection] = useState<"insights" | "reportes">("insights")
    const [reportCategory, setReportCategory] = useState<"gres" | "declaraciones" | "contribuyentes">("gres")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DashboardReportesData>({
        totalContribuyentes: 0,
        totalGres: 0,
        totalDeclaraciones: 0,
        gres: [],
        declaraciones: [],
        contribuyentes: []
    })

    useEffect(() => {
        setLoading(true)
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/reportes/data`)
            .then(res => {
                if (!res.ok) throw new Error("Error obteniendo datos de reportes")
                return res.json()
            })
            .then((resData: DashboardReportesData) => {
                setData({
                    totalContribuyentes: resData.totalContribuyentes || 0,
                    totalGres: resData.totalGres || 0,
                    totalDeclaraciones: resData.totalDeclaraciones || 0,
                    gres: resData.gres || [],
                    declaraciones: resData.declaraciones || [],
                    contribuyentes: resData.contribuyentes || []
                })
                setLoading(false)
            })
            .catch(err => {
                console.error("Error al cargar datos del dashboard de reportes:", err)
                setLoading(false)
            })
    }, [])

    // --- AGRUPACIONES PARA GRÁFICOS SVG ---
    const gresPorMes = useMemo(() => {
        const counts: Record<string, number> = {}
        const gresList = data.gres || []
        gresList.forEach(g => {
            const mes = g.fechaEmision && g.fechaEmision.length >= 7 ? g.fechaEmision.substring(0, 7) : "Sin Fecha"
            counts[mes] = (counts[mes] || 0) + 1
        })
        return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]))
    }, [data.gres])

    const gresPorEstado = useMemo(() => {
        const counts: Record<string, number> = {}
        const gresList = data.gres || []
        gresList.forEach(g => {
            const est = g.estado || "Desconocido"
            counts[est] = (counts[est] || 0) + 1
        })
        return Object.entries(counts)
    }, [data.gres])

    const declaracionesPorMes = useMemo(() => {
        const counts: Record<string, number> = {}
        const decList = data.declaraciones || []
        decList.forEach(d => {
            const mes = d.fecha && d.fecha.length >= 7 ? d.fecha.substring(0, 7) : (d.periodo || "Sin Fecha")
            counts[mes] = (counts[mes] || 0) + 1
        })
        return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]))
    }, [data.declaraciones])

    // --- FILTRADOS Y ORDEN DE TABLAS ---
    const gresOrdenadas = useMemo(() => {
        const list = [...(data.gres || [])]
        return list
            .filter(g => {
                const query = searchTerm.toLowerCase()
                return `${g.serie}-${g.numero}`.toLowerCase().includes(query) ||
                       g.emisor.toLowerCase().includes(query) ||
                       g.estado.toLowerCase().includes(query) ||
                       g.fechaEmision.toLowerCase().includes(query)
            })
            .sort((a, b) => b.fechaEmision.localeCompare(a.fechaEmision))
    }, [data.gres, searchTerm])

    const declaracionesOrdenadas = useMemo(() => {
        const list = [...(data.declaraciones || [])]
        return list
            .filter(d => {
                const query = searchTerm.toLowerCase()
                return d.formulario.toLowerCase().includes(query) ||
                       d.periodo.toLowerCase().includes(query) ||
                       d.emisor.toLowerCase().includes(query) ||
                       d.fecha.toLowerCase().includes(query)
            })
            .sort((a, b) => b.fecha.localeCompare(a.fecha))
    }, [data.declaraciones, searchTerm])

    const contribuyentesOrdenados = useMemo(() => {
        const list = [...(data.contribuyentes || [])]
        return list
            .filter(c => {
                const query = searchTerm.toLowerCase()
                return c.usuario.toLowerCase().includes(query) ||
                       c.ruc.toLowerCase().includes(query) ||
                       c.razonSocial.toLowerCase().includes(query) ||
                       c.correo.toLowerCase().includes(query)
            })
            .sort((a, b) => b.idUsuario - a.idUsuario)
    }, [data.contribuyentes, searchTerm])

    // --- EXPORTACIÓN A PDF OFICIAL SUNAT ---
    const descargarPDF = () => {
        const doc = new jsPDF()

        // Encabezado institucional SUNAT
        doc.setFillColor(0, 99, 174) // #0063AE
        doc.rect(0, 0, 210, 28, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text("SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA", 14, 13)
        doc.setFontSize(9.5)
        doc.setFont("helvetica", "normal")
        doc.text("SISTEMA INTEGRADO ERP SUNAT — REPORTE EXPORTADO DE GERENCIA", 14, 21)

        const fechaGeneracion = new Date().toLocaleString("es-PE")
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(9)
        doc.text(`Fecha de emisión del reporte: ${fechaGeneracion}`, 14, 36)

        if (reportCategory === "gres") {
            doc.setTextColor(0, 99, 174)
            doc.setFontSize(13)
            doc.setFont("helvetica", "bold")
            doc.text("Reporte Mensual de Guías de Remisión Electrónica (GRE)", 14, 45)

            const rows = gresOrdenadas.map((g, idx) => [
                idx + 1,
                `${g.serie}-${g.numero}`,
                g.fechaEmision || "Sin Fecha",
                g.emisor,
                g.razonSocialEmisor || "-",
                g.estado,
                g.reclamo ? `Sí: ${g.reclamo}` : "Ninguno"
            ])

            autoTable(doc, {
                startY: 50,
                head: [["#", "Guía", "Fecha Emisión", "RUC Emisor", "Razón Social", "Estado", "Reclamos"]],
                body: rows,
                headStyles: { fillColor: [0, 99, 174], textColor: 255, fontStyle: "bold" },
                styles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [245, 248, 252] }
            })
            doc.save(`Reporte_GRE_SUNAT_${new Date().toISOString().slice(0,10)}.pdf`)
        } else if (reportCategory === "declaraciones") {
            doc.setTextColor(0, 99, 174)
            doc.setFontSize(13)
            doc.setFont("helvetica", "bold")
            doc.text("Reporte de Declaraciones y Formularios Fiscales", 14, 45)

            const rows = declaracionesOrdenadas.map((d, idx) => [
                idx + 1,
                d.formulario,
                d.periodo || "-",
                d.fecha || "-",
                d.emisor,
                d.razonSocialEmisor || "-",
                d.regimenTributario || "General"
            ])

            autoTable(doc, {
                startY: 50,
                head: [["#", "Formulario", "Periodo", "Fecha Presentación", "RUC Emisor", "Razón Social", "Régimen"]],
                body: rows,
                headStyles: { fillColor: [0, 99, 174], textColor: 255, fontStyle: "bold" },
                styles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [245, 248, 252] }
            })
            doc.save(`Reporte_Declaraciones_SUNAT_${new Date().toISOString().slice(0,10)}.pdf`)
        } else {
            doc.setTextColor(0, 99, 174)
            doc.setFontSize(13)
            doc.setFont("helvetica", "bold")
            doc.text("Padrón de Contribuyentes y Usuarios Registrados", 14, 45)

            const rows = contribuyentesOrdenados.map((c, idx) => [
                idx + 1,
                c.usuario,
                c.ruc || "-",
                c.razonSocial || "-",
                c.correo || "-",
                c.tipoContribuyente || "General"
            ])

            autoTable(doc, {
                startY: 50,
                head: [["#", "Usuario", "RUC", "Razón Social", "Correo Electrónico", "Tipo Contribuyente"]],
                body: rows,
                headStyles: { fillColor: [0, 99, 174], textColor: 255, fontStyle: "bold" },
                styles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [245, 248, 252] }
            })
            doc.save(`Reporte_Contribuyentes_SUNAT_${new Date().toISOString().slice(0,10)}.pdf`)
        }
    }

    // --- HELPER GRÁFICO BARRAS SVG ---
    const renderBarChart = (items: [string, number][], color: string, emptyMsg: string) => {
        if (!items || items.length === 0) {
            return (
                <div className="h-48 flex items-center justify-center text-gray-400 font-bold border border-dashed rounded-lg">
                    {emptyMsg}
                </div>
            )
        }
        const maxVal = Math.max(...items.map(i => i[1]), 1)

        return (
            <div className="pt-4 pb-2">
                <div className="flex items-end gap-6 h-44 px-4 border-b border-gray-200">
                    {items.map(([label, val]) => {
                        const heightPct = Math.max(Math.round((val / maxVal) * 100), 12)
                        return (
                            <div key={label} className="flex-1 flex flex-col items-center gap-2 group relative">
                                {/* Tooltip flotante */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 text-white text-[11px] font-bold py-1 px-2.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                                    {val} registros ({label})
                                </div>
                                <div className="w-full flex items-end justify-center h-36">
                                    <div 
                                        style={{ height: `${heightPct}%`, backgroundColor: color }} 
                                        className="w-12 rounded-t-md shadow-sm transition-all duration-500 group-hover:opacity-85"
                                    />
                                </div>
                                <span className="text-xs font-extrabold text-gray-600 tracking-tight truncate max-w-[70px]">
                                    {label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full overflow-y-auto custom-scrollbar">
            {/* ENCABEZADO Y TABS DEL PANEL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0063AE]">Dashboard de Reportes</h2>
                    <p className="text-sm text-gray-500 mt-1">Supervisión estratégica en tiempo real, análisis visual y exportación de reportes fiscales.</p>
                </div>

                {/* Navegación entre Insights y Generar Reportes */}
                <div className="flex bg-gray-200 p-1 rounded-lg border border-gray-300 w-fit">
                    <button
                        onClick={() => setActiveSection("insights")}
                        className={`px-6 py-2 rounded-md font-extrabold text-sm transition-all flex items-center gap-2 ${
                            activeSection === "insights"
                                ? "bg-[#0063AE] text-white shadow-md"
                                : "text-gray-700 hover:text-black hover:bg-gray-300/60"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Insights (KPIs)
                    </button>
                    <button
                        onClick={() => setActiveSection("reportes")}
                        className={`px-6 py-2 rounded-md font-extrabold text-sm transition-all flex items-center gap-2 ${
                            activeSection === "reportes"
                                ? "bg-[#0063AE] text-white shadow-md"
                                : "text-gray-700 hover:text-black hover:bg-gray-300/60"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generar Reportes
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#0063AE] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 font-extrabold text-sm">Cargando métricas fiscales y reportes desde la base de datos...</p>
                </div>
            ) : activeSection === "insights" ? (
                /* ================= SECCIÓN 1: INSIGHTS ================= */
                <div className="flex flex-col gap-8 animate-fade-in">
                    {/* Tarjetas KPI Superiores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 shadow-sm rounded-xl border-t-4 border-[#0063AE] flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-widest mb-2">Total Contribuyentes</h3>
                                <p className="text-5xl font-black text-gray-900">{data.totalContribuyentes}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                                <span>Registrados en plataforma</span>
                                <span className="bg-blue-50 text-[#0063AE] px-2.5 py-1 rounded-full font-extrabold">100% Activos</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm rounded-xl border-t-4 border-[#0063AE] flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-widest mb-2">GRE Emitidas</h3>
                                <p className="text-5xl font-black text-gray-900">{data.totalGres}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                                <span>Con fecha real en BD</span>
                                <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-extrabold">
                                    {(data.gres || []).filter(g => g.estado === 'Emitido').length} Emitidas ok
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm rounded-xl border-t-4 border-[#0063AE] flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-gray-500 font-extrabold text-xs uppercase tracking-widest mb-2">Declaraciones Presentadas</h3>
                                <p className="text-5xl font-black text-gray-900">{data.totalDeclaraciones}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                                <span>Formularios tributarios</span>
                                <span className="bg-blue-50 text-[#0063AE] px-2.5 py-1 rounded-full font-extrabold">
                                    {(data.declaraciones || []).length} Procesadas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos y Desgloses */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Gráfico 1: Evolución temporal de GRE */}
                        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-[#0063AE]">Evolución de Guías de Remisión (GRE)</h3>
                                        <p className="text-xs text-gray-500 font-semibold">Tendencia por período mensual basada en fecha de emisión real.</p>
                                    </div>
                                    <span className="bg-blue-100 text-[#0063AE] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                                        Tiempo Real
                                    </span>
                                </div>
                                {renderBarChart(gresPorMes, "#0063AE", "No hay GREs emitidas con fecha disponible")}
                            </div>
                        </div>

                        {/* Gráfico 2: Evolución temporal de Declaraciones */}
                        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-[#0063AE]">Evolución de Declaraciones Fiscales</h3>
                                        <p className="text-xs text-gray-500 font-semibold">Volumen de formularios por mes de presentación.</p>
                                    </div>
                                    <span className="bg-blue-100 text-[#0063AE] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                                        Tiempo Real
                                    </span>
                                </div>
                                {renderBarChart(declaracionesPorMes, "#004d8a", "No hay declaraciones registradas")}
                            </div>
                        </div>
                    </div>

                    {/* Desglose por Estado de GRE */}
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                        <h3 className="text-lg font-extrabold text-[#0063AE] mb-1">Desglose Operativo por Estado de Guías (GRE)</h3>
                        <p className="text-xs text-gray-500 font-semibold mb-6">Distribución porcentual de estados actuales de los comprobantes de traslado.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {gresPorEstado.map(([estado, count]) => {
                                const total = data.totalGres || 1
                                const pct = Math.round((count / total) * 100)
                                const badgeStyle = estado === "Emitido" 
                                    ? "bg-green-500" 
                                    : estado === "Baja" 
                                        ? "bg-gray-500" 
                                        : "bg-amber-500"
                                return (
                                    <div key={estado} className="border border-gray-200 rounded-lg p-5 bg-gray-50 flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-sm text-gray-800">{estado}</span>
                                            <span className="text-xs font-black text-gray-500">{pct}% del total</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                            <div className={`h-full ${badgeStyle} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-2xl font-black text-gray-900">{count}</span>
                                            <span className="text-[11px] font-bold text-gray-400">registros verificados</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                /* ================= SECCIÓN 2: GENERAR REPORTES ================= */
                <div className="flex flex-col gap-6 animate-fade-in">
                    {/* Selector por Área y Botón Descargar PDF */}
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-extrabold text-[#0063AE] mb-1">Exportación Segmentada por Área</h3>
                            <p className="text-xs text-gray-500 font-semibold">Seleccione el área operativa para auditar las fechas reales y descargar en formato PDF oficial.</p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => { setReportCategory("gres"); setSearchTerm("") }}
                                    className={`px-4 py-2 rounded-md font-extrabold text-xs transition-colors ${
                                        reportCategory === "gres"
                                            ? "bg-[#0063AE] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                >
                                    Logística (GRE Emitidas)
                                </button>
                                <button
                                    onClick={() => { setReportCategory("declaraciones"); setSearchTerm("") }}
                                    className={`px-4 py-2 rounded-md font-extrabold text-xs transition-colors ${
                                        reportCategory === "declaraciones"
                                            ? "bg-[#0063AE] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                >
                                    Operaciones (Declaraciones)
                                </button>
                                <button
                                    onClick={() => { setReportCategory("contribuyentes"); setSearchTerm("") }}
                                    className={`px-4 py-2 rounded-md font-extrabold text-xs transition-colors ${
                                        reportCategory === "contribuyentes"
                                            ? "bg-[#0063AE] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                >
                                    Padrón de Contribuyentes
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 self-end md:self-center">
                            <input
                                type="text"
                                placeholder="Filtrar en reporte..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 px-3.5 py-2 rounded-md text-sm text-black focus:outline-none focus:border-[#0063AE] w-full sm:w-60"
                            />
                            <button
                                onClick={descargarPDF}
                                className="bg-[#b42828] hover:bg-red-800 text-white font-extrabold px-5 py-2.5 rounded-md text-sm shadow transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                </svg>
                                Descargar PDF
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Previsualización */}
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200 overflow-x-auto">
                        {reportCategory === "gres" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-extrabold text-gray-800 text-sm">Previsualización del Reporte Logístico — Ordenado por Fecha de Emisión</h4>
                                    <span className="text-xs font-bold text-gray-500">{gresOrdenadas.length} registros</span>
                                </div>
                                <table className="w-full text-left text-sm text-black">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-[#0063AE]">
                                        <tr>
                                            <th className="p-3.5 font-extrabold">Numeración</th>
                                            <th className="p-3.5 font-extrabold">Fecha de Emisión (Real)</th>
                                            <th className="p-3.5 font-extrabold">RUC Emisor</th>
                                            <th className="p-3.5 font-extrabold">Razón Social</th>
                                            <th className="p-3.5 font-extrabold text-center">Estado</th>
                                            <th className="p-3.5 font-extrabold text-center">Reclamo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gresOrdenadas.map((g, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                <td className="p-3.5 font-bold text-gray-900">{g.serie}-{g.numero}</td>
                                                <td className="p-3.5 font-black text-[#0063AE]">{g.fechaEmision || "Sin Fecha"}</td>
                                                <td className="p-3.5 font-bold text-gray-700">{g.emisor}</td>
                                                <td className="p-3.5 text-gray-600">{g.razonSocialEmisor}</td>
                                                <td className="p-3.5 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                                        g.estado === 'Emitido' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                        g.estado === 'Baja' ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                                                        'bg-orange-100 text-orange-700 border border-orange-200'
                                                    }`}>
                                                        {g.estado}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-center">
                                                    {g.reclamo ? (
                                                        <span className="text-[#b42828] font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">
                                                            ⚠️ Hay reclamo
                                                        </span>
                                                    ) : <span className="text-gray-400">-</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        {gresOrdenadas.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">No se encontraron guías en este reporte.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {reportCategory === "declaraciones" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-extrabold text-gray-800 text-sm">Previsualización del Reporte de Operaciones — Ordenado por Fecha</h4>
                                    <span className="text-xs font-bold text-gray-500">{declaracionesOrdenadas.length} registros</span>
                                </div>
                                <table className="w-full text-left text-sm text-black">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-[#0063AE]">
                                        <tr>
                                            <th className="p-3.5 font-extrabold">Formulario</th>
                                            <th className="p-3.5 font-extrabold">Periodo Tributario</th>
                                            <th className="p-3.5 font-extrabold">Fecha Presentación (Real)</th>
                                            <th className="p-3.5 font-extrabold">RUC Emisor</th>
                                            <th className="p-3.5 font-extrabold">Razón Social</th>
                                            <th className="p-3.5 font-extrabold">Régimen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {declaracionesOrdenadas.map((d, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                <td className="p-3.5 font-bold text-gray-900">{d.formulario}</td>
                                                <td className="p-3.5 font-bold text-gray-700">{d.periodo}</td>
                                                <td className="p-3.5 font-black text-[#0063AE]">{d.fecha || "-"}</td>
                                                <td className="p-3.5 font-bold text-gray-700">{d.emisor}</td>
                                                <td className="p-3.5 text-gray-600">{d.razonSocialEmisor}</td>
                                                <td className="p-3.5 text-gray-600">{d.regimenTributario || "General"}</td>
                                            </tr>
                                        ))}
                                        {declaracionesOrdenadas.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">No se encontraron declaraciones en este reporte.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {reportCategory === "contribuyentes" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-extrabold text-gray-800 text-sm">Padrón Oficial de Contribuyentes Registrados</h4>
                                    <span className="text-xs font-bold text-gray-500">{contribuyentesOrdenados.length} registros</span>
                                </div>
                                <table className="w-full text-left text-sm text-black">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-[#0063AE]">
                                        <tr>
                                            <th className="p-3.5 font-extrabold">Usuario (Login)</th>
                                            <th className="p-3.5 font-extrabold">RUC</th>
                                            <th className="p-3.5 font-extrabold">Razón Social</th>
                                            <th className="p-3.5 font-extrabold">Correo Electrónico</th>
                                            <th className="p-3.5 font-extrabold">Tipo Contribuyente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contribuyentesOrdenados.map((c, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                <td className="p-3.5 font-bold text-gray-900">{c.usuario}</td>
                                                <td className="p-3.5 font-bold text-[#0063AE]">{c.ruc}</td>
                                                <td className="p-3.5 text-gray-700 font-medium">{c.razonSocial}</td>
                                                <td className="p-3.5 text-gray-600">{c.correo}</td>
                                                <td className="p-3.5 text-gray-600">{c.tipoContribuyente || "General"}</td>
                                            </tr>
                                        ))}
                                        {contribuyentesOrdenados.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No se encontraron contribuyentes en este reporte.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
