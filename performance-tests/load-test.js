import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de carga
export const options = {
  ext: {
    loadimpact: {
      projectID: 7793471,
      name: 'Load Test - ERP Local',
    }
  },
  stages: [
    { duration: '15s', target: 50 }, // Rampa de subida: 50 usuarios en 15 segundos
    { duration: '1m', target: 50 },  // Mantenimiento: 50 usuarios por 1 minuto
    { duration: '15s', target: 0 },  // Rampa de bajada: 0 usuarios en 15 segundos
  ],
  thresholds: {
    // El 95% de las peticiones deben completarse en menos de 500ms
    http_req_duration: ['p(95)<500'],
    // La tasa de error debe ser menor al 1%
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Tomamos la URL del entorno, por defecto localhost:3000 si no se provee
  const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

  // Array con las rutas críticas que queremos probar
  const endpoints = ['/', '/login'];
  
  // Elegir una ruta aleatoriamente para simular un comportamiento más natural
  const url = `${BASE_URL}${endpoints[Math.floor(Math.random() * endpoints.length)]}`;

  // Realizar la petición GET
  const res = http.get(url);

  // Validaciones
  check(res, {
    'estado es 200': (r) => r.status === 200,
  });

  // Pequeña pausa entre peticiones de cada usuario virtual para no saturar artificialmente
  sleep(1);
}
