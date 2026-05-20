"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../../config/api"

export default function DeclaracionesPanel() {
    const [declaraciones, setDeclaraciones] = useState<any[]>([])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/gerencia/declaraciones`)
            .then(res => res.json())
            .then(data => setDeclaraciones(data))
            .catch(err => console.error(err))
    }, [])

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [declaracionToDelete, setDeclaracionToDelete] = useState<number | null>(null)

    const openDeleteModal = (id: number) => {
        setDeclaracionToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const executeDelete = () => {
        if (declaracionToDelete === null) return
        fetch(`${API_BASE_URL}/api/gerencia/declaraciones/${declaracionToDelete}`, { method: "DELETE" })
            .then(() => {
                setDeclaraciones(declaraciones.filter(d => d.id !== declaracionToDelete))
                setIsDeleteModalOpen(false)
                setDeclaracionToDelete(null)
            })
            .catch(err => console.error(err))
    }

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full overflow-hidden">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#0063AE]">Declaraciones</h2>
                <p className="text-sm text-gray-500">Todas las declaraciones existentes.</p>
            </div>

            <div className="bg-white p-6 shadow-sm rounded-lg flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {declaraciones.map(d => (
                        <div key={d.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow flex justify-between items-center bg-gray-50 hover:bg-white group">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#0063AE] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Declaración</span>
                                    <span className="text-xs text-gray-500 font-bold">{d.fecha}</span>
                                </div>
                                <h4 className="font-extrabold text-black text-lg">{d.formulario}</h4>
                                <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
                                    <p>Periodo Tributario: <span className="font-bold text-black">{d.periodo}</span></p>
                                    <p>RUC Emisor: <span className="font-bold text-black">{d.emisor}</span></p>
                                </div>
                            </div>
                            <button
                                className="bg-white border border-red-200 text-[#b42828] p-3 rounded-full hover:bg-[#b42828] hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                onClick={() => openDeleteModal(d.id)}
                                title="Eliminar Declaración"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {declaraciones.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 font-bold">
                            No hay declaraciones disponibles.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL ADVERTENCIA ELIMINAR */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[400px] text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Eliminar Declaración</h3>
                        <p className="text-sm text-gray-500 mb-8">
                            ¿Estás seguro que deseas eliminar permanentemente esta declaración? Esta acción es irreversible y borrará los registros fiscales asociados.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setDeclaracionToDelete(null)
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
