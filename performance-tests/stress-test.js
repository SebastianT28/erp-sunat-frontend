import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de estrés por etapas (stages)
export const options = {
  ext: {
    loadimpact: {
      projectID: 7793471,
      name: 'Stress Test - ERP Vercel',
    }
  },
  stages: [
    { duration: '1m', target: 25 },   // Etapa 1: Subir a 25 usuarios
    { duration: '1m', target: 50 },   // Etapa 2: Subir a 50 usuarios
    { duration: '1m', target: 75 },   // Etapa 3: Subir a 75 usuarios
    { duration: '1m', target: 100 },  // Etapa 4: Subir al límite de Grafana (100 VUs)
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

  // Pausa muy corta (0.1s) para que esos 100 usuarios generen una lluvia masiva de peticiones
  sleep(0.1);
}
