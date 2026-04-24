"use client";

import React, { useState } from 'react';
import Seccion1 from './Seccion1';
import Seccion2 from './Seccion2';
import Seccion3 from './Seccion3';

export default function PaginaOperaciones() {
  const [paso, setPaso] = useState(1);

  // Navegar entre secciones
  const irASiguiente = () => setPaso(paso + 1);
  const irAAnterior = () => setPaso(paso - 1);
  const irAPago = () => console.log("Yendo a la pasarela de pago...");

  return (
    <main>
      {paso === 1 && <Seccion1 alSiguiente={irASiguiente} />}
      {paso === 2 && <Seccion2 alAnterior={irAAnterior} alSiguiente={irASiguiente} />}
      {paso === 3 && <Seccion3 alAnterior={irAAnterior} alPago={irAPago} />}
    </main>
  );
}