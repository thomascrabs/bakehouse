# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: longer-example.spec.js >> Bakehouse website tests >> Add new customer
- Location: test/playwright/longer-example.spec.js:55:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('table') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: bakehouse-thomascrabs demo app
    - navigation [ref=e6]:
      - link "Home" [ref=e7] [cursor=pointer]:
        - /url: /
      - link "Products" [ref=e8] [cursor=pointer]:
        - /url: /products
      - link "New Product" [ref=e9] [cursor=pointer]:
        - /url: /products/new
      - link "Customer List" [active] [ref=e10] [cursor=pointer]:
        - /url: /customers
      - link "New Customer" [ref=e11] [cursor=pointer]:
        - /url: /customers/new
      - link "Order List" [ref=e12] [cursor=pointer]:
        - /url: /orders
      - link "New Order" [ref=e13] [cursor=pointer]:
        - /url: /orders/new
    - generic [ref=e14]:
      - link "Log in" [ref=e15] [cursor=pointer]:
        - /url: /login
      - link "Sign up" [ref=e16] [cursor=pointer]:
        - /url: /signup
  - main [ref=e17]:
    - generic [ref=e18]:
      - heading "Customer List" [level=2] [ref=e19]
      - paragraph [ref=e20]: All registered customers.
      - paragraph [ref=e21]: Could not load customers
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Bakehouse website tests', () => {
  4   | 
  5   |     test.beforeEach(async ({ page }) => {
  6   |         await page.goto('/');
  7   |     });
  8   | 
  9   |     test('homepage loads and key content is visible', async ({ page }) => {
  10  |         await expect(page).toHaveTitle('client');
  11  | 
  12  |         const heading = page.locator('h2').first();
  13  |         await expect(heading).toBeVisible();
  14  | 
  15  |         const headingText = await heading.textContent();
  16  |         expect(headingText).toMatch('Welcome to the Bakehouse');
  17  |     });
  18  | 
  19  |     test('can check links on the homepage', async ({ page }) => {
  20  |         const links = page.locator('a');
  21  | 
  22  |         await expect(links.first()).toBeVisible();
  23  | 
  24  |         const linkCount = await links.count();
  25  |         expect(linkCount).toBe(9);
  26  | 
  27  |         console.log(`Found ${linkCount} links on the page`);
  28  |     });
  29  | 
  30  |     test('can navigate to products', async ({ page }) => {
  31  |         const firstLink = page.getByText('Products');
  32  | 
  33  |         await firstLink.click();
  34  | 
  35  |         await expect(page.locator('h2')).toHaveText('Products');
  36  | 
  37  |     });
  38  | 
  39  |     test('can add new product', async ({ page }) => {
  40  |         const newProd = page.getByText('New Product');
  41  | 
  42  |         await newProd.click();
  43  | 
  44  |         let randomNum = Math.floor(Math.random() * 1000);
  45  | 
  46  |         await page.getByLabel('Product Name').fill(`Test Product ${randomNum}`);
  47  |         await page.getByLabel('Category').fill('Category');
  48  |         await page.getByLabel('Price').fill('10.99');
  49  |         await page.locator('button[type="submit"]').click();
  50  | 
  51  |         await expect(page.locator('css=form p')).toHaveText('Product created ✔️');
  52  | 
  53  |     });
  54  | 
  55  |     test('Add new customer', async ({ page }) => {
  56  | 
  57  |         const newProd = page.getByText('New Customer');
  58  | 
  59  |         await newProd.click();
  60  | 
  61  |         let randomNum = Math.floor(Math.random() * 1000);
  62  |         //console.log(randomNum)
  63  |         await page.getByLabel('Full name').fill(`Customer ${randomNum}`);
  64  |         await page.getByLabel('Email address').fill(`customer${randomNum}@test.com`);
  65  |         await page.locator('button', { name: 'Create customer' }).click();
  66  | 
  67  |         await page.getByText('Customer List').click();
  68  | 
> 69  |         await page.waitForSelector('table');
      |                    ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  70  | 
  71  |         //trying to find the customer in the list is flaky
  72  | 
  73  |         //Long winded approach
  74  |         const customers = page.locator('td:nth-of-type(2)');
  75  |         const count = await customers.count();
  76  |         let found = false;
  77  | 
  78  |         for (let i = 0; i < count; i++) {
  79  |             const text = await customers.nth(i).textContent();
  80  | 
  81  |             console.log(text)
  82  |             if (text === `Customer ${randomNum}`) {
  83  |                 found = true;
  84  |                 break;
  85  |             }
  86  |         }
  87  |         expect(found).toBeTruthy();
  88  | 
  89  |         //nicer approach
  90  | 
  91  |         /*         await expect(
  92  |                     page.getByRole('cell', { name: `Customer ${randomNum}`, exact: true })
  93  |                 ).toBeVisible();
  94  |         
  95  |                 const customerNames = await page.locator('td:nth-of-type(2)').allTextContents();
  96  |         
  97  |                 expect(customerNames.toContain(`Customer ${randomNum}`));
  98  |          */
  99  | 
  100 |     });
  101 | 
  102 | });
```