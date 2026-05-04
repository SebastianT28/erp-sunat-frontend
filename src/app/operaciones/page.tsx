"use client";

import React, { useState } from 'react';
import Seccion1 from './Seccion1';
import Seccion2 from './Seccion2';
import Seccion3 from './Seccion3';
import SeccionPago from './SeccionPago';

export default function PaginaOperaciones() {
  const [paso, setPaso] = useState(1);

  // ESTADO GLOBAL
  const [formData, setFormData] = useState({
    idBaseDatos: null,
    periodoTributario: '',
    tipoDeclaracion: '',
    condicionIgv: 'Cuenta propia',
    ventasNoGravadas: false,
    ivap: true,
    regimenTributario: '',
    otrosRegimenes: '',
    tipoCambio: 3.75,
    suspensionPagos: false,
    pdt625: false,
    numeroResolucion: '',
    fechaModificacion: '',
    coeficienteSunat: 0.0,
    casillas: [] as { numeroCasilla: string, valor: number }[]
  });

  const actualizarDatos = (nuevosDatos: any) => {
    setFormData(prev => ({ ...prev, ...nuevosDatos }));
  };

  // Navegar entre secciones
  const irASiguiente = () => setPaso(paso + 1);
  const irAAnterior = () => setPaso(paso - 1);
  
  const finalizarTodo = () => {
    alert("Trámite finalizado con éxito.");
    setPaso(1);
  };

  return (
    <main>
      {paso === 1 && (
        <Seccion1 
          alSiguiente={irASiguiente} 
          datos={formData} 
          actualizarDatos={actualizarDatos} 
        />
      )}
      {paso === 2 && (
        <Seccion2 
          alAnterior={irAAnterior} 
          alSiguiente={irASiguiente} 
          datos={formData} 
          actualizarDatos={actualizarDatos} 
        />
      )}
      {paso === 3 && (
        <Seccion3 
          alAnterior={irAAnterior} 
          alPago={() => setPaso(4)} 
          datos={formData}
          actualizarDatos={actualizarDatos}
        />
      )}
      {paso === 4 && (
        <SeccionPago 
          alFinalizar={finalizarTodo} 
          datos={formData}
        />
      )}
    </main>
  );
}