import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/playwright/',
  use: {
    baseURL: 'https://bakehouse-thomascrabs.cta-training.academy/',
    headless: true
  }
});