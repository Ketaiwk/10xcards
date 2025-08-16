import { test, expect } from '../page-objects';

test.describe('Login Flow', () => {
  /*test('użytkownik może się zalogować z poprawnymi danymi', async ({ navigationBar, loginPage, page }) => {
    // Arrange
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Włączamy logowanie sieci
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/auth')) {
        requests.push(`Request: ${request.method()} ${request.url()}`);
      }
    });
    page.on('response', response => {
      if (response.url().includes('/api/auth')) {
        requests.push(`Response: ${response.status()} ${response.url()}`);
      }
    });

    // Włączamy logowanie konsoli z przeglądarki
    const browserLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      browserLogs.push(text);
      //console.log('Browser log:', text);
    });
    
    // Act
    await navigationBar.clickLogin();
    
    // Czekamy na załadowanie formularza
    await loginPage.waitForForm();

    // Debug - sprawdź URL przed logowaniem
    //console.log('Current URL before login:', page.url());
    
    // Logujemy się i czekamy na przekierowanie
    // Obserwujemy nawigację
    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle' });
    
    // Logujemy się
    await loginPage.fillLoginForm(
      process.env.E2E_USER_EMAIL || 'test@example.com',
      process.env.E2E_USER_PASSWORD || 'test123456'
    );
    await loginPage.submitLogin();
    
    // Czekamy na przekierowanie i załadowanie strony
    await navigationPromise;
    
    // Czekamy aż strona będzie gotowa
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');

    // Debugowanie
    //console.log('Network requests:', requests);
    //console.log('Browser logs:', browserLogs);

    // Czekamy na pojawienie się menu użytkownika
    const userMenu = page.locator('[data-testid="user-menu-trigger"]');
    await userMenu.waitFor({ state: 'visible', timeout: 5000 });
    
    // Upewniamy się, że menu jest interaktywne
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toBeEnabled();

    // Czekamy na pojawienie się menu użytkownika
    await page.waitForSelector('[data-test-id="user-menu-trigger"]', {
      state: 'visible',
      timeout: 30000
    });
    
    // Debugujemy stan komponentu NavigationBar
    const navState = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const userMenu = nav?.querySelector('[data-test-id="user-menu-trigger"]');
      const loginButton = nav?.querySelector('[data-test-id="nav-login-button"]');
      return {
        hasLoginButton: !!loginButton,
        hasUserMenu: !!userMenu,
        loginButtonState: loginButton ? {
          visible: window.getComputedStyle(loginButton).display !== 'none',
          disabled: loginButton.hasAttribute('disabled')
        } : null,
        userMenuState: userMenu ? {
          visible: window.getComputedStyle(userMenu).display !== 'none',
          disabled: userMenu.hasAttribute('disabled')
        } : null,
        navContent: nav?.innerHTML
      };
    });
    //console.log('Navigation state after login:', JSON.stringify(navState, null, 2));
    
    // Czekamy na załadowanie menu użytkownika
    //console.log('Waiting for user menu...');
    await navigationBar.waitForUserMenu();

    // Sprawdzamy czy menu użytkownika jest w DOM i widoczne
    await expect(navigationBar.userMenuTrigger).toBeVisible();

    // Dla pewności sprawdzamy czy przycisk logowania nie jest widoczny
    await expect(navigationBar.loginButton).not.toBeVisible();

    // Otwieramy menu i sprawdzamy email
    await navigationBar.openUserMenu();
    const userEmail = await navigationBar.getUserEmail();
    expect(userEmail).toBe('test@example.com');
  });*/

  test('wyświetla błąd przy niepoprawnych danych logowania', async ({ navigationBar, loginPage }) => {
    // Arrange
    await navigationBar.page.goto('/');
    await navigationBar.page.waitForLoadState('networkidle');
    
    // Act
    await navigationBar.clickLogin();
    
    // Czekamy na załadowanie formularza
    await expect(loginPage.form).toBeVisible({ timeout: 30000 });
    
    // Próbujemy zalogować się nieprawidłowymi danymi
    await loginPage.login('niepoprawny@email.com', 'zle_haslo');
    
    // Czekamy na pojawienie się komunikatu o błędzie
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('Nieprawidłowy email lub hasło');
  });

  test('przekierowuje na stronę logowania po kliknięciu przycisku zaloguj', async ({ navigationBar, page, loginPage }) => {
    // Arrange
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Act
    await navigationBar.clickLogin();
    
    // Nawigacja powinna się zakończyć w clickLogin
    await page.waitForLoadState('networkidle');
    
    // Czekamy na zainicjalizowanie komponentów React
    await page.waitForFunction(() => {
      const islands = document.querySelectorAll('astro-island');
      return Array.from(islands).every(island => !island.hasAttribute('ssr'));
    }, { timeout: 10000 });

    // Czekamy na formularz
    await expect(loginPage.form).toBeVisible({ timeout: 15000 });
  });
});