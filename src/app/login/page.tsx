"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const [tipo, setTipo] = useState("usuario")
  const [ruc, setRuc] = useState("")
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (tipo === "admin") {
      router.push("/gerenciaGeneral")
    } else {
      router.push("/dashboard")
    }
  }

  const handleRegister = () => {
    router.push("/marketing")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Barra superior */}
      <div className="h-14 bg-[#0063AE]"></div>

      {/* Contenedor */}
      <div className="flex flex-1 items-center justify-center">
        
        <div className="bg-white border border-gray-300 w-105 shadow-md">
          
          {/* Header */}
          <div className="bg-[#0063AE] text-white text-center py-3 font-semibold">
            SUNAT Operaciones en Línea
          </div>

          <div className="p-6">

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setTipo("usuario")}
                className={`px-4 py-2 font-semibold ${
                  tipo === "usuario"
                    ? "bg-[#0063AE] text-white shadow"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                USUARIO
              </button>

              <button
                onClick={() => setTipo("admin")}
                className={`px-4 py-2 font-semibold ${
                  tipo === "admin"
                    ? "bg-[#0063AE] text-white shadow"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                ADMINISTRADOR
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="RUC"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
              />

              <input
                type="text"
                placeholder="USUARIO"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
              />

              <input
                type="password"
                placeholder="CONTRASEÑA"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
              />
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-[#FF4081] text-sm">
                Guardar mis datos para la próxima sesión
              </span>

              <input type="checkbox" className="accent-[#FF4081]" />
            </div>

            {/* Textos en negro */}
            <div className="text-center mt-4 text-sm text-black">
              <p className="font-semibold">
                ¿Olvidaste tu usuario o contraseña?
              </p>

              <p className="mt-2">
                ¿No estas registrado?
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-between mt-6">
              
              <button
                onClick={handleRegister}
                className="bg-[#0063AE] text-white px-4 py-2 shadow"
              >
                Crear Cuenta
              </button>

              <button
                onClick={handleLogin}
                className="bg-[#0063AE] text-white px-4 py-2 shadow"
              >
                Iniciar Sesión
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}