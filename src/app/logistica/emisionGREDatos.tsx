"use client"
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../config/api"
import { motion, AnimatePresence } from "framer-motion"

import EmisionGREDoc from "./emisionGREDoc"
import EmisionGREBienes from "./emisionGREBienes"
import type { Bien } from "./emisionGREBienes"
import EmisionGREPuntoTraslado from "./emisionGREPuntoTraslado"
import type { Direccion } from "./emisionGREPuntoTraslado"
import EmisionGRETransporte from "./emisionGRETransporte"
import EmisionGREPreview from "./emisionGREPreview"
import type { DatosTransporte } from "./emisionGREPreview"

const API_URL = `${API_BASE_URL}/api/logistica/gre`

const motivosNacional = [
  "Venta","Compra","Venta con entrega a terceros",
  "Traslado entre establecimientos de la misma empresa",
  "Consignación","Devolución","Recojo de bienes transformados","Otros",
]
const motivosExterior = ["Importación","Exportación","Traslado de mercancía extranjera"]
const tiposDocumento = [
  "Documento nacional de identidad","Carnet de extranjería",
  "Registro único de contribuyentes","Pasaporte","Cédula diplomática de identidad",
]

interface Destinatario { tipoDoc: string; numDoc: string; nombre: string; frecuente: boolean }
interface DocRelacionado { tipo: string; ruc: string; serie: string; numero: string }

export default function EmisionGRE() {
  const [paso, setPaso] = useState(1)
  const [tipoGuia, setTipoGuia] = useState<"remitente" | "transportista">("remitente")
  const [comercioExterior, setComercioExterior] = useState(false)
  const [motivoTraslado, setMotivoTraslado] = useState("")
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([])

  // Datos recolectados de los pasos
  const [documentos, setDocumentos] = useState<DocRelacionado[]>([])
  const [bienes, setBienes] = useState<Bien[]>([])
  const [puntoPartida, setPuntoPartida] = useState<Direccion | null>(null)
  const [puntoLlegada, setPuntoLlegada] = useState<Direccion | null>(null)
  const [transporteData, setTransporteData] = useState<DatosTransporte | null>(null)
  const [resultado, setResultado] = useState<{ success: boolean; message: string } | null>(null)

  const [usuarioInfo, setUsuarioInfo] = useState({ ruc: "20498697381", razonSocial: "TRANSPORTES ELIO S.A.C.", idUsuario: 1 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user")
        if (stored) {
          const u = JSON.parse(stored)
          setUsuarioInfo({
            ruc: u.contribuyente?.ruc || "20498697381",
            razonSocial: u.contribuyente?.razonSocial || "TRANSPORTES ELIO S.A.C.",
            idUsuario: u.idUsuario || 1
          })
        }
      } catch (e) {}
    }
  }, [])

  // Modal destinatario
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalTipoDoc, setModalTipoDoc] = useState("")
  const [modalNumDoc, setModalNumDoc] = useState("")
  const [modalNombre, setModalNombre] = useState("")
  const [modalFrecuente, setModalFrecuente] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [encontrado, setEncontrado] = useState(false)
  const [mensajeBusqueda, setMensajeBusqueda] = useState("")

  const puedeAgregar = modalTipoDoc !== "" && modalNumDoc.trim() !== "" && modalNombre.trim() !== "" && encontrado

  const buscarDestinatario = async (numDoc: string) => {
    if (numDoc.trim().length < 8) {
      setModalNombre("")
      setEncontrado(false)
      setMensajeBusqueda("")
      return
    }
    setBuscando(true)
    setMensajeBusqueda("")
    try {
      const res = await fetchWithAuth(`${API_URL.replace("/gre", "/destinatario")}/buscar?numeroDocumento=${numDoc.trim()}`)
      const data = await res.json()
      if (data.success && data.encontrado) {
        setModalNombre(data.data.nombre)
        setEncontrado(true)
        setMensajeBusqueda("")
      } else {
        setModalNombre("")
        setEncontrado(false)
        setMensajeBusqueda("No se encontró destinatario con ese documento!!")
      }
    } catch {
      setModalNombre("")
      setEncontrado(false)
      setMensajeBusqueda("Error al buscar destinatario")
    } finally {
      setBuscando(false)
    }
  }

  const handleNumDocChange = (value: string) => {
    setModalNumDoc(value)
    setEncontrado(false)
    setModalNombre("")
    setMensajeBusqueda("")
  }

  const handleAgregar = () => {
    if (!puedeAgregar) return
    setDestinatarios([...destinatarios, { tipoDoc: modalTipoDoc, numDoc: modalNumDoc, nombre: modalNombre, frecuente: modalFrecuente }])
    setModalTipoDoc(""); setModalNumDoc(""); setModalNombre(""); setModalFrecuente(false); setModalAbierto(false); setEncontrado(false); setMensajeBusqueda("")
  }
  
  const handleCerrarModal = () => { setModalAbierto(false); setModalTipoDoc(""); setModalNumDoc(""); setModalNombre(""); setModalFrecuente(false); setEncontrado(false); setMensajeBusqueda("") }
  const handleEliminarDestinatario = (index: number) => { setDestinatarios(destinatarios.filter((_, i) => i !== index)) }

  const motivos = comercioExterior ? motivosExterior : motivosNacional
  const puedeSiguiente = motivoTraslado !== "" && destinatarios.length > 0

  const transitionProps = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  }

  if (resultado) {
    return (
      <motion.div {...transitionProps} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] pointer-events-none" />
        <h2 className="text-[#0063AE] font-extrabold text-2xl mb-6 relative z-10">Emisión de GRE - Completada</h2>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`p-6 rounded-2xl border relative z-10 shadow-lg ${resultado.success ? "bg-green-50/80 border-green-200" : "bg-red-50/80 border-red-200"}`}
        >
          <div className="flex items-center gap-4 mb-2">
            {resultado.success ? (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className={`text-xl font-extrabold ${resultado.success ? "text-green-700" : "text-red-700"}`}>
              {resultado.message}
            </p>
          </div>
          {resultado.success && <p className="text-gray-600 text-sm ml-16">La Guía de Remisión Electrónica ha sido registrada correctamente en el sistema y el PDF se ha descargado de forma automática.</p>}
        </motion.div>

        <div className="flex justify-end mt-8 relative z-10">
          <button 
            onClick={() => { setResultado(null); setPaso(1); setDestinatarios([]); setDocumentos([]); setBienes([]); setPuntoPartida(null); setPuntoLlegada(null); setTransporteData(null) }} 
            className="bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white px-8 py-3 rounded-xl font-extrabold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            Nueva Emisión
          </button>
        </div>
      </motion.div>
    )
  }

  if (paso === 2) return <motion.div key="p2" {...transitionProps}><EmisionGREDoc onVolver={() => setPaso(1)} onSiguiente={(docs) => { setDocumentos(docs); setPaso(3) }} /></motion.div>
  if (paso === 3) return <motion.div key="p3" {...transitionProps}><EmisionGREBienes onVolver={() => setPaso(2)} onSiguiente={(b) => { setBienes(b); setPaso(4) }} /></motion.div>
  if (paso === 4) return <motion.div key="p4" {...transitionProps}><EmisionGREPuntoTraslado onVolver={() => setPaso(3)} onSiguiente={(partida, llegada) => { setPuntoPartida(partida); setPuntoLlegada(llegada); setPaso(5) }} /></motion.div>
  if (paso === 5) return <motion.div key="p5" {...transitionProps}><EmisionGRETransporte onVolver={() => setPaso(4)} onSiguiente={(data) => { setTransporteData(data); setPaso(6) }} /></motion.div>
  if (paso === 6 && transporteData) return <motion.div key="p6" {...transitionProps}><EmisionGREPreview tipoGuia={tipoGuia} comercioExterior={comercioExterior} motivoTraslado={motivoTraslado} destinatarios={destinatarios} documentos={documentos} bienes={bienes} puntoPartida={puntoPartida} puntoLlegada={puntoLlegada} transporte={transporteData} usuarioInfo={usuarioInfo} onVolver={() => setPaso(5)} onEmitido={(res) => setResultado(res)} /></motion.div>

  return (
    <motion.div {...transitionProps} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
      
      {/* Elementos decorativos */}
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-100 rounded-full blur-[80px] pointer-events-none opacity-60" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-pink-100 rounded-full blur-[80px] pointer-events-none opacity-60" />

      <div className="relative z-10">
        <h2 className="text-[#0063AE] font-extrabold text-2xl mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-[#FF4081]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Nueva Emisión de GRE
        </h2>
        
        {/* Animated Stepper */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 relative">
              <div className="h-2 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: paso >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full ${paso === i ? 'bg-gradient-to-r from-[#0063AE] to-[#FF4081]' : 'bg-[#0063AE]'}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
          <h3 className="text-[#FF4081] font-extrabold text-lg mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-sm">1</span>
            Datos iniciales de emisión
          </h3>

          <div className="mb-6">
            <p className="text-gray-700 font-bold text-sm mb-3">Seleccione el tipo de guía de remisión</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTipoGuia("remitente")} 
                className={`relative overflow-hidden px-8 py-3 rounded-xl font-extrabold text-sm transition-all duration-300 ${tipoGuia === "remitente" ? "text-white shadow-lg shadow-blue-500/30" : "text-[#0063AE] bg-blue-50/50 hover:bg-blue-100/50"}`}
              >
                {tipoGuia === "remitente" && <motion.div layoutId="tipoGuiaBg" className="absolute inset-0 bg-gradient-to-r from-[#0063AE] to-[#004d8a] z-0" />}
                <span className="relative z-10">Remitente</span>
              </button>
              <button 
                onClick={() => setTipoGuia("transportista")} 
                className={`relative overflow-hidden px-8 py-3 rounded-xl font-extrabold text-sm transition-all duration-300 ${tipoGuia === "transportista" ? "text-white shadow-lg shadow-blue-500/30" : "text-[#0063AE] bg-blue-50/50 hover:bg-blue-100/50"}`}
              >
                {tipoGuia === "transportista" && <motion.div layoutId="tipoGuiaBg" className="absolute inset-0 bg-gradient-to-r from-[#0063AE] to-[#004d8a] z-0" />}
                <span className="relative z-10">Transportista</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">RUC</span>
              <span className="text-gray-800 font-semibold">{usuarioInfo.ruc}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Apellidos y nombres, o razón social</span>
              <span className="text-gray-800 font-semibold">{usuarioInfo.razonSocial}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-gray-700 font-bold text-sm mb-3">¿Es una operación de comercio exterior?</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${comercioExterior ? 'border-[#FF4081]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {comercioExterior && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2.5 h-2.5 bg-[#FF4081] rounded-full" />}
                  </div>
                  <input type="radio" className="hidden" checked={comercioExterior === true} onChange={() => { setComercioExterior(true); setMotivoTraslado("") }} />
                  <span className="text-gray-700 text-sm font-medium">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${!comercioExterior ? 'border-[#0063AE]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {!comercioExterior && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2.5 h-2.5 bg-[#0063AE] rounded-full" />}
                  </div>
                  <input type="radio" className="hidden" checked={comercioExterior === false} onChange={() => { setComercioExterior(false); setMotivoTraslado("") }} />
                  <span className="text-gray-700 text-sm font-medium">No</span>
                </label>
              </div>
            </div>

            <div>
              <p className="text-gray-700 font-bold text-sm mb-3">Motivo de traslado</p>
              <div className="relative">
                <select value={motivoTraslado} onChange={(e) => setMotivoTraslado(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] transition-all cursor-pointer shadow-sm hover:border-gray-300 font-medium">
                  <option value="">Seleccione un motivo</option>
                  {motivos.map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700 font-bold text-sm">Destinatarios Agregados</p>
              <button onClick={() => setModalAbierto(true)} className="flex items-center gap-2 text-[#0063AE] font-bold text-sm hover:text-[#FF4081] transition-colors group">
                <span className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-pink-50 flex items-center justify-center transition-colors">+</span>
                Agregar Nuevo
              </button>
            </div>
            
            <AnimatePresence>
              {destinatarios.map((d, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between bg-white border border-gray-100 shadow-sm px-5 py-4 rounded-xl mb-3 text-sm text-gray-700 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <span className="font-extrabold text-gray-900 block">{d.nombre}</span>
                      <span className="text-gray-500 text-xs">{d.tipoDoc} - <span className="font-mono">{d.numDoc}</span></span>
                    </div>
                  </div>
                  <button onClick={() => handleEliminarDestinatario(i)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {destinatarios.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 bg-gray-50">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p className="font-medium text-sm">Aún no has agregado destinatarios</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            onClick={() => setPaso(2)} 
            disabled={!puedeSiguiente} 
            className={`px-10 py-3 rounded-xl font-extrabold text-sm transition-all duration-300 flex items-center gap-2 ${puedeSiguiente ? "bg-gradient-to-r from-[#0063AE] to-[#004d8a] text-white hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Siguiente Paso
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalAbierto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white"
            >
              <div className="bg-gradient-to-r from-[#0063AE] to-[#004d8a] px-6 py-4 flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">Agregar Destinatario</span>
                <button onClick={handleCerrarModal} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-gray-600 font-bold text-xs uppercase tracking-wide mb-2 block">Tipo de documento</label>
                    <div className="relative">
                      <select value={modalTipoDoc} onChange={(e) => setModalTipoDoc(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] transition-all uppercase font-semibold">
                        <option value="">Seleccione</option>
                        {tiposDocumento.map((t) => (<option key={t} value={t}>{t.toUpperCase()}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 font-bold text-xs uppercase tracking-wide mb-2 block">Número</label>
                    <div className="flex gap-2">
                      <input type="text" value={modalNumDoc} onChange={(e) => handleNumDocChange(e.target.value)} placeholder="00000000" className="flex-1 min-w-0 bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 focus:border-[#0063AE] placeholder-gray-400 transition-all font-mono" />
                      <button onClick={() => buscarDestinatario(modalNumDoc)} disabled={buscando || modalNumDoc.trim() === ""} className="bg-[#0063AE] text-white px-4 py-3 rounded-xl text-sm font-bold shadow hover:bg-[#004d8a] disabled:bg-gray-300 disabled:shadow-none transition-colors">
                        {buscando ? (
                          <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        )}
                      </button>
                    </div>
                    {mensajeBusqueda && <p className="text-[#FF4081] text-xs mt-2 font-bold">{mensajeBusqueda}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="text-gray-600 font-bold text-xs uppercase tracking-wide mb-2 block">Razón social / Nombres</label>
                  <input type="text" value={modalNombre} onChange={(e) => setModalNombre(e.target.value)} disabled={encontrado} placeholder="Nombre completo" className={`w-full border px-4 py-3 text-sm text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0063AE]/20 transition-all ${encontrado ? 'bg-green-50 border-green-200 text-green-900 font-bold' : 'bg-gray-50 border-gray-200 focus:border-[#0063AE] placeholder-gray-400'}`} />
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors mb-6">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${modalFrecuente ? 'bg-[#FF4081] border-[#FF4081]' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                    {modalFrecuente && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={modalFrecuente} onChange={(e) => setModalFrecuente(e.target.checked)} />
                  <span className="text-gray-700 text-sm font-medium">Guardar como Destinatario frecuente</span>
                </label>
                
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button onClick={handleCerrarModal} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
                  <button onClick={handleAgregar} disabled={!puedeAgregar} className={`px-8 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-sm ${puedeAgregar ? "bg-[#0063AE] text-white hover:bg-[#004d8a] hover:shadow-md active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Agregar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
