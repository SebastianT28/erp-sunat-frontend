import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de estrés
export const options = {
  ext: {
    loadimpact: {
      projectID: 7793471, // Tu ID de proyecto en Grafana Cloud
      name: 'API Stress Test - Local Backend',
    }
  },
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 30 },
    { duration: '30s', target: 40 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 70 },
    { duration: '30s', target: 80 },
    { duration: '30s', target: 90 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 }, // Bajada para concluir
  ],
};

export default function () {
  const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080';

  // 1. Petición POST: Crear un nuevo ticket (Simula proceso crítico de escritura)
  const createTicketPayload = JSON.stringify({
    usernameAfectado: `user_stress_${__VU}_${__ITER}`,
    correoContacto: 'stress@example.com',
    descripcion: 'Prueba de estrés generada automáticamente por k6 para evaluar el rendimiento de la base de datos local y el backend.',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postRes = http.post(`${BASE_URL}/api/helpdesk/tickets/public`, createTicketPayload, params);

  // Validar si el POST fue exitoso
  const isPostSuccessful = check(postRes, {
    'POST ticket status is 201': (r) => r.status === 201,
  });

  // 2. Petición GET: Si el ticket se creó, consultar su estado (Simula proceso crítico de lectura)
  if (isPostSuccessful) {
    try {
      const responseBody = postRes.json();
      const numeroTicket = responseBody.numeroTicket;

      if (numeroTicket) {
        // Consultar el estado del ticket recién creado
        const getRes = http.get(`${BASE_URL}/api/helpdesk/tickets/status/${numeroTicket}`, {
          tags: { name: 'GET /api/helpdesk/tickets/status/{numeroTicket}' }
        });

        check(getRes, {
          'GET ticket status is 200': (r) => r.status === 200,
        });
      }
    } catch (e) {
      // Ignorar errores de parseo JSON si el servidor devolvió HTML o error no estructurado por colapso
    }
  }

  // Pequeña pausa entre iteraciones para simular tiempo de reflexión del usuario
  sleep(1);
}
