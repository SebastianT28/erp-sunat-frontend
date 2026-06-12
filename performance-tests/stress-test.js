import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de estrés por etapas (stages)
export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Etapa 1: Subir a 100 usuarios y mantener
    { duration: '1m', target: 300 },  // Etapa 2: Subir a 300 usuarios y mantener
    { duration: '1m', target: 600 },  // Etapa 3: Subir a 600 usuarios y mantener
    { duration: '1m', target: 1000 }, // Etapa 4: Subir a 1000 usuarios y mantener
    { duration: '1m', target: 0 },    // Etapa 5: Bajar a 0 usuarios
  ],
  // No configuramos thresholds estrictos para que la prueba no aborte 
  // antes de terminar, ya que queremos ver exactamente dónde falla.
};

export default function () {
  // Tomamos la URL del entorno, por defecto la de Vercel si no se provee
  const BASE_URL = __ENV.TARGET_URL || 'https://erp-sunat-frontend.vercel.app';

  // Rutas críticas
  const endpoints = ['/', '/login'];
  
  // Elegir aleatoriamente
  const url = `${BASE_URL}${endpoints[Math.floor(Math.random() * endpoints.length)]}`;

  // Realizar la petición GET
  const res = http.get(url);

  // Validaciones básicas. Si el estado no es 200, sabremos que el servidor empezó a fallar.
  check(res, {
    'estado es 200': (r) => r.status === 200,
  });

  // Pausa corta de 1 segundo
  sleep(1);
}
