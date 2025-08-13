import { test, expect } from '@playwright/test';

test('strona główna powinna się załadować', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/10xCards/);
});

test('strona główna i nawigacja powinny działać poprawnie', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/10xCards/);
  
  // Sprawdź czy menu nawigacji jest widoczne
  const nav = await page.locator('nav');
  await expect(nav).toBeVisible();

  // Sprawdź czy link do logowania jest widoczny i kliknij go
  const loginLink = await page.getByText('Zaloguj się');
  await expect(loginLink).toBeVisible();
  await loginLink.click();
  
  // Sprawdź czy URL się zmienił
  await expect(page).toHaveURL(/.*auth\/login/);
});
