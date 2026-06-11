import http from 'k6/http';
import { group, check, sleep } from 'k6';

const BASE_URL = 'https://bakehouse-thomascrabs.cta-training.academy/';

export const options = {
    scenarios: {
        bounce: {
            exec: 'homeJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 25 },
                { duration: '570s', target: 25 },
            ],
            gracefulRampDown: '5s',
        },
        products: {
            exec: 'productsJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 10 },
                { duration: '570s', target: 10 },
            ],
            gracefulRampDown: '5s',
        },
        customers: {
            exec: 'customerJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 10 },
                { duration: '570s', target: 10 },
            ],
            gracefulRampDown: '5s',
        },
        addProducts: {
            exec: 'addProductJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '570s', target: 2 },
            ],
            gracefulRampDown: '5s',
        },
        addCustomers: {
            exec: 'addCustomerJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '570s', target: 2 },
            ],
            gracefulRampDown: '5s',
        },
        addOrders: {
            exec: 'addOrderJourney',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '570s', target: 2 },
            ],
            gracefulRampDown: '5s',
        },
    },

    thresholds: {
        http_req_duration: ['p(95)<250', 'max<2000'],
        http_req_failed: ['rate<0.1'],
    },
};

export function homeJourney() {
    group('home journey', () => {
        simpleGetRequest(BASE_URL, '<div id="root"></div>');
        sleep(5);
    });
}

export function productsJourney() {
    group('products journey', () => {
        simpleGetRequest(BASE_URL);
        sleep(5);
        simpleGetRequest(`${BASE_URL}api/products`, 'victoria_sponge_slice');
        sleep(5);
    });
}

export function customerJourney() {
    group('customer journey', () => {
        simpleGetRequest(BASE_URL);
        sleep(5);
        simpleGetRequest(`${BASE_URL}api/customers`, 'Alice Baker');

        sleep(5);
    });
}

export function addProductJourney() {
    simpleGetRequest(BASE_URL);
    sleep(3);
    simpleGetRequest(`${BASE_URL}products/new`, '<div id="root"></div>');
    sleep(6)
    let randomNum = Math.floor(Math.random() * 1000);

    let data = {
        category: `thomas_perf${randomNum}`,
        name: `thomas_perf${randomNum}`,
        pdfFile: `thomas_perf${randomNum}.pdf`,
        price: 24562,
        productId: `thomas_perf${randomNum}`
    };
    simplePostRequest(`${BASE_URL}api/products`, data, 'created');
    sleep(10)
}

export function addCustomerJourney() {
    simpleGetRequest(BASE_URL);
    sleep(3);
    simpleGetRequest(`${BASE_URL}customers/new`, '<div id="root"></div>');
    sleep(6)
    let randomNum = Math.floor(Math.random() * 1000);

    let data = {
        email: `thomas_perf${randomNum}`,
        name: `thomas_perf${randomNum}@test.com`
    };
    simplePostRequest(`${BASE_URL}api/customers`, data, 'created');
    sleep(10)
}

export function addOrderJourney() {
    simpleGetRequest(BASE_URL);
    sleep(3);

    simpleGetRequest(`${BASE_URL}orders/new`, '<div id="root"></div>');
    sleep(3);

    const customersRes = simpleGetRequest(`${BASE_URL}api/customers`);
    const productsRes = simpleGetRequest(`${BASE_URL}api/products`);

    const customers = customersRes.json().customers;
    const products = productsRes.json().products;

    const customer = customers[Math.floor(Math.random() * customers.length)];
    //const product = products[Math.floor(Math.random() * products.length)];
    const productIndex = Math.floor(Math.random() * products.length);

    const data = {  
        customerId: customer.id,
        items: [
            {
                productId: productIndex,
                quantity: 2
            }
        ]
    };

    simplePostRequest(`${BASE_URL}api/orders`, data, 'created');

    sleep(10);
}

function simplePostRequest(pageUrl, postData, expectedText) {
    let res = http.post(pageUrl, JSON.stringify(postData), {
        headers: { 'Content-Type': 'application/json' },
    });

    const success = check(res, {
        'status was 201': (r) => r.status === 201,
        ...(expectedText && {
            'page contains expected text': (r) =>
                r.body.includes(expectedText),
        }),
    });

    if (!success) {
        console.log(`\nFAILED REQUEST: ${pageUrl}`);
        console.log(`Status: ${res.status}`);

        if (expectedText) {
            console.log(`Expected text: ${expectedText}`);
            console.log(`Response body: ${res.body.substring(0, 500)}`);
        }
    }
    return res;
}

function simpleGetRequest(pageUrl, expectedText = null) {
    const res = http.get(pageUrl);
    sleep(1);
    console.log(res);
    const success = check(res, {
        'status was 200': (r) => r.status === 200,
        ...(expectedText && {
            'page contains expected text': (r) =>
                r.body.includes(expectedText),
        }),
    });

    if (!success) {
        console.log(`\nFAILED REQUEST: ${pageUrl}`);
        console.log(`Status: ${res.status}`);

        if (expectedText) {
            console.log(`Expected text: ${expectedText}`);
            console.log(`Response body: ${res.body.substring(0, 500)}`);
        }
    }

    return res;
}