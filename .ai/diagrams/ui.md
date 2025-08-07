# Diagram komponentów UI - Moduł autentykacji 10xCards

```mermaid
flowchart TD
    %% Strony Astro
    subgraph Pages [Strony Astro]
        direction LR
        Login["/auth/login.astro"]
        Register["/auth/register.astro"]
        ForgotPass["/auth/forgot-password.astro"]
        ResetPass["/auth/reset-password.astro"]
    end

    %% Layout
    subgraph Layouts [Layouts]
        MainLayout["Layout.astro"]
        AuthLayout["AuthLayout.tsx"]
    end

    %% Komponenty React Auth
    subgraph AuthComponents [Komponenty Auth]
        direction LR
        LoginForm["LoginForm.tsx"]
        RegisterForm["RegisterForm.tsx"]
        ForgotPassForm["ForgotPasswordForm.tsx"]
        ResetPassForm["ResetPasswordForm.tsx"]
        AuthStatus["AuthStatus.tsx"]
    end

    %% Komponenty UI
    subgraph UIComponents [Komponenty UI]
        direction LR
        Form["Form + FormGroup"]
        Button["Button"]
        Input["Input"]
        Notif["Notification"]
        Avatar["Avatar"]
    end

    %% Hooki i Serwisy
    subgraph Services [Serwisy i Hooki]
        AuthService["auth.service.ts"]
        UserService["user.service.ts"]
        UseAuth["useAuth"]
    end

    %% Przepływ danych i zależności
    MainLayout --> AuthStatus
    AuthLayout --> Form
    AuthLayout --> Notif

    Login --> AuthLayout
    Register --> AuthLayout
    ForgotPass --> AuthLayout
    ResetPass --> AuthLayout

    Login --> LoginForm
    Register --> RegisterForm
    ForgotPass --> ForgotPassForm
    ResetPass --> ResetPassForm

    LoginForm --> Form
    LoginForm --> Button
    LoginForm --> Input
    LoginForm --> Notif
    LoginForm --> UseAuth

    RegisterForm --> Form
    RegisterForm --> Button
    RegisterForm --> Input
    RegisterForm --> Notif
    RegisterForm --> UseAuth

    ForgotPassForm --> Form
    ForgotPassForm --> Button
    ForgotPassForm --> Input
    ForgotPassForm --> Notif

    ResetPassForm --> Form
    ResetPassForm --> Button
    ResetPassForm --> Input
    ResetPassForm --> Notif

    AuthStatus --> Avatar
    AuthStatus --> Button
    AuthStatus --> UseAuth

    UseAuth --> AuthService
    AuthService --> UserService

    %% Style
    classDef astroPage fill:#FFE4E1,stroke:#FF69B4,stroke-width:2px
    classDef layout fill:#E6E6FA,stroke:#9370DB,stroke-width:2px
    classDef component fill:#E0FFFF,stroke:#00CED1,stroke-width:2px
    classDef ui fill:#F0FFF0,stroke:#98FB98,stroke-width:2px
    classDef service fill:#FFF8DC,stroke:#DAA520,stroke-width:2px

    class Login,Register,ForgotPass,ResetPass astroPage
    class MainLayout,AuthLayout layout
    class LoginForm,RegisterForm,ForgotPassForm,ResetPassForm,AuthStatus component
    class Form,Button,Input,Notif,Avatar ui
    class AuthService,UserService,UseAuth service
```

## Legenda

### Strony Astro (Pages)

- `/auth/login.astro`: Strona logowania z SSR i obsługą sesji
- `/auth/register.astro`: Strona rejestracji z walidacją server-side
- `/auth/forgot-password.astro`: Strona resetowania hasła
- `/auth/reset-password.astro`: Strona zmiany hasła po resecie

### Layouts

- `Layout.astro`: Główny layout aplikacji
- `AuthLayout.tsx`: Layout dla stron autoryzacji

### Komponenty Auth

- `LoginForm.tsx`: Formularz logowania z walidacją
- `RegisterForm.tsx`: Formularz rejestracji z walidacją
- `ForgotPasswordForm.tsx`: Formularz żądania resetu hasła
- `ResetPasswordForm.tsx`: Formularz zmiany hasła
- `AuthStatus.tsx`: Komponent stanu autoryzacji

### Komponenty UI

- `Form + FormGroup`: Komponenty formularzy z Shadcn
- `Button`: Przycisk z różnymi wariantami
- `Input`: Pole wprowadzania z walidacją
- `Notification`: Komunikaty i powiadomienia
- `Avatar`: Awatar użytkownika

### Serwisy i Hooki

- `auth.service.ts`: Logika autentykacji
- `user.service.ts`: Zarządzanie profilem
- `useAuth`: Hook do stanu autoryzacji

## Przepływ danych

1. **Logowanie/Rejestracja**

   - Formularze -> AuthService -> Supabase
   - Odpowiedź -> UseAuth -> AuthStatus

2. **Stan sesji**

   - AuthService -> UseAuth -> Komponenty
   - Automatyczne odświeżanie przez AuthService

3. **Zarządzanie profilem**
   - AuthService -> UserService -> Supabase
   - Aktualizacja UI przez UseAuth
