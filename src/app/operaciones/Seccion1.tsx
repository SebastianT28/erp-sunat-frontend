"use client";

import React, { useState } from 'react';

export default function Seccion1({ alSiguiente }: { alSiguiente: () => void }) {
  const [ventasGravadas, setVentasGravadas] = useState(false);
  const [ivap, setIvap] = useState(true);

  const manejarSalir = () => {
  window.location.href = "/login";
};

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans text-left">
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

      {/* BARRA AZUL*/}
      <div className="bg-[#0071BC] h-14 w-full shadow-md flex items-center px-8">
      </div>

      {/* TÍTULO DE FORMULARIO */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <h1 className="text-[#0071BC] text-xl font-bold">
          Formulario SUNAT 621 - IGV Renta Mensual
        </h1>
      </div>

      {/* CONTENEDOR DEL FORMULARIO */}
      <div className="max-w-5xl mx-auto mt-6 bg-[#f8f9fa] shadow-2xl rounded-lg overflow-hidden mb-10">
        
        {/* STEPPER */}
        <div className="bg-white p-6 border-b flex justify-around items-center text-center">
          {[
            { n: "1", t: "Información general", active: true },
            { n: "2", t: "Detalle de declaración", active: false },
            { n: "3", t: "Determinación final", active: false },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 z-10 transition-colors ${step.active ? 'bg-[#0071BC] text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step.n}
              </div>
              <span className={`text-xs md:text-sm font-medium ${step.active ? 'text-[#0071BC]' : 'text-gray-400'}`}>
                {step.t}
              </span>
              {i < 2 && <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200 -z-0"></div>}
            </div>
          ))}
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-[#0071BC] text-xl md:text-2xl font-bold mb-8 border-b-2 border-blue-100 pb-2 text-left">
            Sección I: Información general
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="flex items-center text-gray-700 font-bold mb-2">
                  Periodo tributario <span className="ml-2 text-blue-500 cursor-help text-xs">ⓘ</span>
                  <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">
                    Ingrese el mes y año (ejemplo: 03/2026).
                  </div>
                </label>
                <input type="text" placeholder="MM/AAA (ej: 03/2026)" className="w-full md:w-64 p-3 border rounded-md shadow-sm outline-none focus:border-[#0071BC] text-black opacity-70" />
              </div>

              <div className="relative group">
                <label className="flex items-center text-gray-700 font-bold mb-2">
                  Tipo de declaración <span className="ml-2 text-blue-500 cursor-help text-xs">ⓘ</span>
                  <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">
                    Elija su tipo de declaración según:
                    Original: Primera declaración presentada.
                    Sustitutoria: Presentada antes de la FV.
                    Rectificatoria: Presentada después de la FV.
                  </div>
                </label>
                <select className="w-full md:w-64 p-3 border rounded-md bg-white shadow-sm outline-none focus:border-[#0071BC] text-black opacity-60">
                  <option>Seleccione una opción</option>
                  <option>Original</option>
                  <option>Sustitutoria</option>
                  <option>Rectificatoria</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-4">Condición de IGV</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="radio" name="igv" defaultChecked className="w-4 h-4 accent-[#0071BC] cursor-pointer" />
                    <span className="text-gray-600 group-hover:text-[#0071BC]">Cuenta propia</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="radio" name="igv" className="w-4 h-4 accent-[#0071BC] cursor-pointer" />
                    <span className="text-gray-600 group-hover:text-[#0071BC]">Convenio de Estabilidad</span>
                  </label>
                </div>
              </div>
            </div>

            {/* DERECHA: Toggles */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
              <h3 className="font-bold text-gray-800 mb-6 text-lg text-left">Cuestionario de Afectación</h3>
              <div className="space-y-6">
                {[
                  { label: "¿Ventas no gravadas (últimos 12 meses)?", state: ventasGravadas, setter: setVentasGravadas },
                  { label: "¿Impuesto al Arroz Pilado (IVAP)?", state: ivap, setter: setIvap }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 pr-4">{item.label}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold w-4 text-gray-400">{item.state ? 'Sí' : 'No'}</span>
                      <div 
                        onClick={() => item.setter(!item.state)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.state ? 'bg-[#0071BC]' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${item.state ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RÉGIMENES - ICONOS Y ESPACIADO*/}
          <div className="mt-12 text-left">
            <h3 className="font-bold text-gray-800 mb-6 text-lg">Seleccione su Régimen Tributario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { n: "General", d: "Ingresos > a 1,700 UIT", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                { n: "Especial", d: "Régimen especial de renta", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { n: "MYPE Tributario", d: "Para pequeñas empresas", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
                { n: "Amazonía", d: "Régimen de la Amazonía", icon: "M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" },
                { n: "Agrario", d: "Sector agropecuario", icon: "M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" }
              ].map((reg, i) => (
                <div key={i} className="bg-white border-2 border-transparent hover:border-[#0071BC] p-4 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-lg group flex flex-col gap-9 h-29">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-gray-800 group-hover:text-[#0071BC]">{reg.n}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={reg.icon} />
                    </svg>
                  </div>
                  <p className="text-[11px] text-gray-700 font-medium leading-tight">{reg.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 w-full md:w-64">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Otros Regímenes</label>
              <select className="w-full p-2 border rounded-md bg-white shadow-sm text-sm outline-none focus:border-[#0071BC] text-gray-600">
                <option>Seleccione otros</option>
                <option>Con convenio de Estabilidad</option>
                <option>Régimen Agrario – Ley 31110</option>
                <option>Acuicultura – Ley 31666</option>
                <option>Régimen Empresa Agraria</option>
                <option>Régimen Pequeño Agrario</option>
              </select>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={alSiguiente}
              className="bg-[#0071BC] hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:scale-105 shadow-xl">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}