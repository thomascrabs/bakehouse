import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  executor: 'ramping-vus',
  startVUs: 0,
  stages: [
    { duration: '30s', target: 25 },
    { duration: '210s', target: 25 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<250', 'max<2000'],
    http_req_failed: ['rate<0.5'],
  },
};

export default function () {
  let res = http.get('https://bakehouse-thomascrabs.cta-training.academy/api/products');
  sleep(5);
}