import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Używamy prostych selektorów bez astro-island
    this.form = page.locator('[data-test-id="login-form"]');
    this.emailInput = page.locator('[data-test-id="login-email-input"]');
    this.passwordInput = page.locator('[data-test-id="login-password-input"]');
    this.submitButton = page.locator('[data-test-id="login-submit-button"]');
    this.errorMessage = page.locator('[data-test-id="login-error"]');
  }

  async waitForForm() {
    await this.page.waitForSelector('[data-testid="navigation-bar"]', {
      state: "visible",
      timeout: 5000,
    });

    //console.log('NavigationBar is visible');

    await this.page.waitForSelector('[data-testid="user-menu-trigger"]', {
      state: "visible",
      timeout: 10000,
    });

    //console.log('User menu is visible');

    const userMenu = this.page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toBeEnabled();

    //console.log('User menu verification completed successfully');
  }
  async fillLoginForm(email: string, password: string) {
    // Czekamy aż pola będą dostępne i widoczne
    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
    await this.passwordInput.waitFor({ state: "visible", timeout: 15000 });

    // Wypełniamy pola
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    // Czekamy na pojawienie się formularza
    await this.form.waitFor({ state: "visible", timeout: 30000 });

    // Wypełniamy formularz
    await this.fillLoginForm(email, password);

    // Przygotowujemy promise na odpowiedź przed kliknięciem
    const responsePromise = this.page.waitForResponse((response) => response.url().includes("/api/auth/login"), {
      timeout: 30000,
    });

    // Klikamy przycisk logowania
    await this.submitButton.click();

    // Czekamy na odpowiedź
    const response = await responsePromise;
    const status = response.status();

    // Jeśli logowanie się powiodło
    if (status === 200) {
      // Czekamy na przekierowanie
      await this.page.waitForURL("**/", { timeout: 30000 });
      //console.log('Redirected to homepage');

      // Czekamy na pełne załadowanie strony
      await this.page.waitForLoadState("networkidle");
      //console.log('Page fully loaded');

      // Czekamy na kompletne załadowanie strony
      await this.page.waitForLoadState("networkidle");
      await this.page.waitForLoadState("domcontentloaded");

      // Czekamy na hydratację komponentu NavigationBar
      await this.page.waitForSelector('[data-testid="navigation-bar"]', {
        state: "visible",
        timeout: 5000,
      });
      //console.log('NavigationBar is visible');

      // Czekamy na zalogowanie użytkownika
      await this.page.waitForSelector('[data-testid="user-menu-trigger"]', {
        state: "visible",
        timeout: 10000,
      });
      //console.log('User menu is visible');

      // Upewniamy się, że menu jest interaktywne
      const userMenu = this.page.locator('[data-testid="user-menu-trigger"]');
      await expect(userMenu).toBeVisible();
      await expect(userMenu).toBeEnabled();
      //console.log('User menu verification completed successfully');
    }
  }
}
