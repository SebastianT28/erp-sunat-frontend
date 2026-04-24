"use client"

import { useState } from "react"

const unidadesMedida = [
  "Kilogramos",
  "Toneladas",
  "Litros",
  "Galones",
  "Cajas",
  "Unidades",
]

const unidadesMedidaPesoBruto = [
  "Kilogramos",
  "Toneladas",
]

interface Bien {
  normalizado: boolean
  codigo: string
  descripcion: string
  unidad: string
  peso: string
  cantidad: string
}

interface EmisionGREBienesProps {
  onVolver?: () => void
  onSiguiente?: () => void
}

export default function EmisionGREBienes({ onVolver, onSiguiente }: EmisionGREBienesProps) {
  const [bienes, setBienes] = useState<Bien[]>([])

  // Datos generales de la carga
  const [unidadPesoBruto, setUnidadPesoBruto] = useState("Kilogramos")
  const [pesoBrutoTotal, setPesoBrutoTotal] = useState("")

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalNormalizado, setModalNormalizado] = useState(false)
  const [modalCodigo, setModalCodigo] = useState("")
  const [modalDescripcion, setModalDescripcion] = useState("")
  const [modalUnidad, setModalUnidad] = useState("")
  const [modalPeso, setModalPeso] = useState("")
  const [modalCantidad, setModalCantidad] = useState("")
  const [modalFrecuente, setModalFrecuente] = useState(false)

  const puedeAgregarBien =
    modalCodigo.trim() !== "" &&
    modalDescripcion.trim() !== "" &&
    modalUnidad !== "" &&
    modalPeso.trim() !== "" &&
    modalCantidad.trim() !== ""

  const handleAgregarBien = () => {
    if (!puedeAgregarBien) return
    setBienes([...bienes, {
      normalizado: modalNormalizado,
      codigo: modalCodigo,
      descripcion: modalDescripcion,
      unidad: modalUnidad,
      peso: modalPeso,
      cantidad: modalCantidad,
    }])
    handleCerrarModal()
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setModalNormalizado(false)
    setModalCodigo("")
    setModalDescripcion("")
    setModalUnidad("")
    setModalPeso("")
    setModalCantidad("")
    setModalFrecuente(false)
  }

  const handleEliminarBien = (index: number) => {
    setBienes(bienes.filter((_, i) => i !== index))
  }

  // Siguiente habilitado si hay al menos un bien y se ha ingresado el peso bruto total
  const puedeSiguiente = bienes.length > 0 && pesoBrutoTotal.trim() !== ""

  return (
    <div className="relative">
      {/* Título */}
      <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>

      {/* Barra de progreso (5 pasos) */}
      <div className="flex gap-1 mb-6">
        <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 1 completado */}
        <div className="flex-1 h-1 bg-[#002f6c] rounded"></div> {/* Paso 2 completado */}
        <div className="flex-1 h-1 bg-[#3399ff] rounded"></div> {/* Paso 3 activo */}
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
      </div>

      {/* Paso 3 */}
      <h3 className="text-[#0063AE] font-extrabold text-base mb-4">3. Bienes a transportar</h3>

      <p className="text-black font-extrabold text-sm mb-4">Detalle de bienes</p>

      {/* Tabla de bienes */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm text-left border-b border-gray-200">
          <thead className="text-xs text-black font-extrabold border-b-2 border-gray-200 uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Bien normalizado</th>
              <th className="px-4 py-3">Código Bien</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Unid. medida</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {bienes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500 font-medium">
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              bienes.map((b, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 text-black">
                  <td className="px-4 py-3 font-medium">{i + 1}</td>
                  <td className="px-4 py-3">{b.normalizado ? "Sí" : "No"}</td>
                  <td className="px-4 py-3">{b.codigo}</td>
                  <td className="px-4 py-3 font-extrabold">{b.descripcion}</td>
                  <td className="px-4 py-3">{b.unidad}</td>
                  <td className="px-4 py-3">{b.peso}</td>
                  <td className="px-4 py-3">{b.cantidad}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEliminarBien(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Eliminar bien"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors"
        >
          + Agregar
        </button>
        <button className="text-[#007bff] font-extrabold text-sm hover:underline flex items-center gap-1">
          <span className="text-lg leading-none">🔍</span> Bienes Frecuentes
        </button>
      </div>

      {/* Datos generales de la carga */}
      <h4 className="text-black font-extrabold text-sm mb-4">Datos generales de la carga</h4>

      <div className="flex gap-16 mb-8">
        <div>
          <label className="text-black font-extrabold text-xs mb-2 block">
            Unidad de medida de peso bruto
          </label>
          <select
            value={unidadPesoBruto}
            onChange={(e) => setUnidadPesoBruto(e.target.value)}
            className="border border-gray-300 px-3 py-2 text-sm text-black w-[250px] focus:outline-none focus:border-[#0063AE] bg-white"
          >
            {unidadesMedidaPesoBruto.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-black font-extrabold text-xs mb-2 block">
            Peso bruto total de la carga
          </label>
          <input
            type="text"
            value={pesoBrutoTotal}
            onChange={(e) => setPesoBrutoTotal(e.target.value)}
            className="border border-gray-300 px-3 py-2 text-sm text-black w-[250px] focus:outline-none focus:border-[#0063AE]"
          />
        </div>
      </div>

      {/* Botones Volver y Siguiente */}
      <div className="flex justify-end gap-4 mt-8 border-t border-gray-200 pt-6">
        <button
          onClick={onVolver}
          className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow"
        >
          Volver
        </button>
        <button
          onClick={onSiguiente}
          disabled={!puedeSiguiente}
          className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeSiguiente
              ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Siguiente
        </button>
      </div>

      {/* ====== Modal Agregar Bien ====== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header del modal */}
            <div className="bg-[#007bff] text-white flex items-center justify-between px-5 py-3 shrink-0">
              <span className="font-extrabold text-sm">Agregar Bien</span>
              <button
                onClick={handleCerrarModal}
                className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del modal */}
            <div className="p-6 overflow-y-auto">

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalNormalizado}
                    onChange={(e) => setModalNormalizado(e.target.checked)}
                    className="accent-[#0063AE] w-4 h-4"
                  />
                  <span className="text-gray-600 text-sm">Bien normalizado</span>
                </label>
                <span className="text-[#e60000] text-sm">
                  Visualice <span className="font-extrabold underline cursor-pointer">la lista de bienes</span>
                </span>
              </div>

              <div className="flex gap-6 mb-5">
                {/* Código del bien */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Código del bien
                  </label>
                  <input
                    type="text"
                    value={modalCodigo}
                    onChange={(e) => setModalCodigo(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE]"
                  />
                </div>

                {/* Unidad de medida */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Unidad de medida del bien
                  </label>
                  <select
                    value={modalUnidad}
                    onChange={(e) => setModalUnidad(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"
                  >
                    <option value="">Seleccione</option>
                    {unidadesMedida.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción detallada del bien */}
              <div className="mb-5">
                <label className="text-black font-extrabold text-xs mb-2 block">
                  Descripción detallada del bien
                </label>
                <textarea
                  value={modalDescripcion}
                  onChange={(e) => setModalDescripcion(e.target.value)}
                  rows={3}
                  className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] resize-none"
                />
              </div>

              <div className="flex gap-6 mb-8">
                {/* Peso */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Peso
                  </label>
                  <input
                    type="text"
                    value={modalPeso}
                    onChange={(e) => setModalPeso(e.target.value)}
                    placeholder="ESCRIBA"
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400"
                  />
                </div>

                {/* Cantidad */}
                <div className="flex-1">
                  <label className="text-black font-extrabold text-xs mb-2 block">
                    Cantidad
                  </label>
                  <input
                    type="text"
                    value={modalCantidad}
                    onChange={(e) => setModalCantidad(e.target.value)}
                    placeholder="ESCRIBA"
                    className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Checkbox frecuente y Botón Agregar */}
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalFrecuente}
                    onChange={(e) => setModalFrecuente(e.target.checked)}
                    className="accent-[#0063AE] w-4 h-4"
                  />
                  <span className="text-gray-600 text-sm">Guardar como bien frecuente</span>
                </label>

                <button
                  onClick={handleAgregarBien}
                  disabled={!puedeAgregarBien}
                  className={`px-8 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarBien
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
