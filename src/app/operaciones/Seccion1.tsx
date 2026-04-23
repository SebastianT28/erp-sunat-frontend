"use client";

import React, { useState } from 'react';

export default function Seccion1() {
  const [ventasGravadas, setVentasGravadas] = useState(false);
  const [ivap, setIvap] = useState(true);

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans">
      {/* CABECERA SUPERIOR: Logo y Navegación (Responsive) */}
      <header className="bg-white p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
          <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500">
            <span className="hover:text-[#0071BC] cursor-pointer">Marketing y Ventas</span>
            <span className="hover:text-[#0071BC] cursor-pointer">Logística y Almacén</span>
            <span className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1">Producción y Operaciones</span>
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
        <div className="bg-white p-6 border-b flex justify-around items-center">
          {[
            { n: "1", t: "Información general", active: true },
            { n: "2", t: "Detalle de declaración", active: false },
            { n: "3", t: "Determinación final", active: false },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 z-10 transition-colors ${step.active ? 'bg-[#0071BC] text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step.n}
              </div>
              <span className={`text-xs md:text-sm font-medium text-center ${step.active ? 'text-[#0071BC]' : 'text-gray-400'}`}>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="flex items-center text-gray-700 font-bold mb-2">
                  Periodo tributario <span className="ml-2 text-gray-400 cursor-help text-xs">ⓘ</span>
                  <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">
                    Ingrese el mes y año (ejemplo: 03/2026).
                  </div>
                </label>
                <input type="text" placeholder="MM/AAA (ej: 03/2026)" className="w-full md:w-64 p-3 border rounded-md shadow-sm outline-none focus:border-[#0071BC] text-black opacity-70" />
              </div>

              <div className="relative group">
                <label className="flex items-center text-gray-700 font-bold mb-2">
                  Tipo de declaración <span className="ml-2 text-gray-400 cursor-help text-xs">ⓘ</span>
                  <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">
                    Original o Rectificatoria.
                  </div>
                </label>
                <select className="w-full md:w-64 p-3 border rounded-md bg-white shadow-sm outline-none focus:border-[#0071BC] text-black opacity-60">
                  <option>Seleccione una opción</option>
                  <option>Original</option>
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
              <h3 className="font-bold text-gray-800 mb-6 text-lg">Cuestionario de Afectación</h3>
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

          {/* RÉGIMENES */}
          <div className="mt-12 text-left">
            <h3 className="font-bold text-gray-800 mb-6 text-lg">Seleccione su Régimen Tributario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { n: "General", d: "Ingresos > 1,700 UIT" },
                { n: "Especial", d: "Régimen especial" },
                { n: "MYPE Tributario", d: "Pequeñas empresas" },
                { n: "Amazonía", d: "Reg. Amazonía" },
                { n: "Agrario", d: "Sector agro" }
              ].map((reg, i) => (
                <div key={i} className="bg-white border-2 border-transparent hover:border-[#0071BC] p-4 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-lg group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-gray-800 group-hover:text-[#0071BC]">{reg.n}</span>
                    <span className="text-xl">🏢</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">{reg.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 w-full md:w-64">
              <label className="block text-xs font-bold text-gray-500 mb-2">OTROS REGÍMENES</label>
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
            <button className="bg-[#0071BC] hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg transition-all transform hover:scale-105 shadow-xl">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}