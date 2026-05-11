"use client"

import { useState, useEffect, useMemo } from "react"

const API_URL = "http://localhost:8080/api/logistica/bien"

const unidadesMedida = ["Kilogramos","Toneladas","Litros","Galones","Cajas","Unidades"]
const unidadesMedidaPesoBruto = ["Kilogramos","Toneladas"]

export interface Bien {
  idBien?: number; normalizado: boolean; codigo: string; descripcion: string
  unidad: string; peso: string; cantidad: string
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

  const handleAgregarBien = async () => {
    if (!puedeAgregarBien) return
    setGuardando(true)
    setMensajeError("")
    setMensajeExito("")

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoBien: modalCodigo.trim(),
          descripcion: modalDescripcion.trim(),
          unidadMedida: modalUnidad,
          peso: parseFloat(modalPeso) || 0,
          cantidad: parseInt(modalCantidad) || 1,
          normalizado: modalNormalizado,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const nuevoBien: Bien = {
          idBien: data.idBien,
          normalizado: modalNormalizado,
          codigo: modalCodigo.trim(),
          descripcion: modalDescripcion.trim(),
          unidad: modalUnidad,
          peso: modalPeso.trim(),
          cantidad: modalCantidad.trim(),
        }
        setBienes([...bienes, nuevoBien])
        setMensajeExito("Bien registrado exitosamente")
        setTimeout(() => setMensajeExito(""), 3000)
        handleCerrarModal()
      } else {
        setMensajeError(data.message || "Error al registrar el bien")
      }
    } catch {
      setMensajeError("Error de conexión con el servidor")
    } finally {
      setGuardando(false)
    }
  }

  const handleCerrarModal = () => { setModalAbierto(false); setModalNormalizado(false); setModalCodigo(""); setModalDescripcion(""); setModalUnidad(""); setModalPeso(""); setModalCantidad(""); setModalFrecuente(false); setMensajeError("") }

  const handleEliminarBien = async (index: number) => {
    const bien = bienes[index]
    // Si tiene ID en la base de datos, eliminarlo del backend también
    if (bien.idBien) {
      try {
        await fetch(`${API_URL}/${bien.idBien}`, { method: "DELETE" })
      } catch {
        // Continuar eliminando del frontend aunque falle el backend
      }
    }
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
              <div className="flex items-center justify-between mb-6"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={modalNormalizado} onChange={(e) => setModalNormalizado(e.target.checked)} className="accent-[#0063AE] w-4 h-4" /><span className="text-gray-600 text-sm">Bien normalizado</span></label><span className="text-[#e60000] text-sm">Visualice <span className="font-extrabold underline cursor-pointer">la lista de bienes</span></span></div>
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
    </div>
  )
}
