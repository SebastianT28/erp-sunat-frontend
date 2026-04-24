"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function Seccion2({ alAnterior, alSiguiente }: { alAnterior: () => void, alSiguiente: () => void }) {
  const [tab, setTab] = useState('IGV');
  const [suspension, setSuspension] = useState(false);
  const [pdt625, setPdt625] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ESTADOS INDEPENDIENTES
  const [datosIGV, setDatosIGV] = useState({
    c100: '', c101: '', c107: '', c108: '', c131: '', c178: ''
  });

  const [datosRenta, setDatosRenta] = useState({
    c380: '', c315: '', c312: '', c301: '', numRes: '', fechaMod: '', coefSunat: ''
  });

  const manejarSalir = () => {
  window.location.href = "/login";
};

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans">
      {/* CABECERA SUPERIOR */}
      <header className="bg-white p-4 border-b">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    
    <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
    
    {/* Menú de Navegación */}
    <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500 items-center">
  <Link href="/marketing" className="hover:text-[#0071BC] cursor-pointer">
    Marketing y Ventas
  </Link>
  
  <Link href="/logistica" className="hover:text-[#0071BC] cursor-pointer">
    Logística y Almacén
  </Link>
  
  <Link href="/operaciones" className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1">
    Producción y Operaciones
  </Link>
  
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

      <div className="max-w-5xl mx-auto px-4 mt-6 text-left">
        <h1 className="text-[#0071BC] text-xl font-bold">Formulario SUNAT 621 - IGV Renta Mensual</h1>
      </div>

      <div className="max-w-5xl mx-auto mt-6 bg-[#f8f9fa] shadow-2xl rounded-lg overflow-hidden mb-10 text-left">
        
        {/* STEPPER */}
        <div className="bg-white p-6 border-b flex justify-around items-center text-center">
          {[
            { n: "1", t: "Información general", active: false },
            { n: "2", t: "Detalle de declaración", active: true },
            { n: "3", t: "Determinación final", active: false },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 z-10 ${step.active ? 'bg-[#0071BC] text-white' : 'bg-gray-300 text-gray-600'}`}>{step.n}</div>
              <span className={`text-xs md:text-sm font-medium text-center ${step.active ? 'text-[#0071BC]' : 'text-gray-400'}`}>{step.t}</span>
              {i < 2 && <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200 -z-0"></div>}
            </div>
          ))}
        </div>

        <div className="p-6 md:p-10">
          <h2 className="text-[#0071BC] text-xl md:text-2xl font-bold mb-8 border-b-2 border-blue-100 pb-2">Sección II: Detalle de declaración</h2>

          {/* GRID SUPERIOR: EXCEL Y TIPO DE CAMBIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#005a96] border-2 border-dashed border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg group transition-all text-left">
              <div className="bg-white/10 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-8l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Arrastre su archivo Excel aquí</h3>
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" />
              <p className="text-[10px] text-blue-100 opacity-80 mb-4 px-4">O haga clic y seleccione el archivo .xlsx con las columnas: Casilla, Concepto, Valor</p>
              <button onClick={() => fileInputRef.current?.click()} className="bg-white text-[#005a96] font-bold text-xs py-2 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-md">Seleccionar archivo</button>
            </div>
            
            {/* TIPO DE CAMBIO CON ICONO SVG ORIGINAL */}
            <div className="bg-[#f0f7ff] p-6 rounded-2xl border border-[#d1e6ff] shadow-sm relative text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#0071BC] p-2 rounded-lg shadow-sm text-center flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#003e6b] text-lg text-left">Tipo de Cambio</h3>
              </div>
              <p className="text-[#0071BC] text-sm font-medium mb-4 text-left">Vigente: 21 Abr 2026</p>
              <div className="relative">
                <label className="text-[#003e6b] text-xs font-bold block mb-2 text-left">S/ por USD</label>
                <input type="number" step="0.001" defaultValue="3.75" className="w-full p-3 bg-white border-2 border-[#0071BC] rounded-xl text-black font-bold text-xl outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-inner" />
              </div>
              <p className="mt-3 text-[#0071BC] text-[10px] font-medium italic text-left">Fuente: SBS - Puede editar manualmente</p>
            </div>
          </div>

          {/* SUB-TABS */}
          <div className="flex space-x-4 mb-6 border-b text-left">
            {['IGV', 'RENTA'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`pb-2 px-4 font-bold text-base transition-all ${tab === t ? 'text-[#0071BC] border-b-4 border-[#0071BC]' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
            ))}
          </div>

          <div className="text-left overflow-hidden">
            {tab === 'IGV' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* VENTAS */}
                <div>
                  <h4 className="font-bold text-gray-500 mb-4 border-b pb-1 text-base">Ventas Netas</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                      <tr><th className="p-3 text-left">Casilla</th><th className="p-3 text-left">Concepto</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">100</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Ventas netas gravadas (Base imponible)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c100} onChange={(e) => setDatosIGV({...datosIGV, c100: e.target.value})} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><div className="flex items-center justify-center space-x-1"><span className="h-3 w-3 rounded-full bg-green-500"></span><span className="text-green-600 font-bold text-xs whitespace-nowrap">Válido</span></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">101</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Ventas netas gravadas (Tributo)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c101} onChange={(e) => setDatosIGV({...datosIGV, c101: e.target.value})} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><div className="flex items-center justify-center space-x-1"><span className="h-3 w-3 rounded-full bg-green-500"></span><span className="text-green-600 font-bold text-xs whitespace-nowrap">Válido</span></div></td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t-2">
                        <td className="p-3 text-[#0071BC]">131</td>
                        <td className="p-3 text-gray-700 uppercase">TOTAL VENTAS:</td>
                        <td className="p-3"><input type="text" value={datosIGV.c131} onChange={(e) => setDatosIGV({...datosIGV, c131: e.target.value})} className="w-full border-2 border-[#0071BC] p-2 rounded-lg text-right bg-white text-black font-extrabold outline-none" placeholder="0" /></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* COMPRAS */}
                <div>
                  <h4 className="font-bold text-gray-500 mb-4 border-b pb-1 text-base">Compras Netas</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                      <tr><th className="p-3 text-left">Casilla</th><th className="p-3 text-left">Concepto</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">107</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Compras netas (Base imponible)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c107} onChange={(e) => setDatosIGV({...datosIGV, c107: e.target.value})} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><div className="flex items-center justify-center space-x-1"><span className="h-3 w-3 rounded-full bg-green-500"></span><span className="text-green-600 font-bold text-xs whitespace-nowrap">Válido</span></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">108</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Compras netas gravadas (Tributo)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c108} onChange={(e) => setDatosIGV({...datosIGV, c108: e.target.value})} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><div className="flex items-center justify-center space-x-1"><span className="h-3 w-3 rounded-full bg-red-500"></span><span className="text-red-600 font-bold text-xs whitespace-nowrap">Diferencia</span></div></td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t-2">
                        <td className="p-3 text-[#0071BC]">178</td>
                        <td className="p-3 text-gray-700 uppercase">TOTAL COMPRAS:</td>
                        <td className="p-3"><input type="text" value={datosIGV.c178} onChange={(e) => setDatosIGV({...datosIGV, c178: e.target.value})} className="w-full border-2 border-[#0071BC] p-2 rounded-lg text-right bg-white text-black font-extrabold outline-none" placeholder="0" /></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* RENTA*/
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  {/* PREGUNTAS IZQUIERDA*/}
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-700">¿Posee alguna suspensión de pagos o cuenta?</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-gray-400">{suspension ? 'Sí' : 'No'}</span>
                      <div onClick={() => setSuspension(!suspension)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${suspension ? 'bg-[#0071BC]' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${suspension ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-700 leading-tight">¿Presentó un formulario PDT 625 actualizado?</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-gray-400">{pdt625 ? 'Sí' : 'No'}</span>
                      <div onClick={() => setPdt625(!pdt625)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${pdt625 ? 'bg-[#0071BC]' : 'bg-gray-400'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${pdt625 ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-sm font-bold text-gray-700 block mb-2 text-left">Número de Res Int: <span className="text-[#0071BC] cursor-help">ⓘ</span>
                      <div className="absolute left-32 bottom-full mb-2 hidden group-hover:block w-40 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">Ingrese el número de resolución de intendencia.</div>
                    </label>
                    <input type="text" value={datosRenta.numRes} onChange={(e) => setDatosRenta({...datosRenta, numRes: e.target.value})} className="w-full border-2 border-gray-400 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC]" placeholder="Ingrese número" />
                  </div>

                  <div className="relative group">
                    <label className="text-sm font-bold text-gray-700 block mb-2 text-left">Fecha de modificación: <span className="text-[#0071BC] cursor-help">ⓘ</span>
                      <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-40 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">DD/MM/AAAA (ej: 12/03/2026).</div>
                    </label>
                    <input type="text" value={datosRenta.fechaMod} onChange={(e) => setDatosRenta({...datosRenta, fechaMod: e.target.value})} className="w-full border-2 border-gray-400 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC]" placeholder="DD/MM/AAAA" />
                  </div>

                  <div className="relative group">
                    <label className="text-sm font-bold text-gray-700 block mb-2 text-left">Coeficiente SUNAT: <span className="text-[#0071BC] cursor-help">ⓘ</span></label>
                    <input type="text" value={datosRenta.coefSunat} onChange={(e) => setDatosRenta({...datosRenta, coefSunat: e.target.value})} className="w-full border-2 border-gray-400 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0.0000" />
                  </div>
                </div>

                {/* TABLA DERECHA RENTA */}
                <div>
                  <h4 className="font-bold text-gray-500 border-b pb-1 text-base italic mb-4">Estado de Ganancia y Pérdida</h4>
                  <table className="w-full text-sm font-bold">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                      <tr><th className="p-3 text-left">Casilla</th><th className="p-3 text-left">Concepto</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        {c: "380", t: "Coeficiente - Artículo 85", v: datosRenta.c380, k: "c380", e: true},
                        {c: "315", t: "Porcentaje – Artículo 85°", v: datosRenta.c315, k: "c315", e: true},
                        {c: "312", t: "Ingresos netos (Tributo)", v: datosRenta.c312, k: "c312", e: false},
                        {c: "301", t: "Ingresos Netos (Base imponible)", v: datosRenta.c301, k: "c301", e: false}
                      ].map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-[#0071BC]">{row.c}</td><td className="p-3 text-gray-700 leading-tight">{row.t}</td>
                          <td className="p-3"><input type="text" value={row.v} onChange={(e) => setDatosRenta({...datosRenta, [row.k]: e.target.value})} className="w-full border-2 border-gray-300 p-2 rounded-lg text-right text-black font-bold outline-none" placeholder="0" /></td>
                          <td className="p-3 text-center">{row.e && <div className="flex items-center justify-center space-x-1"><span className="h-3 w-3 rounded-full bg-green-500"></span><span className="text-green-600 font-bold text-xs whitespace-nowrap">Válido</span></div>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="mt-12 flex justify-center space-x-6">
            <button onClick={alAnterior} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md active:scale-95">Anterior</button>
            <button onClick={alSiguiente} className="bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}