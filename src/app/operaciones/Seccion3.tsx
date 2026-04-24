"use client";

import React, { useState } from 'react';

export default function Seccion3({ alAnterior, alPago }: { alAnterior: () => void, alPago: () => void }) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    saldos: true, // Saldos y Créditos abierto por defecto
    intereses: false,
    retenciones: true, // Retenciones abierto por defecto
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const manejarSalir = () => {
  window.location.href = "/login";
};

  const textGray = "text-[#6c757d]";

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans text-left">
      {/* CABECERA SUNAT */}
<header className="bg-white p-4 border-b">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    
    <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
    
    {/* Menú de Navegación */}
    <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500 items-center">
      <span className="hover:text-[#0071BC] cursor-pointer">Marketing y Ventas</span>
      <span className="hover:text-[#0071BC] cursor-pointer">Logística y Almacén</span>
      <span className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1">Producción y Operaciones</span>
      
      {/* Botón Salir */}
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

      <div className="bg-[#0071BC] h-14 w-full shadow-md flex items-center px-8"></div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <h1 className="text-[#0071BC] text-xl font-bold text-left">
          Formulario SUNAT 621 - IGV Renta Mensual
        </h1>
      </div>

      <div className="max-w-5xl mx-auto mt-6 bg-[#f8f9fa] shadow-2xl rounded-lg overflow-hidden mb-10">
        
        {/* STEPPER */}
        <div className="bg-white p-6 border-b flex justify-around items-center text-center">
          {[
            { n: "1", t: "Información general", active: false },
            { n: "2", t: "Detalle de declaración", active: false },
            { n: "3", t: "Determinación final", active: true },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 z-10 ${step.active ? 'bg-[#0071BC] text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step.n}
              </div>
              <span className={`text-[10px] md:text-sm font-medium px-1 leading-tight ${step.active ? 'text-[#0071BC]' : 'text-gray-500'}`}>
                {step.t}
              </span>
              {i < 2 && <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200 -z-0"></div>}
            </div>
          ))}
        </div>

        <div className="p-4 md:p-10">
          <h2 className="text-[#0071BC] text-xl md:text-2xl font-bold mb-8 border-b-2 border-blue-100 pb-2">Sección III: Determinación de la Deuda</h2>

          <div className="space-y-4">
            
            {/*DETALLE DEL CÁLCULO */}
            <h3 className="text-[#6c757d] font-bold text-lg mt-4">Detalle del cálculo</h3>

            {/*SALDOS Y CRÉDITOS */}
            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleSection('saldos')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b"
              >
                <span className="font-bold text-[#0071BC] text-base">Saldos y créditos</span>
                <span className="text-[#0071BC] font-bold text-xs">{openSections.saldos ? '▲' : '▼'}</span>
              </button>
              {openSections.saldos && (
                <div className="p-4 space-y-2">
                   {[
                    { c: "140", t: "IGV Resultante", v: "15420.5" },
                    { c: "145", t: "Saldo a Favor del Periodo Anterior (IGV)", v: "2300" },
                    { c: "302", t: "Impuesto a la Renta", v: "8750" },
                    { c: "303", t: "Saldo a Favor del Periodo Anterior (Renta)", v: "1200" }
                  ].map((item) => (
                    <div key={item.c} className="flex justify-between items-center text-sm border-b py-2">
                      <span className={`${textGray} font-medium`}><span className="font-bold text-[#0071BC] mr-2">{item.c}</span> {item.t}</span>
                      <span className="font-bold text-gray-800">S/ {item.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*INTERESES MORATORIOS Y PAGOS PREVIOS */}
            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleSection('intereses')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b"
              >
                <span className="font-bold text-gray-800 text-base">Intereses moratorios y pagos previos</span>
                <span className="text-gray-400 font-bold text-xs">{openSections.intereses ? '▲' : '▼'}</span>
              </button>
              {openSections.intereses && (
                <div className="p-4 space-y-2">
                   {[
                    { c: "187", t: "Interés Moratorio IGV", v: "0" },
                    { c: "319", t: "Interés Moratorio Renta", v: "0" },
                    { c: "185", t: "Pagos Previos del Periodo (IGV)", v: "0" },
                    { c: "317", t: "Pagos Previos del Periodo (Renta)", v: "0" }
                  ].map((item) => (
                    <div key={item.c} className="flex justify-between items-center text-sm border-b py-2">
                      <span className={`${textGray} font-medium`}><span className="font-bold text-[#0071BC] mr-2">{item.c}</span> {item.t}</span>
                      <span className="font-bold text-gray-800">S/ {item.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*RETENCIONES Y PERCEPCIONES */}
            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleSection('retenciones')}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b"
              >
                <span className="font-bold text-gray-800 text-base">Retenciones y Percepciones</span>
                <span className="text-gray-400 font-bold text-xs">{openSections.retenciones ? '▲' : '▼'}</span>
              </button>
              {openSections.retenciones && (
                <div className="p-8 text-center space-y-5 bg-white">
                  <p className={`${textGray} text-sm font-bold italic leading-relaxed`}>
                    "Retenciones detectadas en el archivo de carga. Generando registros estructurados..."
                  </p>
                  <button className="inline-flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95">
                    ⬇ Descargar Archivo Plano SUNAT (.txt)
                  </button>
                </div>
              )}
            </div>

            {/*RESUMEN DE OBLIGACIONES */}
            <h3 className="text-[#6c757d] font-bold text-lg mt-8">Resumen de obligaciones</h3>

            {/* 4. TOTAL DEUDA TRIBUTARIA (TARJETA AZUL SUNAT) */}
            <div className="mt-2 bg-[#005999] text-white rounded-xl p-8 shadow-xl border border-[#004a80]">
              <div className="text-center mb-6">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] opacity-90 uppercase">Total Deuda Tributaria</span>
                <div className="text-4xl md:text-6xl font-bold mt-2">
                  <span className="text-2xl md:text-4xl opacity-80 mr-2 font-light">S/</span>
                  20,670.50
                </div>
              </div>

              <div className="w-full h-px bg-white/30 my-6"></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center border-r border-white/20">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">IGV</span>
                  <div className="text-lg md:text-2xl font-bold mt-1">S/ 13,120.50</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Renta</span>
                  <div className="text-lg md:text-2xl font-bold mt-1">S/ 7,550.00</div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
            <button 
              onClick={alAnterior} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              Anterior
            </button>
            <button 
              onClick={alPago} 
              className="bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <span>Continuar con el pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}