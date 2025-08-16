import type { Page, Locator } from "@playwright/test";

export class NavigationBar {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly userMenuTrigger: Locator;
  readonly userMenuContent: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Używamy data-test-id dla elementów
    this.loginButton = page.getByTestId("nav-login-button");
    this.userMenuTrigger = page.getByTestId("user-menu-trigger");
    this.userMenuContent = page.getByTestId("user-menu-content");
    this.userEmail = page.getByTestId("user-email");
    this.logoutButton = page.getByTestId("logout-button");
  }

  async clickLogin(): Promise<void> {
    // Kliknij i czekaj na nawigację
    await Promise.all([this.page.waitForNavigation(), this.loginButton.click()]);

    // Czekamy na pełne załadowanie strony
    await this.page.waitForLoadState("networkidle");
  }

  async waitForUserMenu(): Promise<void> {
    try {
      // 1. Czekamy na załadowanie strony
      await this.page.waitForLoadState("networkidle");

      // 2. Czekamy na pełną hydratację React
      await this.page.waitForFunction(() => {
        const islands = document.querySelectorAll("astro-island");
        const navIsland = Array.from(islands).find((island) =>
          island.getAttribute("component-url")?.includes("NavigationBar")
        );
        return navIsland && !navIsland.hasAttribute("ssr") && navIsland.hasAttribute("hydrated");
      });

      // 3. Czekamy na pojawienie się menu użytkownika
      await this.userMenuTrigger.waitFor({
        state: "visible",
        timeout: 30000,
      });

      //console.log('User menu is ready');
    } catch (error) {
      console.error("Error while waiting for user menu:", error);
      throw error;
    }
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuTrigger.waitFor({ state: "visible" });
    await this.userMenuTrigger.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
  }

  async getUserEmail(): Promise<string | null> {
    await this.openUserMenu();
    return this.userEmail.textContent();
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.userMenuTrigger.isVisible();
  }
}
