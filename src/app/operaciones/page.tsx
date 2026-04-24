"use client";

import React, { useState } from 'react';
import Seccion1 from './Seccion1';
import Seccion2 from './Seccion2';
import Seccion3 from './Seccion3';
import SeccionPago from './SeccionPago';

export default function PaginaOperaciones() {
  const [paso, setPaso] = useState(1);

  // Navegar entre secciones
  const irASiguiente = () => setPaso(paso + 1);
  const irAAnterior = () => setPaso(paso - 1);
  const irAPago = () => setPaso(4);

  const finalizarTodo = () => {
    alert("Trámite finalizado con éxito.");
    setPaso(1); // Opcional: Reiniciar al inicio
  };

  return (
    <main>
      {paso === 1 && <Seccion1 alSiguiente={irASiguiente} />}
      {paso === 2 && <Seccion2 alAnterior={irAAnterior} alSiguiente={irASiguiente} />}
      {paso === 3 && <Seccion3 alAnterior={irAAnterior} alPago={irAPago} />}
      {paso === 4 && (
        <SeccionPago 
          alFinalizar={finalizarTodo} 
        />
      )}
    </main>
  );
}