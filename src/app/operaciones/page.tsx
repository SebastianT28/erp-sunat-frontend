"use client";

import React, { useState } from 'react';
import Seccion1 from './Seccion1';
import Seccion2 from './Seccion2';

export default function PaginaOperaciones() {
  const [paso, setPaso] = useState(1);

  // Navegar entre secciones
  const irASiguiente = () => setPaso(paso + 1);
  const irAAnterior = () => setPaso(paso - 1);

  return (
    <main>
      {paso === 1 && <Seccion1 alSiguiente={irASiguiente} />}
      {paso === 2 && <Seccion2 alAnterior={irAAnterior} alSiguiente={irASiguiente} />}
    </main>
  );
}