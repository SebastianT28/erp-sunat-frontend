"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
  const router = useRouter()

  const [tipo, setTipo] = useState("usuario")
  const [ruc, setRuc] = useState("")
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [guardarDatos, setGuardarDatos] = useState(false)

  const handleLogin = () => {
    // IMPORTANTE: Verifica que estas carpetas existan en src/app/
    if (tipo === "admin") {
      router.push("/gerenciaGeneral")
    } else {
      router.push("/dashboard")
    }
  }

  const handleRegister = () => {
    // Si tu modulo se llama logistica, cambia "/marketing" por "/logistica"
    router.push("/marketing")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <div className="h-14 bg-[#0063AE]"></div>

      {/* Logo debajo de la barra */}
      <div className="bg-white px-6 py-3">
        <Image
          src="/logo-sunat.png"
          alt="SUNAT Logo"
          width={140}
          height={40}
          className="object-contain"
          priority
        />
      </div>

      {/* Contenedor Central */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white border border-gray-300 w-[520px] shadow-md mx-auto">
          
          {/* Header azul */}
          <div className="bg-[#0063AE] text-white text-center py-4 font-extrabold text-lg">
            SUNAT Operaciones en Línea
          </div>

          <div className="p-8">
            {/* Tabs Usuario/Admin */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setTipo("usuario")}
                className={`px-5 py-2.5 font-extrabold ${
                  tipo === "usuario"
                    ? "bg-[#0063AE] text-white shadow"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                USUARIO
              </button>

              <button
                type="button"
                onClick={() => setTipo("admin")}
                className={`px-5 py-2.5 font-extrabold ${
                  tipo === "admin"
                    ? "bg-[#0063AE] text-white shadow"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                ADMINISTRADOR
              </button>
            </div>

            {/* Formulario */}
            <div className="flex flex-col gap-5">
              {tipo === "usuario" && (
                <input
                  type="text"
                  placeholder="RUC"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
                />
              )}

              <input
                type="text"
                placeholder="USUARIO"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
              />

              <input
                type="password"
                placeholder="CONTRASEÑA"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-4 py-3 text-black placeholder-black/40 focus:outline-none focus:border-[#0063AE]"
              />
            </div>

            {/* Checkbox Guardar Datos */}
            <div className="flex items-center justify-between mt-5">
              <span className="text-[#FF4081] text-sm font-extrabold">
                Guardar mis datos para la próxima sesión
              </span>

              <button
                type="button"
                onClick={() => setGuardarDatos(!guardarDatos)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  guardarDatos ? "bg-[#FF4081]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow ${
                    guardarDatos ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Olvido contraseña */}
            <div className="text-center mt-5 text-sm text-black">
              <p className="font-extrabold cursor-pointer hover:underline">
                ¿Olvidaste tu usuario o contraseña?
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between mt-8 items-end">
              <div className="flex flex-col items-center">
                <p className="text-sm text-black mb-2 font-extrabold">
                  ¿No estás registrado?
                </p>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="bg-[#0063AE] text-white px-5 py-2.5 shadow font-extrabold"
                >
                  Crear Cuenta
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                className="bg-[#0063AE] text-white px-5 py-2.5 shadow font-extrabold"
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