import { test, expect } from '@playwright/test';

test.describe('Bakehouse website tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('homepage loads and key content is visible', async ({ page }) => {
        await expect(page).toHaveTitle('client');

        const heading = page.locator('h2').first();
        await expect(heading).toBeVisible();

        const headingText = await heading.textContent();
        expect(headingText).toMatch('Welcome to the Bakehouse');
    });

    test('can check links on the homepage', async ({ page }) => {
        const links = page.locator('a');

        await expect(links.first()).toBeVisible();

        const linkCount = await links.count();
        expect(linkCount).toBe(9);

        console.log(`Found ${linkCount} links on the page`);
    });

    test('can navigate to products', async ({ page }) => {
        const firstLink = page.getByText('Products');

        await firstLink.click();

        await expect(page.locator('h2')).toHaveText('Products');

    });

    test('can add new product', async ({ page }) => {
        const newProd = page.getByText('New Product');

        await newProd.click();

        let randomNum = Math.floor(Math.random() * 1000);

        await page.getByLabel('Product Name').fill(`Test Product ${randomNum}`);
        await page.getByLabel('Category').fill('Category');
        await page.getByLabel('Price').fill('10.99');
        await page.locator('button[type="submit"]').click();

        await expect(page.locator('css=form p')).toHaveText('Product created ✔️');

    });

    test('Add new customer', async ({ page }) => {

        const newProd = page.getByText('New Customer');

        await newProd.click();

        let randomNum = Math.floor(Math.random() * 1000);
        //console.log(randomNum)
        await page.getByLabel('Full name').fill(`Customer ${randomNum}`);
        await page.getByLabel('Email address').fill(`customer${randomNum}@test.com`);
        await page.locator('button', { name: 'Create customer' }).click();

        await page.getByText('Customer List').click();

        await page.waitForSelector('table');

        //trying to find the customer in the list is flaky

        //Long winded approach
        const customers = page.locator('td:nth-of-type(2)');
        const count = await customers.count();
        let found = false;

        for (let i = 0; i < count; i++) {
            const text = await customers.nth(i).textContent();

            console.log(text)
            if (text === `Customer ${randomNum}`) {
                found = true;
                break;
            }
        }
        expect(found).toBeTruthy();

        //nicer approach

        /*         await expect(
                    page.getByRole('cell', { name: `Customer ${randomNum}`, exact: true })
                ).toBeVisible();
        
                const customerNames = await page.locator('td:nth-of-type(2)').allTextContents();
        
                expect(customerNames.toContain(`Customer ${randomNum}`));
         */

    });

});