import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Zawsze ładuj zmienne testowe dla Playwright
dotenv.config({ path: ".env.test" });

export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    video: "on-first-retry",
    actionTimeout: 15000,
    navigationTimeout: 15000,
    // Włączamy tryb debugowania dla pierwszego uruchomienia
    headless: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minuty na uruchomienie serwera
  },
});
