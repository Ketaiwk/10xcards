import { test as base } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";
import { LoginPage } from "./LoginPage";

// Rozszerzamy podstawowy interfejs fixtures o nasze Page Objects
interface PageObjects {
  navigationBar: NavigationBar;
  loginPage: LoginPage;
}

// Tworzymy nowy test fixture z naszymi Page Objects
export const test = base.extend<PageObjects>({
  navigationBar: async ({ page }, use) => {
    // eslint-disable-next-line
    await use(new NavigationBar(page));
  },
  loginPage: async ({ page }, use) => {
    // eslint-disable-next-line
    await use(new LoginPage(page));
  },
});

// Eksportujemy expect z playwright/test
export { expect } from "@playwright/test";
