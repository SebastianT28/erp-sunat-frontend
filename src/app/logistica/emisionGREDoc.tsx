"use client"

import { useState } from "react"

const tiposDocumentoRelacionado = [
  "Factura",
  "Boleta de venta",
  "Guia de remision remitente",
]

interface DocumentoRelacionado {
  tipo: string
  ruc: string
  serie: string
  numero: string
}

interface EmisionGREDocProps {
  onVolver?: () => void
  onSiguiente?: () => void
}

export default function EmisionGREDoc({ onVolver, onSiguiente }: EmisionGREDocProps) {
  const [documentos, setDocumentos] = useState<DocumentoRelacionado[]>([])

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalTipo, setModalTipo] = useState("")
  const modalRuc = "20498697381" // Fijo como se solicitó
  const [modalSerie, setModalSerie] = useState("")
  const [modalNumero, setModalNumero] = useState("")

  const puedeAgregar = modalTipo !== "" && modalSerie.trim() !== "" && modalNumero.trim() !== ""

  const handleAgregar = () => {
    if (!puedeAgregar) return
    setDocumentos([...documentos, {
      tipo: modalTipo,
      ruc: modalRuc,
      serie: modalSerie,
      numero: modalNumero,
    }])
    setModalTipo("")
    setModalSerie("")
    setModalNumero("")
    setModalAbierto(false)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setModalTipo("")
    setModalSerie("")
    setModalNumero("")
  }

  const handleEliminarDocumento = (index: number) => {
    setDocumentos(documentos.filter((_, i) => i !== index))
  }

  return (
    <div className="relative">
      {/* Título */}
      <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

      {/* Barra de progreso (5 pasos) */}
      <div className="flex gap-1 mb-6">
        <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 1 completado */}
        <div className="flex-1 h-1 bg-[#3399ff] rounded"></div> {/* Paso 2 activo */}
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
      </div>

      {/* Paso 2 */}
      <h3 className="text-[#0063AE] font-extrabold text-base mb-4">2. Documentos relacionados</h3>

      <p className="text-black font-extrabold text-sm mb-4">Agrega documentos relacionados</p>

      <button
        onClick={() => setModalAbierto(true)}
        className="bg-[#0063AE] text-white px-6 py-2 font-extrabold text-sm shadow hover:bg-[#004d8a] transition-colors mb-6"
      >
        Agregar +
      </button>

      {/* Lista de documentos agregados */}
      {documentos.length > 0 && (
        <div className="mb-6">
          {documentos.map((d, i) => (
            <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded mb-2 text-sm text-black">
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <span className="font-extrabold">{d.tipo}</span>
                  <span className="text-gray-600 ml-2">Serie: {d.serie} - N°: {d.numero}</span>
                </div>
              </div>
              <button
                onClick={() => handleEliminarDocumento(i)}
                className="text-red-500 hover:text-red-700 font-bold"
                title="Eliminar documento"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botones Volver y Siguiente */}
      <div className="flex justify-end gap-4 mt-12 border-t border-gray-200 pt-6">
        <button
          onClick={onVolver}
          className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow"
        >
          Volver
        </button>
        <button
          onClick={onSiguiente}
          disabled={documentos.length === 0}
          className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${
            documentos.length > 0
              ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </div>

      {/* ====== Modal Agregar Documento ====== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[750px] rounded shadow-xl overflow-hidden">

            {/* Header del modal */}
            <div className="bg-[#3399ff] text-white flex items-center justify-between px-5 py-3">
              <span className="font-medium text-sm">Agregar Documento</span>
              <button
                onClick={handleCerrarModal}
                className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del modal */}
            <div className="p-6">

              <div className="flex gap-6 mb-5">
                {/* Tipo de documento relacionado */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Tipo de documento relacionado
                  </label>
                  <select
                    value={modalTipo}
                    onChange={(e) => setModalTipo(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                  >
                    <option value="">Seleccione</option>
                    {tiposDocumentoRelacionado.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Número de RUC del emisor */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Número de RUC del emisor
                  </label>
                  <input
                    type="text"
                    value={modalRuc}
                    disabled
                    className="border border-gray-300 px-3 py-2 text-sm text-gray-600 w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-6 mb-8">
                {/* Serie de documento */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Serie de documento
                  </label>
                  <input
                    type="text"
                    value={modalSerie}
                    onChange={(e) => setModalSerie(e.target.value)}
                    placeholder="ESCRIBA"
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                  />
                </div>

                {/* Número de documento */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Número de documento
                  </label>
                  <input
                    type="text"
                    value={modalNumero}
                    onChange={(e) => setModalNumero(e.target.value)}
                    placeholder="ESCRIBA"
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400 uppercase"
                  />
                </div>
              </div>

              {/* Botón Agregar */}
              <div className="flex justify-end">
                <button
                  onClick={handleAgregar}
                  disabled={!puedeAgregar}
                  className={`px-8 py-2 font-extrabold text-sm border transition-colors ${
                    puedeAgregar
                      ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer"
                      : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
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
