"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../../config/api"

import { fetchWithAuth } from "@/utils/fetchWithAuth"

export default function GrePanel() {
    const [gres, setGres] = useState<any[]>([])

    useEffect(() => {
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/gres`)
            .then(res => res.json())
            .then(data => setGres(data))
            .catch(err => console.error(err))
    }, [])

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editGre, setEditGre] = useState<any>({ id: null, serie: "", numero: "", estado: "", emisor: "", reclamo: null })
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [greToDelete, setGreToDelete] = useState<number | null>(null)

    const handleUpdateGre = () => {
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/gres/${editGre.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editGre)
        })
        .then(res => res.json())
        .then(data => {
            setGres(gres.map(g => g.id === editGre.id ? data : g))
            setIsEditModalOpen(false)
        })
        .catch(err => console.error(err))
    }

    const openDeleteModal = (id: number) => {
        setGreToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const executeDelete = () => {
        if (greToDelete === null) return
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/gres/${greToDelete}`, { method: "DELETE" })
            .then(() => {
                setGres(gres.filter(g => g.id !== greToDelete))
                setIsDeleteModalOpen(false)
                setGreToDelete(null)
            })
            .catch(err => console.error(err))
    }

    const [searchQuery, setSearchQuery] = useState("")

    // Busqueda sensitiva (case-insensitive)
    const filteredGres = gres.filter(g => {
        const fullNumber = `${g.serie}-${g.numero}`.toLowerCase()
        const query = searchQuery.toLowerCase()
        
        return fullNumber.includes(query) || 
               g.emisor.toLowerCase().includes(query) || 
               g.estado.toLowerCase().includes(query) || 
               (g.reclamo && g.reclamo.toLowerCase().includes(query))
    })

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0063AE]">Guías de Remisión Electrónica</h2>
                <p className="text-sm text-gray-500">Supervise todas las GRE emitidas por los usuarios de la plataforma.</p>
            </div>
            
            <div className="bg-white p-6 shadow-sm rounded-lg flex-1 flex flex-col min-h-0">
                <div className="mb-6 flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Buscar por serie, número, emisor, estado o reclamo..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded w-[500px] text-sm text-black focus:outline-none focus:border-[#0063AE]" 
                    />
                </div>

                <div className="overflow-auto border border-gray-200 rounded">
                    <table className="w-full text-left text-sm text-black">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[#0063AE]">
                            <tr>
                                <th className="p-4 font-extrabold">Numeración</th>
                                <th className="p-4 font-extrabold">RUC Emisor</th>
                                <th className="p-4 font-extrabold text-center">Estado</th>
                                <th className="p-4 font-extrabold text-center">Reclamos</th>
                                <th className="p-4 font-extrabold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGres.map(g => (
                                <tr key={g.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <td className="p-4 font-bold">{g.serie}-{g.numero}</td>
                                    <td className="p-4">{g.emisor}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                            g.estado === 'Emitido' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                            g.estado === 'Baja' ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                                            'bg-orange-100 text-orange-700 border border-orange-200'
                                        }`}>
                                            {g.estado}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {g.reclamo ? (
                                            <span className="text-[#b42828] font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100" title={g.reclamo}>
                                                ⚠️ Hay reclamo
                                            </span>
                                        ) : <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button 
                                            className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-200 transition-colors"
                                            onClick={() => {
                                                setEditGre(g)
                                                setIsEditModalOpen(true)
                                            }}
                                        >
                                            Actualizar
                                        </button>
                                        <button 
                                            className="bg-red-100 text-red-700 px-4 py-1.5 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                                            onClick={() => openDeleteModal(g.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredGres.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No se encontraron guías que coincidan con la búsqueda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL ACTUALIZAR GRE */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[400px]">
                        <h3 className="text-xl font-extrabold text-[#0063AE] mb-6 border-b pb-3">Actualizar Estado GRE</h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Guía Seleccionada</label>
                                <input 
                                    type="text" 
                                    readOnly
                                    className="bg-gray-100 border border-gray-300 p-2 rounded w-full text-sm font-bold text-gray-700 cursor-not-allowed focus:outline-none"
                                    value={`${editGre.serie}-${editGre.numero}`}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Estado</label>
                                <select 
                                    className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                    value={editGre.estado}
                                    onChange={e => setEditGre({...editGre, estado: e.target.value})}
                                >
                                    <option value="Emitido">Emitido</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Con Reclamo">Con Reclamo</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors border border-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleUpdateGre}
                                className="bg-[#0063AE] text-white font-extrabold px-6 py-2 rounded text-sm shadow hover:bg-[#004d8a] transition-colors"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ADVERTENCIA ELIMINAR */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[400px] text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Eliminar Guía</h3>
                        <p className="text-sm text-gray-500 mb-8">
                            ¿Estás seguro que deseas eliminar permanentemente esta Guía de Remisión Electrónica? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setGreToDelete(null)
                                }}
                                className="bg-gray-100 text-gray-700 font-bold px-4 py-3 rounded text-sm hover:bg-gray-200 transition-colors border border-gray-300 w-full"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="bg-red-600 text-white font-extrabold px-6 py-3 rounded text-sm shadow hover:bg-red-700 transition-colors w-full"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
