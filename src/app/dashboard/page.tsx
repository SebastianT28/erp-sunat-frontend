"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Dashboard() {
  const router = useRouter()
  const [tooltipGRE, setTooltipGRE] = useState(false)
  const [tooltipImpuestos, setTooltipImpuestos] = useState(false)

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

      {/* Barra azul */}
      <div className="h-10 bg-[#0063AE]"></div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-start justify-center pt-12 px-4">

        <div className="border-2 border-[#0063AE] w-[900px]">

          {/* Header del panel */}
          <div className="bg-[#0063AE] text-white text-center py-3 font-extrabold text-lg">
            ¿Que tipo de operacion desea realizar?
          </div>

          {/* Cards */}
          <div className="bg-white p-8">
            <div className="flex justify-center gap-10">

              {/* Card 1: Emisión de guías de Remisión */}
              <div className="flex flex-col items-center w-[360px]">
                <div className="flex w-full h-[180px] overflow-hidden">
                  {/* Franja azul izquierda */}
                  <div className="w-[50px] bg-[#0063AE] flex-shrink-0"></div>
                  {/* Icono central */}
                  <div className="flex-1 bg-white flex items-center justify-center py-3">
                    <Image
                      src="/icon-gre.png"
                      alt="Emisión de guías de Remisión"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  {/* Franja azul derecha */}
                  <div className="w-[50px] bg-[#0063AE] flex-shrink-0"></div>
                </div>

                {/* Nombre */}
                <div className="bg-[#0063AE] text-white text-center py-2 w-full font-extrabold text-sm">
                  Emisión de guías de Remisión
                </div>

                {/* ¿Qué es? y Continuar */}
                <div className="flex items-center justify-between w-full mt-3 px-1">
                  <div className="relative">
                    <span
                      className="text-[#FF4081] text-sm font-extrabold cursor-pointer hover:underline"
                      onMouseEnter={() => setTooltipGRE(true)}
                      onMouseLeave={() => setTooltipGRE(false)}
                    >
                      ¿Qué es?
                    </span>
                    {tooltipGRE && (
                      <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-[#FF4081] text-white text-xs p-3 rounded shadow-lg z-50 leading-relaxed">
                        La emisión de guías de remisión es el proceso de generar un documento que autoriza y respalda el traslado de bienes de un lugar a otro
                        <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#FF4081]"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => router.push("/logistica")}
                    className="bg-[#0063AE] text-white px-5 py-1.5 font-extrabold text-sm shadow hover:bg-[#004d8a] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>

              {/* Card 2: Declaración mensual de impuestos */}
              <div className="flex flex-col items-center w-[360px]">
                <div className="flex w-full h-[180px] overflow-hidden">
                  {/* Franja azul izquierda */}
                  <div className="w-[50px] bg-[#0063AE] flex-shrink-0"></div>
                  {/* Icono central */}
                  <div className="flex-1 bg-white flex items-center justify-center py-3">
                    <Image
                      src="/icon-impuestos.png"
                      alt="Declaracion mensual de impuestos"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  {/* Franja azul derecha */}
                  <div className="w-[50px] bg-[#0063AE] flex-shrink-0"></div>
                </div>

                {/* Nombre */}
                <div className="bg-[#0063AE] text-white text-center py-2 w-full font-extrabold text-sm">
                  Declaracion mensual de impuestos
                </div>

                {/* ¿Qué es? y Continuar */}
                <div className="flex items-center justify-between w-full mt-3 px-1">
                  <div className="relative">
                    <span
                      className="text-[#FF4081] text-sm font-extrabold cursor-pointer hover:underline"
                      onMouseEnter={() => setTooltipImpuestos(true)}
                      onMouseLeave={() => setTooltipImpuestos(false)}
                    >
                      ¿Qué es?
                    </span>
                    {tooltipImpuestos && (
                      <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-[#FF4081] text-white text-xs p-3 rounded shadow-lg z-50 leading-relaxed">
                        La declaración mensual de impuestos es el proceso mediante el cual una empresa o persona informa a la administración tributaria (SUNAT) sobre sus ingresos, ventas y tributos generados en un mes
                        <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#FF4081]"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => router.push("/operaciones")}
                    className="bg-[#0063AE] text-white px-5 py-1.5 font-extrabold text-sm shadow hover:bg-[#004d8a] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>

            </div>

            {/* Botón Volver a inicio */}
            <div className="mt-8">
              <button
                onClick={() => router.push("/login")}
                className="bg-gray-400 text-white px-6 py-2 font-extrabold text-sm shadow transition-colors duration-200 hover:bg-[#0063AE]"
              >
                Volver a inicio
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}