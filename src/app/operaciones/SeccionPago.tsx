"use client";

import React from 'react';

export default function SeccionPago({ alFinalizar }: { alFinalizar: () => void }) {
  const npsNumber = "0003122946338";
  const fechaVencimiento = "23/05/2026";

  const manejarSalir = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans pb-10">
      {/* CABECERA SUPERIOR: Logo y Navegación*/}
      <header className="bg-white p-4 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-left">
          <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
          <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500 items-center">
            <span className="hover:text-[#0071BC] cursor-pointer">Marketing y Ventas</span>
            <span className="hover:text-[#0071BC] cursor-pointer">Logística y Almacén</span>
            <span className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1">Producción y Operaciones</span>
            
            <button 
              onClick={manejarSalir}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <span>Salir</span>
            </button>
          </nav>
        </div>
      </header>

      {/* BARRA AZUL: Ahora contiene el RUC y Nombre en blanco */}
      <div className="bg-[#0071BC] min-h-14 w-full shadow-md flex items-center px-6 py-2">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-end items-center gap-2 md:gap-8 text-white">
           <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-light opacity-80 uppercase">RUC:</span>
              <span className="text-xs md:text-sm font-bold tracking-wider">10403401272</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-light opacity-80 uppercase">Usuario:</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-tight text-center md:text-right">
                Josselyn Barrientos Zavaleta
              </span>
           </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto mt-8 px-4 text-left">
        {/* Título de la Etapa (Pantalla NPS) */}
        <div className="bg-[#28a745] text-white p-4 rounded-t-xl flex items-center gap-3 shadow-md">
          <div className="bg-white text-[#28a745] rounded-full p-1 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="font-bold text-sm md:text-lg leading-tight tracking-tight">¡Declaración presentada y pago generado con éxito!</h2>
        </div>

        <div className="bg-white shadow-2xl rounded-b-xl overflow-hidden mb-10">
          
          {/* SECCIÓN 1: CONSTANCIA NPS */}
          <div className="p-6 md:p-10 border-b bg-gray-50/50">
            <div className="text-center space-y-4">
              <span className="text-gray-500 font-bold uppercase text-[10px] md:text-xs tracking-widest">Número de Pago SUNAT (NPS)</span>
              
              <div className="text-3xl sm:text-4xl md:text-6xl font-black text-[#005999] tracking-wider select-all break-all leading-tight">
                {npsNumber}
              </div>
              
              <div className="bg-yellow-100 text-yellow-800 text-[11px] md:text-sm py-2 px-6 rounded-full inline-block font-bold border border-yellow-200 shadow-sm">
                Válido hasta el {fechaVencimiento}
              </div>
              
              <div className="max-w-md mx-auto pt-2">
                <p className="text-gray-500 text-[10px] md:text-xs leading-relaxed italic">
                  Presente este código en agencias o banca por internet de: Scotiabank, Interbank, BCP, BBVA, Banco de la Nación o agentes autorizados.
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: RESUMEN DE TRANSACCIÓN */}
          <div className="p-6 md:p-10 space-y-6">
            <h3 className="text-[#005999] font-bold border-b-2 border-blue-50 pb-2 flex items-center gap-2 text-base md:text-lg tracking-wide">
               Resumen de Transacciones
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
              <div className="flex flex-col border-l-4 border-gray-100 pl-4">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-tighter">Formulario</span>
                <span className="text-gray-700 font-bold text-base">0621 - IGV Renta Mensual</span>
              </div>
              <div className="flex flex-col border-l-4 border-gray-100 pl-4">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-tighter">Periodo</span>
                <span className="text-gray-700 font-bold text-base">2026-04</span>
              </div>
              <div className="flex flex-col border-l-4 border-gray-100 pl-4">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-tighter">N° Orden</span>
                <span className="text-gray-700 font-bold text-base tracking-widest">1011653500</span>
              </div>
              <div className="flex flex-col border-l-4 border-[#005999] pl-4 bg-blue-50/50 py-2 rounded-r-lg">
                <span className="text-[#005999] font-bold uppercase text-[10px] tracking-tighter">Monto a Pagar</span>
                <span className="text-[#005999] font-black text-2xl">S/ 20,670.50</span>
              </div>
            </div>

            {/* Acciones de Documentos */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-8">
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#005999] hover:bg-blue-600 hover:text-white p-3 rounded-xl transition-all border-2 border-[#005999] flex-1 shadow-sm active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                VER DETALLE
              </button>
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#005999] hover:bg-blue-600 hover:text-white p-3 rounded-xl transition-all border-2 border-[#005999] flex-1 shadow-sm active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                VER CONSTANCIA
              </button>
            </div>
          </div>

          {/* BOTÓN FINAL */}
          <div className="p-8 bg-gray-50 flex justify-center border-t border-gray-100">
            <button 
              onClick={alFinalizar}
              className="bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-4 px-12 md:px-20 rounded-2xl transition-all shadow-xl transform hover:scale-105 active:scale-95 text-base md:text-lg w-full md:w-auto"
            >
              Finalizar Trámite
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}