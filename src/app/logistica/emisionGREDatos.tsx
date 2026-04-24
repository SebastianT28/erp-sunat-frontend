"use client"

import { useState } from "react"
import EmisionGREDoc from "./emisionGREDoc"
import EmisionGREBienes from "./emisionGREBienes"
import EmisionGREPuntoTraslado from "./emisionGREPuntoTraslado"
import EmisionGRETransporte from "./emisionGRETransporte"

const motivosNacional = [
  "Venta",
  "Compra",
  "Venta con entrega a terceros",
  "Traslado entre establecimientos de la misma empresa",
  "Consignación",
  "Devolución",
  "Recojo de bienes transformados",
  "Otros",
]

const motivosExterior = [
  "Importación",
  "Exportación",
  "Traslado de mercancía extranjera",
]

const tiposDocumento = [
  "Documento nacional de identidad",
  "Carnet de extranjería",
  "Registro único de contribuyentes",
  "Pasaporte",
  "Cédula diplomática de identidad",
]

interface Destinatario {
  tipoDoc: string
  numDoc: string
  nombre: string
  frecuente: boolean
}

export default function EmisionGRE() {
  const [paso, setPaso] = useState(1)
  const [tipoGuia, setTipoGuia] = useState<"remitente" | "transportista">("remitente")
  const [comercioExterior, setComercioExterior] = useState(false)
  const [motivoTraslado, setMotivoTraslado] = useState("")
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([])

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalTipoDoc, setModalTipoDoc] = useState("")
  const [modalNumDoc, setModalNumDoc] = useState("")
  const [modalNombre, setModalNombre] = useState("")
  const [modalFrecuente, setModalFrecuente] = useState(false)

  const puedeAgregar = modalTipoDoc !== "" && modalNumDoc.trim() !== "" && modalNombre.trim() !== ""

  const handleAgregar = () => {
    if (!puedeAgregar) return
    setDestinatarios([...destinatarios, {
      tipoDoc: modalTipoDoc,
      numDoc: modalNumDoc,
      nombre: modalNombre,
      frecuente: modalFrecuente,
    }])
    setModalTipoDoc("")
    setModalNumDoc("")
    setModalNombre("")
    setModalFrecuente(false)
    setModalAbierto(false)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setModalTipoDoc("")
    setModalNumDoc("")
    setModalNombre("")
    setModalFrecuente(false)
  }
  const handleEliminarDestinatario = (index: number) => {
    setDestinatarios(destinatarios.filter((_, i) => i !== index))
  }

  const motivos = comercioExterior ? motivosExterior : motivosNacional

  // Siguiente habilitado solo si hay datos completos
  const puedeSiguiente = motivoTraslado !== "" && destinatarios.length > 0

  if (paso === 2) {
    return <EmisionGREDoc onVolver={() => setPaso(1)} onSiguiente={() => setPaso(3)} />
  }

  if (paso === 3) {
    return <EmisionGREBienes onVolver={() => setPaso(2)} onSiguiente={() => setPaso(4)} />
  }

  if (paso === 4) {
    return <EmisionGREPuntoTraslado onVolver={() => setPaso(3)} onSiguiente={() => setPaso(5)} />
  }

  if (paso === 5) {
    return <EmisionGRETransporte onVolver={() => setPaso(4)} onEmitir={() => alert("GRE Emitida exitosamente")} />
  }

  return (
    <div className="relative">
      {/* Título */}
      <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

      {/* Barra de progreso (5 pasos) */}
      <div className="flex gap-1 mb-6">
        <div className="flex-1 h-1 bg-[#0063AE] rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
      </div>

      {/* Paso 1 */}
      <h3 className="text-[#0063AE] font-extrabold text-base mb-4">1. Datos de emisión</h3>

      {/* Tipo de guía */}
      <p className="text-black font-extrabold text-sm mb-3">Seleccione el tipo de guía de remisión</p>

      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setTipoGuia("remitente")}
          className={`px-8 py-2 font-extrabold text-sm transition-colors ${tipoGuia === "remitente"
            ? "bg-[#0063AE] text-white"
            : "bg-white text-[#0063AE] border-2 border-[#0063AE]"
            }`}
        >
          Remitente
        </button>
        <button
          onClick={() => setTipoGuia("transportista")}
          className={`px-8 py-2 font-extrabold text-sm transition-colors ${tipoGuia === "transportista"
            ? "bg-[#0063AE] text-white"
            : "bg-white text-[#0063AE] border-2 border-[#0063AE]"
            }`}
        >
          Transportista
        </button>
      </div>

      {/* RUC y Razón social */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-black font-extrabold text-sm">RUC</span>
          <span className="text-gray-600 text-sm">20498697381</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-black font-extrabold text-sm">Apellidos y nombres, denominación o razón social</span>
          <span className="text-gray-600 text-sm">TRANSPORTES ELIO S.A.C.</span>
        </div>
      </div>

      {/* Comercio exterior */}
      <p className="text-black font-extrabold text-sm mb-2">¿Es una operación de comercio exterior?</p>
      <div className="flex gap-8 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="comercioExterior"
            checked={comercioExterior === true}
            onChange={() => { setComercioExterior(true); setMotivoTraslado("") }}
            className="accent-[#0063AE]"
          />
          <span className="text-black text-sm">Sí</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="comercioExterior"
            checked={comercioExterior === false}
            onChange={() => { setComercioExterior(false); setMotivoTraslado("") }}
            className="accent-[#0063AE]"
          />
          <span className="text-black text-sm">No</span>
        </label>
      </div>

      {/* Motivo de traslado */}
      <p className="text-black font-extrabold text-sm mb-2">Motivo de traslado</p>
      <select
        value={motivoTraslado}
        onChange={(e) => setMotivoTraslado(e.target.value)}
        className="border border-gray-300 px-3 py-2 text-sm text-black w-[450px] mb-6 focus:outline-none focus:border-[#0063AE] bg-white"
      >
        <option value="">Seleccione</option>
        {motivos.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Agrega un destinatario */}
      <p className="text-black font-extrabold text-sm mb-2">Agrega un destinatario</p>

      {/* Lista de destinatarios agregados */}
      {destinatarios.length > 0 && (
        <div className="mb-3">
          {destinatarios.map((d, i) => (
            <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2 rounded mb-2 text-sm text-black">
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-extrabold">{d.nombre}</span>
                <span className="text-gray-500">({d.tipoDoc} - {d.numDoc})</span>
              </div>
              <button
                onClick={() => handleEliminarDestinatario(i)}
                className="text-red-500 hover:text-red-700 font-bold"
                title="Eliminar destinatario"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setModalAbierto(true)}
        className="bg-[#0063AE] text-white px-6 py-2 font-extrabold text-sm shadow hover:bg-[#004d8a] transition-colors mb-8"
      >
        Agregar +
      </button>

      {/* Botón Siguiente */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setPaso(2)}
          disabled={!puedeSiguiente}
          className={`px-8 py-2 font-extrabold text-sm border-2 transition-colors ${puedeSiguiente
            ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer"
            : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            }`}
        >
          Siguiente
        </button>
      </div>

      {/* ====== Modal Agregar Destinatario ====== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[550px] rounded shadow-xl overflow-hidden">

            {/* Header del modal */}
            <div className="bg-[#0063AE] text-white flex items-center justify-between px-5 py-3">
              <span className="font-extrabold text-sm">Agregar Destinatario</span>
              <button
                onClick={handleCerrarModal}
                className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del modal */}
            <div className="p-5">

              <div className="flex gap-4 mb-4">
                {/* Tipo de documento */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-1 block">
                    Tipo de documento de identidad
                  </label>
                  <select
                    value={modalTipoDoc}
                    onChange={(e) => setModalTipoDoc(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white uppercase font-bold"
                  >
                    <option value="">Seleccione</option>
                    {tiposDocumento.map((t) => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Número de documento */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-1 block">
                    Número de documento de identidad
                  </label>
                  <input
                    type="text"
                    value={modalNumDoc}
                    onChange={(e) => setModalNumDoc(e.target.value)}
                    placeholder="Ingrese el número"
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Apellidos y nombres */}
              <label className="text-black font-extrabold text-xs mb-1 block">
                Apellidos y nombres, denominación o razón social
              </label>
              <input
                type="text"
                value={modalNombre}
                onChange={(e) => setModalNombre(e.target.value)}
                placeholder="Ingrese apellidos y nombres"
                className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 mb-1"
              />

              {/* Resultado con checkmark (se muestra cuando hay texto) */}
              {modalNombre.trim() !== "" && (
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded flex items-center gap-2 mb-4">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-black font-extrabold text-sm uppercase">{modalNombre}</span>
                </div>
              )}

              {/* Checkbox frecuente */}
              <div className="flex items-center gap-2 mt-4 mb-6">
                <input
                  type="checkbox"
                  checked={modalFrecuente}
                  onChange={(e) => setModalFrecuente(e.target.checked)}
                  className="accent-[#0063AE]"
                />
                <span className="text-black text-xs">Guardar como Destinatario frecuente</span>
              </div>

              {/* Botón Agregar */}
              <div className="flex justify-end">
                <button
                  onClick={handleAgregar}
                  disabled={!puedeAgregar}
                  className={`px-8 py-2 font-extrabold text-sm transition-colors ${puedeAgregar
                    ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Agregar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}