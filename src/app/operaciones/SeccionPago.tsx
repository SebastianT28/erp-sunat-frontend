"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";

export default function SeccionPago({ alFinalizar, datos }: { alFinalizar: () => void, datos: any }) {
  const [estadoPago, setEstadoPago] = useState<'CARGANDO' | 'PENDIENTE' | 'PAGADO'>('CARGANDO');
  const [nps, setNps] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  // Extract totals
  const getValor = (num: string) => {
    const casilla = datos?.casillas?.find((c: any) => c.numeroCasilla === num);
    return casilla ? Number(casilla.valor) : 0;
  };

  const igvVentas = getValor("101");
  const igvCompras = getValor("108");
  const resultante140 = Math.max(0, igvVentas - igvCompras);
  const renta302 = getValor("312");
  const totalDeuda = resultante140 + renta302;

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    const generarYGuardarPago = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      // Generate random strings
      const genNps = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12 digits
      const genOrden = Math.floor(100000000 + Math.random() * 900000000).toString(); // 9 digits
      
      const hoy = new Date();
      hoy.setDate(hoy.getDate() + 15);
      const fechaVenc = hoy.toISOString().split('T')[0];

      setNps(genNps);
      setNumeroOrden(genOrden);
      setFechaVencimiento(fechaVenc);

      if (datos.idBaseDatos) {
        try {
          const payload = {
            numeroNps: genNps,
            numeroOrden: genOrden,
            montoTotal: totalDeuda,
            fechaVencimiento: fechaVenc
          };

          const response = await fetch(`http://localhost:8080/api/produccion/formularios/${datos.idBaseDatos}/pago`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            setEstadoPago('PENDIENTE');
          } else {
            // Revertir a pendiente aunque falle, para demo
            setEstadoPago('PENDIENTE'); 
          }
        } catch (error) {
          setEstadoPago('PENDIENTE');
        }
      } else {
        setEstadoPago('PENDIENTE'); // Demo fallback if no ID
      }
    };

    generarYGuardarPago();
  }, [datos.idBaseDatos, totalDeuda]);

  const simularPago = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/produccion/pagos/${numeroOrden}/pagar`, {
        method: "PATCH"
      });
      if (response.ok) {
        alert("¡Pago Procesado con Éxito!");
        setEstadoPago('PAGADO');
      }
      // Silencioso si falla
    } catch (e) {
      // Silencioso en caso de excepción
    }
  };

  const handleFinalizar = () => {
    // Para limpiar, podríamos tener una función limpiarDatos, pero como redirigimos, se limpia por reload
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#e9ecef] font-sans">
      <header className="bg-white p-4 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/logo-sunat.png" alt="Logo SUNAT" className="h-12 w-auto" />
          <nav className="hidden md:flex space-x-8 text-[14px] font-medium text-gray-500 items-center">
            <Link href="/" className="text-[#0071BC] border-b-2 border-[#0071BC] pb-1 cursor-pointer">Inicio</Link>
          </nav>
        </div>
      </header>
      
      <div className="bg-[#0071BC] h-14 w-full shadow-md flex items-center px-8"></div>

      <div className="max-w-3xl mx-auto px-4 mt-10">
        <div className={`bg-white shadow-2xl rounded-lg overflow-hidden border-t-8 ${estadoPago === 'PAGADO' ? 'border-green-500' : 'border-[#0071BC]'}`}>
          <div className="p-8 md:p-12 text-center">
            {estadoPago === 'CARGANDO' ? (
              <h2 className="text-xl font-bold text-gray-600">Generando constancia...</h2>
            ) : estadoPago === 'PAGADO' ? (
              <>
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-2">¡Pago Procesado con Éxito!</h2>
                <p className="text-gray-500 mb-8">El Número de Pago SUNAT (NPS) ha sido cancelado.</p>
              </>
            ) : (
              <>
                <h2 className="text-[#0071BC] text-2xl font-bold mb-2">Constancia de Presentación</h2>
                <p className="text-gray-500 mb-8">La declaración ha sido registrada, queda pendiente el pago.</p>
              </>
            )}

            {estadoPago !== 'CARGANDO' && (
              <div className="bg-gray-50 rounded-xl p-6 text-left shadow-inner border mb-8">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-gray-400 font-bold block text-xs">MONTO A PAGAR</span>
                    <span className="font-bold text-xl text-gray-800">S/ {totalDeuda.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-xs">PERIODO</span>
                    <span className="font-bold text-xl text-gray-800">{datos.periodoTributario || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-xs mt-4">NÚMERO NPS</span>
                    <span className="font-bold text-lg text-[#0071BC] tracking-widest">{nps}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-xs mt-4">NÚMERO DE ORDEN</span>
                    <span className="font-bold text-lg text-[#0071BC]">{numeroOrden}</span>
                  </div>
                  <div className="col-span-2 border-t pt-4 mt-2">
                    <span className="text-gray-400 font-bold block text-xs">FECHA DE VENCIMIENTO</span>
                    <span className="font-bold text-md text-red-500">{fechaVencimiento}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {estadoPago === 'PENDIENTE' && (
                <button onClick={simularPago} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all active:scale-95">
                  Simular Confirmación de Pago
                </button>
              )}
              <button onClick={handleFinalizar} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-all active:scale-95">
                Finalizar y Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}