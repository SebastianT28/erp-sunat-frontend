"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import EmisionGRE from "./emisionGREDatos"
import ConsultaGRE from "./consultaGRE"
import BajaGRE from "./bajaGRE"
import NoConformidadGRE from "./noConformidadGRE"

export default function Logistica() {
  const router = useRouter()
  const [vistaActiva, setVistaActiva] = useState("emision")

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Logo SUNAT */}
      <div className="bg-white px-6 py-4">
        <Image
          src="/logo-sunat.png"
          alt="SUNAT Logo"
          width={160}
          height={48}
          className="object-contain"
          priority
        />
      </div>

      {/* Barra de navegación azul */}
      <div className="h-10 bg-[#0063AE] flex items-center justify-between px-6">
        <span className="text-white font-extrabold text-sm">
          Guía de remisión electrónica
        </span>
        <div className="flex gap-6">
          <button
            onClick={() => router.push("/marketing")}
            className="text-white text-xs font-bold hover:underline"
          >
            Marketing y Ventas
          </button>
          <button
            onClick={() => router.push("/logistica")}
            className="text-white text-xs font-bold hover:underline"
          >
            Logística y Almacén
          </button>
          <button
            onClick={() => router.push("/operaciones")}
            className="text-white text-xs font-bold hover:underline"
          >
            Producción y Operaciones
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-[200px] bg-white border-r border-[#0063AE] flex flex-col">

          {/* Ir al menú */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-3 text-[#0063AE] font-extrabold text-sm hover:bg-blue-50 border-b border-gray-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4081">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[#FF4081]">Ir al menú {"<"}</span>
          </button>

          {/* Opciones del sidebar */}
          <button
            onClick={() => setVistaActiva("emision")}
            className={`py-3 px-4 text-white font-extrabold text-sm text-center border-b border-blue-400 ${vistaActiva === "emision" ? "bg-[#0063AE]" : "bg-[#3388c5]"
              }`}
          >
            Emisión de GRE
          </button>

          <button
            onClick={() => setVistaActiva("consulta")}
            className={`py-3 px-4 text-white font-extrabold text-sm text-center border-b border-blue-400 ${vistaActiva === "consulta" ? "bg-[#0063AE]" : "bg-[#3388c5]"
              }`}
          >
            Consulta de GRE
          </button>

          <button
            onClick={() => setVistaActiva("baja")}
            className={`py-3 px-4 text-white font-extrabold text-sm text-center border-b border-blue-400 ${vistaActiva === "baja" ? "bg-[#0063AE]" : "bg-[#3388c5]"
              }`}
          >
            Baja de GRE
          </button>

          <button
            onClick={() => setVistaActiva("noConformidad")}
            className={`py-3 px-4 text-white font-extrabold text-sm text-center border-b border-blue-400 ${vistaActiva === "noConformidad" ? "bg-[#0063AE]" : "bg-[#3388c5]"
              }`}
          >
            No conformidad de GRE
          </button>
        </div>

        {/* Contenido dinámico */}
        <div className="flex-1 p-6">
          {vistaActiva === "emision" && <EmisionGRE />}
          {vistaActiva === "consulta" && <ConsultaGRE />}
          {vistaActiva === "baja" && <BajaGRE />}
          {vistaActiva === "noConformidad" && <NoConformidadGRE />}
        </div>

      </div>
    </div>
  )
}
