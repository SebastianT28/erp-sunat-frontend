"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "../../../config/api"
import { fetchWithAuth } from "@/utils/fetchWithAuth"

export default function ContribuyentesPanel() {
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newUser, setNewUser] = useState({ usuario: "", correo: "", ruc: "", razonSocial: "", password: "" })
    const [rucStatus, setRucStatus] = useState<"idle" | "loading" | "found" | "not_found">("idle")
    const [searchQuery, setSearchQuery] = useState("")

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editUser, setEditUser] = useState<any>({ id: null, usuario: "", correo: "", ruc: "", razonSocial: "", password: "" })
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<number | null>(null)

    const filteredUsuarios = usuarios.filter(u => {
        const query = searchQuery.toLowerCase()
        return (u.usuario && u.usuario.toLowerCase().includes(query)) ||
               (u.ruc && u.ruc.toLowerCase().includes(query)) ||
               (u.razonSocial && u.razonSocial.toLowerCase().includes(query))
    })

    useEffect(() => {
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/usuarios`)
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (newUser.ruc.length === 11) {
            setRucStatus("loading")
            fetchWithAuth(`${API_BASE_URL}/api/login/contribuyentes/${newUser.ruc}`)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    throw new Error("No encontrado")
                })
                .then(data => {
                    setNewUser(prev => ({ ...prev, razonSocial: data.razonSocial }))
                    setRucStatus("found")
                })
                .catch(() => {
                    setNewUser(prev => ({ ...prev, razonSocial: "" }))
                    setRucStatus("not_found")
                })
        } else {
            setNewUser(prev => ({ ...prev, razonSocial: "" }))
            setRucStatus("idle")
        }
    }, [newUser.ruc])

    const handleCreateUser = () => {
        if (!newUser.usuario || !newUser.ruc || !newUser.password) {
            alert("Usuario, RUC y Contraseña son obligatorios.")
            return
        }

        if (rucStatus === "not_found" && !newUser.razonSocial) {
            alert("El RUC ingresado no existe en la base de datos de Contribuyentes.")
            return
        }

        fetchWithAuth(`${API_BASE_URL}/api/gerencia/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        .then(res => res.json())
        .then(data => {
            setUsuarios([...usuarios, data])
            setIsModalOpen(false)
            setNewUser({ usuario: "", correo: "", ruc: "", razonSocial: "", password: "" })
            setRucStatus("idle")
        })
        .catch(err => console.error(err))
    }

    const handleUpdateUser = () => {
        if (!editUser.usuario) {
            alert("El nombre de usuario es obligatorio.")
            return
        }

        fetchWithAuth(`${API_BASE_URL}/api/gerencia/usuarios/${editUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editUser)
        })
        .then(res => {
            if (res.ok) return res.json()
            throw new Error("Error actualizando")
        })
        .then(data => {
            setUsuarios(usuarios.map(u => u.id === editUser.id ? data : u))
            setIsEditModalOpen(false)
        })
        .catch(err => console.error(err))
    }

    const openDeleteModal = (id: number) => {
        setUserToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const executeDelete = () => {
        if (userToDelete === null) return
        fetchWithAuth(`${API_BASE_URL}/api/gerencia/usuarios/${userToDelete}`, { method: "DELETE" })
            .then(() => {
                setUsuarios(usuarios.filter(x => x.id !== userToDelete))
                setIsDeleteModalOpen(false)
                setUserToDelete(null)
            })
            .catch(err => console.error(err))
    }

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0063AE]">Gestión de Usuarios</h2>
                    <p className="text-sm text-gray-500">Administre los usuarios del sistema. Cada contribuyente puede tener uno o múltiples usuarios.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0063AE] text-white px-5 py-2.5 rounded text-sm font-extrabold shadow hover:bg-[#004d8a] transition-colors"
                >
                    + Crear Usuario
                </button>
            </div>
            
            <div className="bg-white p-6 shadow-sm rounded-lg flex-1 flex flex-col min-h-0">
                <div className="mb-6 flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Buscar por Usuario, RUC o Razón Social..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded w-[450px] text-sm text-black focus:outline-none focus:border-[#0063AE]" 
                    />
                </div>
                
                <div className="overflow-auto border border-gray-200 rounded">
                    <table className="w-full text-left text-sm text-black">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[#0063AE]">
                            <tr>
                                <th className="p-4 font-extrabold">Usuario (Login)</th>
                                <th className="p-4 font-extrabold">Correo Electrónico</th>
                                <th className="p-4 font-extrabold">RUC Asociado</th>
                                <th className="p-4 font-extrabold">Empresa (Contribuyente)</th>
                                <th className="p-4 font-extrabold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map(u => (
                                <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <td className="p-4 font-bold text-black">{u.usuario}</td>
                                    <td className="p-4 text-gray-600">{u.correo}</td>
                                    <td className="p-4 font-bold text-black">{u.ruc}</td>
                                    <td className="p-4 text-gray-600">{u.razonSocial}</td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button 
                                            className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-200 transition-colors"
                                            onClick={() => {
                                                setEditUser({ 
                                                    ...u, 
                                                    password: "",
                                                    usuario: u.usuario || "",
                                                    correo: u.correo || "",
                                                    ruc: u.ruc || "",
                                                    razonSocial: u.razonSocial || ""
                                                })
                                                setIsEditModalOpen(true)
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="bg-red-100 text-red-700 px-4 py-1.5 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                                            onClick={() => openDeleteModal(u.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsuarios.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No se encontraron usuarios que coincidan con la búsqueda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL CREAR USUARIO */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[500px]">
                        <h3 className="text-xl font-extrabold text-[#0063AE] mb-6 border-b pb-3">Nuevo Usuario</h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">RUC Asociado <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    maxLength={11}
                                    className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                    value={newUser.ruc}
                                    onChange={e => setNewUser({...newUser, ruc: e.target.value.replace(/\D/g, '')})}
                                    placeholder="Ej. 20123456789"
                                />
                                {rucStatus === "loading" && <p className="text-xs text-blue-500 mt-1">Buscando contribuyente...</p>}
                                {rucStatus === "found" && <p className="text-xs text-green-600 mt-1 font-bold">✓ Contribuyente encontrado</p>}
                                {rucStatus === "not_found" && <p className="text-xs text-red-500 mt-1 font-bold">✗ Contribuyente no registrado en BD</p>}
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Razón Social</label>
                                <input 
                                    type="text" 
                                    readOnly
                                    className="bg-gray-100 border border-gray-300 p-2 rounded w-full text-sm text-gray-600 cursor-not-allowed focus:outline-none"
                                    value={newUser.razonSocial}
                                    placeholder="Se autocompleta con el RUC..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-black mb-1 block">Usuario <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                        value={newUser.usuario}
                                        onChange={e => setNewUser({...newUser, usuario: e.target.value})}
                                        placeholder="Nombre de usuario"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-black mb-1 block">Contraseña <span className="text-red-500">*</span></label>
                                    <input 
                                        type="password" 
                                        className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                        value={newUser.password}
                                        onChange={e => setNewUser({...newUser, password: e.target.value})}
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                    value={newUser.correo}
                                    onChange={e => setNewUser({...newUser, correo: e.target.value})}
                                    placeholder="correo@empresa.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setNewUser({ usuario: "", correo: "", ruc: "", razonSocial: "", password: "" })
                                    setRucStatus("idle")
                                }}
                                className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors border border-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCreateUser}
                                className="bg-[#0063AE] text-white font-extrabold px-6 py-2 rounded text-sm shadow hover:bg-[#004d8a] transition-colors"
                            >
                                Guardar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR USUARIO */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-[500px]">
                        <h3 className="text-xl font-extrabold text-[#0063AE] mb-6 border-b pb-3">Editar Usuario</h3>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">RUC Asociado</label>
                                <input 
                                    type="text" 
                                    readOnly
                                    className="bg-gray-100 border border-gray-300 p-2 rounded w-full text-sm text-gray-600 cursor-not-allowed focus:outline-none"
                                    value={editUser.ruc}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Razón Social</label>
                                <input 
                                    type="text" 
                                    readOnly
                                    className="bg-gray-100 border border-gray-300 p-2 rounded w-full text-sm text-gray-600 cursor-not-allowed focus:outline-none"
                                    value={editUser.razonSocial}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-black mb-1 block">Usuario <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                        value={editUser.usuario}
                                        onChange={e => setEditUser({...editUser, usuario: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-black mb-1 block">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                        value={editUser.password}
                                        onChange={e => setEditUser({...editUser, password: e.target.value})}
                                        placeholder="Dejar vacía para no cambiar"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black mb-1 block">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className="border border-gray-300 p-2 rounded w-full text-sm text-black focus:outline-none focus:border-[#0063AE]"
                                    value={editUser.correo}
                                    onChange={e => setEditUser({...editUser, correo: e.target.value})}
                                />
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
                                onClick={handleUpdateUser}
                                className="bg-[#0063AE] text-white font-extrabold px-6 py-2 rounded text-sm shadow hover:bg-[#004d8a] transition-colors"
                            >
                                Actualizar Usuario
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
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Eliminar Usuario</h3>
                        <p className="text-sm text-gray-500 mb-8">
                            ¿Estás seguro que deseas eliminar permanentemente a este usuario? Esta acción no se puede deshacer y borrará sus accesos al sistema.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setUserToDelete(null)
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
