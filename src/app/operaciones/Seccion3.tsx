"use client";

import React, { useState, useMemo } from 'react';
import Link from "next/link";

export default function Seccion3({ alAnterior, alPago, datos, actualizarDatos }: { alAnterior: () => void, alPago: () => void, datos: any, actualizarDatos: (d: any) => void }) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    saldos: true,
    intereses: false,
    retenciones: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const manejarSalir = () => {
    window.location.href = "/login";
  };

  // Extraer valores de las casillas para cálculos
  const getValor = (num: string) => {
    const casilla = datos?.casillas?.find((c: any) => c.numeroCasilla === num);
    return casilla ? Number(casilla.valor) : 0;
  };

  // --- CÁLCULOS DINÁMICOS ---
  const {
    igvResultante,
    impuestoRenta,
    totalDeuda
  } = useMemo(() => {
    const igvVentas = getValor("101");
    const igvCompras = getValor("108");
    const resultante140 = Math.max(0, igvVentas - igvCompras);

    // El Impuesto a la Renta (302) es igual al Ingreso Neto Tributo calculado en la 312
    const renta302 = getValor("312");

    return {
      igvResultante: resultante140,
      impuestoRenta: renta302,
      totalDeuda: resultante140 + renta302
    };
  }, [datos.casillas]);

  const manejarExportacionTxt = () => {
    const ruc = "20123456789"; // Genérico como solicitado
    const periodo = datos.periodoTributario ? datos.periodoTributario.replace('/', '') : '000000';
    const nombreArchivo = `0621${ruc}${periodo}.txt`;

    let contenido = "";
    if (datos.casillas && datos.casillas.length > 0) {
      // Formato: 0621|RUC|Periodo|Casilla|Valor|
      datos.casillas.forEach((c: any) => {
        contenido += `0621|${ruc}|${periodo}|${c.numeroCasilla}|${c.valor}|\n`;
      });
      // Añadimos las casillas calculadas
      contenido += `0621|${ruc}|${periodo}|140|${igvResultante}|\n`;
      contenido += `0621|${ruc}|${periodo}|302|${impuestoRenta}|\n`;
    } else {
      contenido = `0621|${ruc}|${periodo}|SinDatos|0|\n`;
    }

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const manejarPago = async () => {
    console.log("JSON ENVIADO AL BACKEND:", JSON.stringify(datos, null, 2));
    
    try {
      const response = await fetch("http://localhost:8080/api/produccion/formularios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("¡Datos guardados con éxito en la base de datos! (Status: " + response.status + ")");
        if (responseData && responseData.id) {
          actualizarDatos({ idBaseDatos: responseData.id });
        }
        alPago();
      } else {
        const errorText = await response.text();
        alert("Error al guardar los datos: " + errorText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un error de conexión con el backend.");
    }
  };

  const textGray = "text-[#6c757d]";

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans text-left">
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

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <h1 className="text-[#0071BC] text-xl font-bold text-left">Formulario SUNAT 621 - IGV Renta Mensual</h1>
      </div>

      <div className="max-w-5xl mx-auto mt-6 bg-[#f8f9fa] shadow-2xl rounded-lg overflow-hidden mb-10">
        <div className="bg-white p-6 border-b flex justify-around items-center text-center">
          {[
            { n: "1", t: "Información general", active: false },
            { n: "2", t: "Detalle de declaración", active: false },
            { n: "3", t: "Determinación final", active: true },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 z-10 ${step.active ? 'bg-[#0071BC] text-white' : 'bg-gray-300 text-gray-600'}`}>{step.n}</div>
              <span className={`text-[10px] md:text-sm font-medium px-1 leading-tight ${step.active ? 'text-[#0071BC]' : 'text-gray-500'}`}>{step.t}</span>
              {i < 2 && <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200 -z-0"></div>}
            </div>
          ))}
        </div>

        <div className="p-4 md:p-10">
          <h2 className="text-[#0071BC] text-xl md:text-2xl font-bold mb-8 border-b-2 border-blue-100 pb-2">Sección III: Determinación de la Deuda</h2>

          <div className="space-y-4">
            <h3 className="text-[#6c757d] font-bold text-lg mt-4">Detalle del cálculo</h3>

            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('saldos')} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b">
                <span className="font-bold text-[#0071BC] text-base">Saldos y créditos</span>
                <span className="text-[#0071BC] font-bold text-xs">{openSections.saldos ? '▲' : '▼'}</span>
              </button>
              {openSections.saldos && (
                <div className="p-4 space-y-2">
                   {[
                    { c: "140", t: "IGV Resultante", v: igvResultante.toFixed(2) },
                    { c: "145", t: "Saldo a Favor del Periodo Anterior (IGV)", v: "0.00" },
                    { c: "302", t: "Impuesto a la Renta", v: impuestoRenta.toFixed(2) },
                    { c: "303", t: "Saldo a Favor del Periodo Anterior (Renta)", v: "0.00" }
                  ].map((item) => (
                    <div key={item.c} className="flex justify-between items-center text-sm border-b py-2">
                      <span className={`${textGray} font-medium`}><span className="font-bold text-[#0071BC] mr-2">{item.c}</span> {item.t}</span>
                      <span className="font-bold text-gray-800">S/ {item.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('intereses')} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b">
                <span className="font-bold text-gray-800 text-base">Intereses moratorios y pagos previos</span>
                <span className="text-gray-400 font-bold text-xs">{openSections.intereses ? '▲' : '▼'}</span>
              </button>
              {openSections.intereses && (
                <div className="p-4 space-y-2">
                   {[
                    { c: "187", t: "Interés Moratorio IGV", v: "0.00" },
                    { c: "319", t: "Interés Moratorio Renta", v: "0.00" },
                    { c: "185", t: "Pagos Previos del Periodo (IGV)", v: "0.00" },
                    { c: "317", t: "Pagos Previos del Periodo (Renta)", v: "0.00" }
                  ].map((item) => (
                    <div key={item.c} className="flex justify-between items-center text-sm border-b py-2">
                      <span className={`${textGray} font-medium`}><span className="font-bold text-[#0071BC] mr-2">{item.c}</span> {item.t}</span>
                      <span className="font-bold text-gray-800">S/ {item.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('retenciones')} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b">
                <span className="font-bold text-gray-800 text-base">Retenciones y Percepciones</span>
                <span className="text-gray-400 font-bold text-xs">{openSections.retenciones ? '▲' : '▼'}</span>
              </button>
              {openSections.retenciones && (
                <div className="p-8 text-center space-y-5 bg-white">
                  <p className={`${textGray} text-sm font-bold italic leading-relaxed`}>
                    "Retenciones detectadas en el archivo de carga. Generando registros estructurados..."
                  </p>
                  <button onClick={manejarExportacionTxt} className="inline-flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95">
                    ⬇ Descargar Archivo Plano SUNAT (.txt)
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-[#6c757d] font-bold text-lg mt-8">Resumen de obligaciones</h3>

            <div className="mt-2 bg-[#005999] text-white rounded-xl p-8 shadow-xl border border-[#004a80]">
              <div className="text-center mb-6">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] opacity-90 uppercase">Total Deuda Tributaria</span>
                <div className="text-4xl md:text-6xl font-bold mt-2">
                  <span className="text-2xl md:text-4xl opacity-80 mr-2 font-light">S/</span>
                  {totalDeuda.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="w-full h-px bg-white/30 my-6"></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center border-r border-white/20">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">IGV</span>
                  <div className="text-lg md:text-2xl font-bold mt-1">S/ {igvResultante.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Renta</span>
                  <div className="text-lg md:text-2xl font-bold mt-1">S/ {impuestoRenta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
            <button onClick={alAnterior} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md active:scale-95 text-sm">Anterior</button>
            <button onClick={manejarPago} className="bg-[#0071BC] hover:bg-[#005a96] text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95 text-sm flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              <span>Continuar con el pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}