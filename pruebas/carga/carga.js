// Prueba de carga básica de Spring PetClinic con k6 (sección 7.3 del informe).
// Escenario: hasta 20 usuarios virtuales navegando las páginas de consulta más usadas.
// Umbrales (RNF01): p95 < 3 s y menos de 1 % de peticiones fallidas.
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // rampa de subida
    { duration: '1m', target: 20 },  // carga sostenida
    { duration: '30s', target: 0 },  // rampa de bajada
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const paginas = [
    ['inicio', `${BASE_URL}/`],
    ['listar dueños', `${BASE_URL}/owners?lastName=`],
    ['buscar Davis', `${BASE_URL}/owners?lastName=Davis`],
    ['ficha dueño 1', `${BASE_URL}/owners/1`],
    ['veterinarios', `${BASE_URL}/vets.html`],
  ];
  for (const [nombre, url] of paginas) {
    const res = http.get(url, { tags: { pagina: nombre } });
    check(res, { [`${nombre}: HTTP 200`]: (r) => r.status === 200 });
    sleep(1);
  }
}
