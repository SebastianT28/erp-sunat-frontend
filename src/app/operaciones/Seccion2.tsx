"use client";

import React, { useState } from 'react';
import Link from "next/link";
import * as XLSX from 'xlsx';

export default function Seccion2({ alAnterior, alSiguiente, datos, actualizarDatos }: { alAnterior: () => void, alSiguiente: () => void, datos: any, actualizarDatos: (d: any) => void }) {
  const [tab, setTab] = useState('IGV');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [datosIGV, setDatosIGV] = useState({
    c100: '', c101: '', c107: '', c108: '', c131: '', c178: ''
  });

  const [datosRenta, setDatosRenta] = useState({
    c380: '', c315: '', c312: '', c301: ''
  });

  const [validez, setValidez] = useState({
    c101: true,
    c108: true
  });

  const manejarSalir = () => {
    window.location.href = "/login";
  };

  const procesarExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const nuevosIgv = { ...datosIGV };
      const nuevosRenta = { ...datosRenta };

      data.forEach((row: any) => {
        const casillaStr = String(row.Casilla || row.casilla || '').trim();
        const valor = String(row.Valor || row.valor || '').trim();

        if (casillaStr === '100') nuevosIgv.c100 = valor;
        if (casillaStr === '101') nuevosIgv.c101 = valor;
        if (casillaStr === '107') nuevosIgv.c107 = valor;
        if (casillaStr === '108') nuevosIgv.c108 = valor;
        if (casillaStr === '131') nuevosIgv.c131 = valor;
        if (casillaStr === '178') nuevosIgv.c178 = valor;
        
        if (casillaStr === '380') nuevosRenta.c380 = valor;
        if (casillaStr === '315') nuevosRenta.c315 = valor;
        if (casillaStr === '312') nuevosRenta.c312 = valor;
        if (casillaStr === '301') nuevosRenta.c301 = valor;
      });

      // Cálculo Automático y Validación (Semáforo)
      const base100 = parseFloat(nuevosIgv.c100) || 0;
      const base107 = parseFloat(nuevosIgv.c107) || 0;
      const calc101 = Math.round(base100 * 0.18 * 100) / 100;
      const calc108 = Math.round(base107 * 0.18 * 100) / 100;

      const excel101 = parseFloat(nuevosIgv.c101) || 0;
      const excel108 = parseFloat(nuevosIgv.c108) || 0;

      // Calcular totales automáticamente
      nuevosIgv.c131 = nuevosIgv.c101;
      nuevosIgv.c178 = nuevosIgv.c108;

      setValidez({
        c101: Math.abs(calc101 - excel101) < 0.1, // Tolerancia por redondeo
        c108: Math.abs(calc108 - excel108) < 0.1
      });

      setDatosIGV(nuevosIgv);
      setDatosRenta(nuevosRenta);

      // Limpiar input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const isEspecial = datos.regimenTributario === 'Especial';
  const isMype = datos.regimenTributario === 'MYPE Tributario';
  const isGeneral = datos.regimenTributario === 'General';

  // Forzar valores según régimen
  let current315 = datosRenta.c315;
  let current380 = datosRenta.c380;
  
  if (isEspecial) {
    current315 = '1.5';
    current380 = '';
  } else if (isMype) {
    current315 = '1.0';
  } else if (isGeneral) {
    current315 = '1.5';
  }

  // Calcular 312 dinámicamente
  let calc312 = '0.00';
  if (!datos.suspensionPagos) {
    const v301 = parseFloat(datosRenta.c301) || 0;
    const v380 = parseFloat(current380) || 0;
    const v315 = parseFloat(current315) || 0;
    const factor = Math.max(v380, v315 / 100);
    calc312 = (Math.round(v301 * factor * 100) / 100).toFixed(2);
  }

  const handleSiguiente = () => {
    const casillasArray = [
      { numeroCasilla: "100", valor: Number(datosIGV.c100) || 0 },
      { numeroCasilla: "101", valor: Number(datosIGV.c101) || 0 },
      { numeroCasilla: "107", valor: Number(datosIGV.c107) || 0 },
      { numeroCasilla: "108", valor: Number(datosIGV.c108) || 0 },
      { numeroCasilla: "131", valor: Number(datosIGV.c131) || 0 },
      { numeroCasilla: "178", valor: Number(datosIGV.c178) || 0 },
      { numeroCasilla: "380", valor: Number(current380) || 0 },
      { numeroCasilla: "315", valor: Number(current315) || 0 },
      { numeroCasilla: "312", valor: Number(calc312) || 0 },
      { numeroCasilla: "301", valor: Number(datosRenta.c301) || 0 }
    ];
    actualizarDatos({ casillas: casillasArray });
    alSiguiente();
  };

  const RenderSemaforo = ({ esValido }: { esValido: boolean }) => (
    <div className="flex items-center justify-center space-x-1">
      <span className={`h-3 w-3 rounded-full ${esValido ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <span className={`font-bold text-xs whitespace-nowrap ${esValido ? 'text-green-600' : 'text-red-600'}`}>
        {esValido ? 'Válido' : 'Diferencia'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans">
      <header className="bg-white p-4 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
          <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500 items-center">
            <Link href="/marketing" className="hover:text-[#0071BC] cursor-pointer">Marketing y Ventas</Link>
            <Link href="/logistica" className="hover:text-[#0071BC] cursor-pointer">Logística y Almacén</Link>
            <Link href="/operaciones" className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1">Producción y Operaciones</Link>
            <button onClick={manejarSalir} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100 group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#005a96] border-2 border-dashed border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg group transition-all text-left">
              <div className="bg-white/10 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-8l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Arrastre su archivo Excel aquí</h3>
              <input type="file" ref={fileInputRef} onChange={procesarExcel} className="hidden" accept=".xlsx, .xls" />
              <p className="text-[10px] text-blue-100 opacity-80 mb-4 px-4">O haga clic y seleccione el archivo .xlsx con las columnas: Casilla, Concepto, Valor</p>
              <button onClick={() => fileInputRef.current?.click()} className="bg-white text-[#005a96] font-bold text-xs py-2 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-md">Seleccionar archivo</button>
            </div>
            
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
                <input type="number" step="0.001" value={datos.tipoCambio} onChange={(e) => actualizarDatos({tipoCambio: parseFloat(e.target.value)})} className="w-full p-3 bg-white border-2 border-[#0071BC] rounded-xl text-black font-bold text-xl outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-inner" />
              </div>
              <p className="mt-3 text-[#0071BC] text-[10px] font-medium italic text-left">Fuente: SBS - Puede editar manualmente</p>
            </div>
          </div>

          <div className="flex space-x-4 mb-6 border-b text-left">
            {['IGV', 'RENTA'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`pb-2 px-4 font-bold text-base transition-all ${tab === t ? 'text-[#0071BC] border-b-4 border-[#0071BC]' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
            ))}
          </div>

          <div className="text-left overflow-hidden">
            {tab === 'IGV' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                        <td className="p-3 text-center"><RenderSemaforo esValido={true} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">101</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Ventas netas gravadas (Tributo)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c101} onChange={(e) => {
                          const val = e.target.value;
                          setDatosIGV({...datosIGV, c101: val, c131: val});
                          // Re-validar si lo edita a mano
                          const calc = Math.round((parseFloat(datosIGV.c100) || 0) * 0.18 * 100) / 100;
                          setValidez(prev => ({...prev, c101: Math.abs(calc - parseFloat(val)) < 0.1}));
                        }} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><RenderSemaforo esValido={validez.c101} /></td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t-2">
                        <td className="p-3 text-[#0071BC]">131</td>
                        <td className="p-3 text-gray-700 uppercase">TOTAL VENTAS:</td>
                        <td className="p-3"><input type="text" value={datosIGV.c131} readOnly className="w-full border-2 border-[#0071BC] p-2 rounded-lg text-right bg-gray-100 text-black font-extrabold outline-none cursor-not-allowed" placeholder="0" /></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

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
                        <td className="p-3 text-center"><RenderSemaforo esValido={true} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC] font-bold">108</td>
                        <td className="p-3 text-gray-700 leading-tight text-black opacity-80">Compras netas gravadas (Tributo)</td>
                        <td className="p-3"><input type="text" value={datosIGV.c108} onChange={(e) => {
                          const val = e.target.value;
                          setDatosIGV({...datosIGV, c108: val, c178: val});
                          const calc = Math.round((parseFloat(datosIGV.c107) || 0) * 0.18 * 100) / 100;
                          setValidez(prev => ({...prev, c108: Math.abs(calc - parseFloat(val)) < 0.1}));
                        }} className="w-full border-2 border-gray-400 p-2 rounded-lg text-right text-black font-bold outline-none focus:border-[#0071BC]" placeholder="0" /></td>
                        <td className="p-3 text-center"><RenderSemaforo esValido={validez.c108} /></td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t-2">
                        <td className="p-3 text-[#0071BC]">178</td>
                        <td className="p-3 text-gray-700 uppercase">TOTAL COMPRAS:</td>
                        <td className="p-3"><input type="text" value={datosIGV.c178} readOnly className="w-full border-2 border-[#0071BC] p-2 rounded-lg text-right bg-gray-100 text-black font-extrabold outline-none cursor-not-allowed" placeholder="0" /></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-700">¿Posee alguna suspensión de pagos o cuenta?</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-gray-400">{datos.suspensionPagos ? 'Sí' : 'No'}</span>
                      <div onClick={() => {
                        const nuevoEstado = !datos.suspensionPagos;
                        if (!nuevoEstado) {
                          actualizarDatos({
                            suspensionPagos: false,
                            numeroResolucion: '',
                            fechaModificacion: '',
                            coeficienteSunat: 0
                          });
                        } else {
                          actualizarDatos({ suspensionPagos: true });
                        }
                      }} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${datos.suspensionPagos ? 'bg-[#0071BC]' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${datos.suspensionPagos ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-700 leading-tight">¿Presentó un formulario PDT 625 actualizado?</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-gray-400">{datos.pdt625 ? 'Sí' : 'No'}</span>
                      <div onClick={() => actualizarDatos({pdt625: !datos.pdt625})} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${datos.pdt625 ? 'bg-[#0071BC]' : 'bg-gray-400'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${datos.pdt625 ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className={`text-sm font-bold block mb-2 text-left ${!datos.suspensionPagos ? 'text-gray-400' : 'text-gray-700'}`}>Número de Res Int: <span className="text-[#0071BC] cursor-help">ⓘ</span>
                      <div className="absolute left-32 bottom-full mb-2 hidden group-hover:block w-40 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">Ingrese el número de resolución de intendencia.</div>
                    </label>
                    <input type="text" value={datos.numeroResolucion} onChange={(e) => actualizarDatos({numeroResolucion: e.target.value})} disabled={!datos.suspensionPagos} className={`w-full border-2 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC] ${!datos.suspensionPagos ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' : 'border-gray-400'}`} placeholder="Ingrese número" />
                  </div>

                  <div className="relative group">
                    <label className={`text-sm font-bold block mb-2 text-left ${!datos.suspensionPagos ? 'text-gray-400' : 'text-gray-700'}`}>Fecha de modificación: <span className="text-[#0071BC] cursor-help">ⓘ</span>
                      <div className="absolute left-40 bottom-full mb-2 hidden group-hover:block w-40 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50">DD/MM/AAAA (ej: 12/03/2026).</div>
                    </label>
                    <input type="text" value={datos.fechaModificacion} onChange={(e) => actualizarDatos({fechaModificacion: e.target.value})} disabled={!datos.suspensionPagos} className={`w-full border-2 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC] ${!datos.suspensionPagos ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' : 'border-gray-400'}`} placeholder="DD/MM/AAAA" />
                  </div>

                  <div className="relative group">
                    <label className={`text-sm font-bold block mb-2 text-left ${!datos.suspensionPagos ? 'text-gray-400' : 'text-gray-700'}`}>Coeficiente SUNAT: <span className="text-[#0071BC] cursor-help">ⓘ</span></label>
                    <input type="text" value={datos.coeficienteSunat} onChange={(e) => actualizarDatos({coeficienteSunat: parseFloat(e.target.value) || 0})} disabled={!datos.suspensionPagos} className={`w-full border-2 p-3 rounded-xl text-black font-bold outline-none focus:border-[#0071BC] ${!datos.suspensionPagos ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' : 'border-gray-400'}`} placeholder="0.0000" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-500 border-b pb-1 text-base italic mb-4">Estado de Ganancia y Pérdida</h4>
                  <table className="w-full text-sm font-bold">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                      <tr><th className="p-3 text-left">Casilla</th><th className="p-3 text-left">Concepto</th><th className="p-3 text-right">Valor</th><th className="p-3 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-3 text-[#0071BC]">380</td><td className="p-3 text-gray-700 leading-tight">Coeficiente - Artículo 85</td>
                        <td className="p-3"><input type="text" value={current380} onChange={(e) => setDatosRenta({...datosRenta, c380: e.target.value})} readOnly={isEspecial} className={`w-full border-2 border-gray-300 p-2 rounded-lg text-right text-black font-bold outline-none ${isEspecial ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="0" /></td>
                        <td className="p-3 text-center"><RenderSemaforo esValido={true} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC]">315</td><td className="p-3 text-gray-700 leading-tight">Porcentaje – Artículo 85°</td>
                        <td className="p-3"><input type="text" value={current315} onChange={(e) => setDatosRenta({...datosRenta, c315: e.target.value})} readOnly={isEspecial || isMype || isGeneral} className={`w-full border-2 border-gray-300 p-2 rounded-lg text-right text-black font-bold outline-none ${isEspecial || isMype || isGeneral ? 'bg-gray-100 cursor-not-allowed' : ''}`} placeholder="0" /></td>
                        <td className="p-3 text-center"><RenderSemaforo esValido={true} /></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC]">312</td><td className="p-3 text-gray-700 leading-tight">Ingresos netos (Tributo)</td>
                        <td className="p-3"><input type="text" value={calc312} readOnly className="w-full border-2 border-[#0071BC] p-2 rounded-lg text-right bg-gray-100 text-black font-extrabold outline-none cursor-not-allowed" placeholder="0" /></td>
                        <td className="p-3 text-center"></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#0071BC]">301</td><td className="p-3 text-gray-700 leading-tight">Ingresos Netos (Base imponible)</td>
                        <td className="p-3"><input type="text" value={datosRenta.c301} onChange={(e) => setDatosRenta({...datosRenta, c301: e.target.value})} className="w-full border-2 border-gray-300 p-2 rounded-lg text-right text-black font-bold outline-none" placeholder="0" /></td>
                        <td className="p-3 text-center"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center space-x-6">
            <button onClick={alAnterior} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md active:scale-95">Anterior</button>
            <button onClick={handleSiguiente} className="bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}