import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  let res = http.get('https://bakehouse-thomascrabs.cta-training.academy/api/products');
  sleep(5);
}