import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '120s',
  thresholds: {
    http_req_duration: ['p(95)<250', 'max<2000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  let res = http.get('https://bakehouse-thomascrabs.cta-training.academy/api/products');
  sleep(5);
}