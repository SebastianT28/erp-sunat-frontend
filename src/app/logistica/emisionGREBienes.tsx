"use client"

import { useState, useEffect, useMemo } from "react"
import { API_BASE_URL } from "../../config/api"

const API_URL = `${API_BASE_URL}/api/logistica/bien`

const unidadesMedida = ["Kilogramos", "Toneladas", "Litros", "Galones", "Cajas", "Unidades"]
const unidadesMedidaPesoBruto = ["Kilogramos", "Toneladas"]

export interface Bien {
  idBien?: number; normalizado: boolean; codigo: string; descripcion: string
  unidad: string; peso: string; cantidad: string
}

interface BienDB {
  idBien: number; codigoBien: string; descripcion: string
  unidadMedida: string; peso: number; normalizado: boolean
}

interface EmisionGREBienesProps {
  onVolver?: () => void
  onSiguiente?: (bienes: Bien[]) => void
}

export default function EmisionGREBienes({ onVolver, onSiguiente }: EmisionGREBienesProps) {
  const [bienes, setBienes] = useState<Bien[]>([])
  const [unidadPesoBruto, setUnidadPesoBruto] = useState("Kilogramos")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalNormalizado, setModalNormalizado] = useState(false)
  const [modalCodigo, setModalCodigo] = useState("")
  const [modalDescripcion, setModalDescripcion] = useState("")
  const [modalUnidad, setModalUnidad] = useState("")
  const [modalPeso, setModalPeso] = useState("")
  const [modalCantidad, setModalCantidad] = useState("")
  const [modalFrecuente, setModalFrecuente] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensajeError, setMensajeError] = useState("")
  const [mensajeExito, setMensajeExito] = useState("")

  // Sub-modal lista de bienes
  const [listaModalAbierto, setListaModalAbierto] = useState(false)
  const [bienesDB, setBienesDB] = useState<BienDB[]>([])
  const [cargandoLista, setCargandoLista] = useState(false)
  const [errorLista, setErrorLista] = useState("")
  const [busquedaLista, setBusquedaLista] = useState("")

  const puedeAgregarBien = modalCodigo.trim() !== "" && modalDescripcion.trim() !== "" && modalUnidad !== "" && modalPeso.trim() !== "" && modalCantidad.trim() !== "" && !guardando

  // Calcular el peso bruto total automáticamente
  const pesoBrutoTotal = useMemo(() => {
    if (bienes.length === 0) return 0

    let totalKg = 0
    for (const bien of bienes) {
      const pesoUnitario = parseFloat(bien.peso) || 0
      const cantidad = parseInt(bien.cantidad) || 0
      const unidad = bien.unidad

      // Convertir todo a kilogramos primero
      if (unidad === "Toneladas") {
        totalKg += pesoUnitario * cantidad * 1000
      } else {
        // Para Kilogramos y otras unidades, se asume que el peso ya está en kg
        totalKg += pesoUnitario * cantidad
      }
    }

    // Convertir según la unidad seleccionada
    if (unidadPesoBruto === "Toneladas") {
      return totalKg / 1000
    }
    return totalKg
  }, [bienes, unidadPesoBruto])

  // Formatear el peso para mostrar
  const pesoBrutoFormateado = useMemo(() => {
    if (bienes.length === 0) return "0.00"
    return pesoBrutoTotal.toFixed(2)
  }, [pesoBrutoTotal, bienes.length])

  // Cargar lista de bienes desde la BD
  const handleAbrirListaBienes = async () => {
    setListaModalAbierto(true)
    setCargandoLista(true)
    setErrorLista("")
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      if (data.success) {
        setBienesDB(data.data)
      } else {
        setErrorLista("No se pudo cargar la lista de bienes.")
      }
    } catch {
      setErrorLista("Error de conexión al cargar bienes.")
    } finally {
      setCargandoLista(false)
    }
  }

  // Seleccionar bien de la lista y autocompletar
  const handleSeleccionarBienDB = (bien: BienDB) => {
    setModalCodigo(bien.codigoBien)
    setModalDescripcion(bien.descripcion)
    setModalUnidad(bien.unidadMedida)
    setModalPeso(bien.peso !== undefined && bien.peso !== null ? String(bien.peso) : "")
    setModalNormalizado(bien.normalizado ?? false)
    setListaModalAbierto(false)
    setBusquedaLista("")
  }

  const bienesDBUnicos = bienesDB.filter(
    (b, idx, arr) => arr.findIndex(x => x.codigoBien === b.codigoBien) === idx
  )

  const bienesDBFiltrados = bienesDBUnicos.filter(b =>
    b.codigoBien?.toLowerCase().includes(busquedaLista.toLowerCase()) ||
    b.descripcion?.toLowerCase().includes(busquedaLista.toLowerCase())
  )

  const handleAgregarBien = () => {
    if (!puedeAgregarBien) return
    setMensajeError("")
    setMensajeExito("")

    const nuevoBien: Bien = {
      normalizado: modalNormalizado,
      codigo: modalCodigo.trim(),
      descripcion: modalDescripcion.trim(),
      unidad: modalUnidad,
      peso: modalPeso.trim(),
      cantidad: modalCantidad.trim(),
    }
    
    setBienes([...bienes, nuevoBien])
    setMensajeExito("Bien agregado a la lista temporalmente")
    setTimeout(() => setMensajeExito(""), 3000)
    handleCerrarModal()
  }

  const handleCerrarModal = () => { setModalAbierto(false); setModalNormalizado(false); setModalCodigo(""); setModalDescripcion(""); setModalUnidad(""); setModalPeso(""); setModalCantidad(""); setModalFrecuente(false); setMensajeError("") }

  const handleEliminarBien = (index: number) => {
    setBienes(bienes.filter((_, i) => i !== index))
  }

  const puedeSiguiente = bienes.length > 0

  return (
    <div className="relative">
      <h2 className="text-black font-extrabold text-xl mb-1">Emisión de Gre</h2>
      <div className="flex gap-1 mb-6">
        <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
        <div className="flex-1 h-1 bg-[#002f6c] rounded"></div>
        <div className="flex-1 h-1 bg-[#3399ff] rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
      </div>
      <h3 className="text-[#0063AE] font-extrabold text-base mb-4">3. Bienes a transportar</h3>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded flex items-center gap-2 text-sm font-bold animate-fade-in">
          <span className="text-green-600 text-lg">✓</span> {mensajeExito}
        </div>
      )}

      <p className="text-black font-extrabold text-sm mb-4">Detalle de bienes</p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm text-left border-b border-gray-200">
          <thead className="text-xs text-black font-extrabold border-b-2 border-gray-200 uppercase">
            <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Bien normalizado</th><th className="px-4 py-3">Código Bien</th><th className="px-4 py-3">Descripción</th><th className="px-4 py-3">Unid. medida</th><th className="px-4 py-3">Peso</th><th className="px-4 py-3">Cantidad</th><th className="px-4 py-3">Subtotal (kg)</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {bienes.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-gray-500 font-medium">No hay registros disponibles</td></tr>
            ) : (
              bienes.map((b, i) => {
                const pesoUnit = parseFloat(b.peso) || 0
                const cant = parseInt(b.cantidad) || 0
                const subtotalKg = b.unidad === "Toneladas" ? pesoUnit * cant * 1000 : pesoUnit * cant
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 text-black">
                    <td className="px-4 py-3 font-medium">{i + 1}</td><td className="px-4 py-3">{b.normalizado ? "Sí" : "No"}</td><td className="px-4 py-3">{b.codigo}</td><td className="px-4 py-3 font-extrabold">{b.descripcion}</td><td className="px-4 py-3">{b.unidad}</td><td className="px-4 py-3">{b.peso}</td><td className="px-4 py-3">{b.cantidad}</td>
                    <td className="px-4 py-3 font-bold text-[#0063AE]">{subtotalKg.toFixed(2)} kg</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => handleEliminarBien(i)} className="text-red-500 hover:text-red-700 font-bold" title="Eliminar bien">✕</button></td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setModalAbierto(true)} className="bg-[#007bff] text-white px-8 py-2 font-extrabold text-sm shadow hover:bg-[#0056b3] transition-colors">+ Agregar</button>
        <button className="text-[#007bff] font-extrabold text-sm hover:underline flex items-center gap-1"><span className="text-lg leading-none">🔍</span> Bienes Frecuentes</button>
      </div>

      <h4 className="text-black font-extrabold text-sm mb-4">Datos generales de la carga</h4>
      <div className="flex gap-16 mb-2">
        <div>
          <label className="text-black font-extrabold text-xs mb-2 block">Unidad de medida de peso bruto</label>
          <select value={unidadPesoBruto} onChange={(e) => setUnidadPesoBruto(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-[250px] focus:outline-none focus:border-[#0063AE] bg-white">
            {unidadesMedidaPesoBruto.map((u) => (<option key={u} value={u}>{u}</option>))}
          </select>
        </div>
        <div>
          <label className="text-black font-extrabold text-xs mb-2 block">Peso bruto total de la carga</label>
          <div className="relative">
            <input
              type="text"
              value={pesoBrutoFormateado}
              readOnly
              className="border border-gray-300 px-3 py-2 text-sm text-black w-[250px] focus:outline-none bg-gray-50 font-bold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">
              {unidadPesoBruto === "Kilogramos" ? "kg" : "tn"}
            </span>
          </div>
        </div>
      </div>

      {/* Indicador visual del cálculo */}
      {bienes.length > 0 && (
        <div className="flex items-center gap-2 mb-8 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">
            Calculado automáticamente a partir de {bienes.length} bien{bienes.length > 1 ? "es" : ""} registrado{bienes.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
      {bienes.length === 0 && <div className="mb-8"></div>}

      <div className="flex justify-end gap-4 mt-8 border-t border-gray-200 pt-6">
        <button onClick={onVolver} className="bg-[#a6a6a6] text-white px-10 py-2 font-extrabold text-sm hover:bg-gray-500 transition-colors shadow">Volver</button>
        <button onClick={() => onSiguiente?.(bienes)} disabled={!puedeSiguiente} className={`px-10 py-2 font-extrabold text-sm shadow transition-colors ${puedeSiguiente ? "bg-[#0063AE] text-white hover:bg-[#004d8a] cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Siguiente</button>
      </div>
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#007bff] text-white flex items-center justify-between px-5 py-3 shrink-0"><span className="font-extrabold text-sm">Agregar Bien</span><button onClick={handleCerrarModal} className="text-white text-xl font-bold hover:text-gray-200 transition-colors leading-none">✕</button></div>
            <div className="p-6 overflow-y-auto">
              {mensajeError && (
                <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm font-bold">
                  ❌ {mensajeError}
                </div>
              )}
              <div className="flex items-center justify-between mb-6"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={modalNormalizado} onChange={(e) => setModalNormalizado(e.target.checked)} className="accent-[#0063AE] w-4 h-4" /><span className="text-gray-600 text-sm">Bien normalizado</span></label><span className="text-[#e60000] text-sm">Visualice <span className="font-extrabold underline cursor-pointer hover:text-red-800 transition-colors" onClick={handleAbrirListaBienes}>la lista de bienes</span></span></div>
              <div className="flex gap-6 mb-5"><div className="flex-1"><label className="text-black font-extrabold text-xs mb-2 block">Código del bien</label><input type="text" value={modalCodigo} onChange={(e) => setModalCodigo(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE]" /></div><div className="flex-1"><label className="text-black font-extrabold text-xs mb-2 block">Unidad de medida del bien</label><select value={modalUnidad} onChange={(e) => setModalUnidad(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] bg-white"><option value="">Seleccione</option>{unidadesMedida.map((u) => (<option key={u} value={u}>{u}</option>))}</select></div></div>
              <div className="mb-5"><label className="text-black font-extrabold text-xs mb-2 block">Descripción detallada del bien</label><textarea value={modalDescripcion} onChange={(e) => setModalDescripcion(e.target.value)} rows={3} className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] resize-none" /></div>
              <div className="flex gap-6 mb-4"><div className="flex-1"><label className="text-black font-extrabold text-xs mb-2 block">Peso (kg)</label><input type="number" step="0.01" min="0" value={modalPeso} onChange={(e) => setModalPeso(e.target.value)} placeholder="Ej: 25.50" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400" /></div><div className="flex-1"><label className="text-black font-extrabold text-xs mb-2 block">Cantidad</label><input type="number" min="1" value={modalCantidad} onChange={(e) => setModalCantidad(e.target.value)} placeholder="Ej: 10" className="border border-gray-300 px-3 py-2 text-sm text-black w-full focus:outline-none focus:border-[#0063AE] placeholder-gray-400" /></div></div>

              {/* Preview del peso subtotal */}
              {modalPeso && modalCantidad && (
                <div className="mb-6 bg-blue-50 border border-blue-200 px-4 py-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Vista previa del subtotal de peso:</p>
                  <p className="text-sm font-extrabold text-[#0063AE]">
                    {((parseFloat(modalPeso) || 0) * (parseInt(modalCantidad) || 0)).toFixed(2)} {modalUnidad === "Toneladas" ? "tn" : "kg"}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={modalFrecuente} onChange={(e) => setModalFrecuente(e.target.checked)} className="accent-[#0063AE] w-4 h-4" /><span className="text-gray-600 text-sm">Guardar como bien frecuente</span></label><button onClick={handleAgregarBien} disabled={!puedeAgregarBien} className={`px-8 py-2 font-extrabold text-sm border transition-colors ${puedeAgregarBien ? "bg-white text-[#0063AE] border-[#0063AE] hover:bg-[#0063AE] hover:text-white cursor-pointer" : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"}`}>{guardando ? "Guardando..." : "Agregar"}</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: Lista de Bienes en BD */}
      {listaModalAbierto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-white w-[750px] rounded shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-[#002f6c] text-white flex items-center justify-between px-5 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <span className="font-extrabold text-sm">Lista de Bienes Registrados</span>
              </div>
              <button onClick={() => { setListaModalAbierto(false); setBusquedaLista("") }} className="text-white text-xl font-bold hover:text-gray-300 transition-colors leading-none">✕</button>
            </div>

            {/* Buscador */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-200 shrink-0">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por código o descripción..."
                  value={busquedaLista}
                  onChange={e => setBusquedaLista(e.target.value)}
                  className="w-full border border-gray-300 pl-9 pr-3 py-2 text-sm text-black focus:outline-none focus:border-[#002f6c] rounded"
                  autoFocus
                />
              </div>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto flex-1">
              {cargandoLista ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-4 border-[#002f6c] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Cargando bienes...</span>
                </div>
              ) : errorLista ? (
                <div className="px-5 py-8 text-center text-red-600 text-sm font-bold">{errorLista}</div>
              ) : bienesDBFiltrados.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-500 text-sm">
                  {busquedaLista ? "No se encontraron bienes con ese criterio." : "No hay bienes registrados en la base de datos."}
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-white font-extrabold uppercase bg-[#0063AE] sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3">Unid. Medida</th>
                      <th className="px-4 py-3">Peso (kg)</th>
                      <th className="px-4 py-3 text-center">Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bienesDBFiltrados.map((b, idx) => (
                      <tr
                        key={b.idBien}
                        className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        onClick={() => handleSeleccionarBienDB(b)}
                      >
                        <td className="px-4 py-3 font-bold text-[#002f6c]">{b.codigoBien}</td>
                        <td className="px-4 py-3 text-black">{b.descripcion}</td>
                        <td className="px-4 py-3 text-gray-700">{b.unidadMedida}</td>
                        <td className="px-4 py-3 text-gray-700">{b.peso !== undefined && b.peso !== null ? Number(b.peso).toFixed(2) : "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={e => { e.stopPropagation(); handleSeleccionarBienDB(b) }}
                            className="bg-[#0063AE] text-white px-4 py-1 text-xs font-extrabold rounded hover:bg-[#004d8a] transition-colors"
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {!cargandoLista && !errorLista && `${bienesDBFiltrados.length} bien${bienesDBFiltrados.length !== 1 ? "es" : ""} encontrado${bienesDBFiltrados.length !== 1 ? "s" : ""}`}
              </span>
              <button onClick={() => { setListaModalAbierto(false); setBusquedaLista("") }} className="bg-gray-200 text-gray-700 px-5 py-1.5 text-xs font-extrabold rounded hover:bg-gray-300 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
