import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerInstance } from '@/db/supabase.client';
import type { LocalUser } from '@/types';

// Ścieżki publiczne - dostępne bez logowania
const PUBLIC_PATHS = [
  // Strony autoryzacji
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  // Endpointy autoryzacji
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  // Strona główna
  '/',
];

// Ścieżki wymagające autoryzacji
const PROTECTED_PATHS = [
  // API fiszek i zestawów
  '/api/sets',
  '/api/flashcards',
  // Widoki fiszek i zestawów
  '/sets',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, cookies, request, url, redirect } = context;

  try {
    // Inicjalizacja klienta Supabase
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: new Headers(request.headers),
    });

    // Dodanie instancji Supabase do locals
    locals.supabase = supabase;

    // Pobierz sesję
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    


    if (session?.user) {
      // Jeśli mamy sesję, ustaw użytkownika
      locals.user = session.user;
    } else {
      // Jeśli nie ma sesji, ustaw undefined
      locals.user = undefined;
    }
  } catch (error) {
    console.error('Auth middleware - unexpected error:', error);
    locals.user = undefined;
  }

  // Sprawdzenie czy ścieżka wymaga autoryzacji
  const requiresAuth = PROTECTED_PATHS.some(path => url.pathname.startsWith(path));

  // Przekierowanie niezalogowanych użytkowników do strony logowania
  if (requiresAuth && !locals.user) {
    // Zachowanie oryginalnej ścieżki w returnUrl dla przekierowania po logowaniu
    const loginUrl = new URL('/auth/login', url.origin);
    loginUrl.searchParams.set('returnUrl', url.pathname + url.search);
    
    return redirect(loginUrl.toString());
  }

  // Przekierowanie zalogowanych użytkowników ze stron auth do głównej
  const isAuthPath = PUBLIC_PATHS.some(path => 
    path.startsWith('/auth/') && url.pathname === path
  );

  if (isAuthPath && locals.user) {
    return redirect('/');
  }

  // Kontynuuj do następnego middleware lub handlera
  const response = await next();
  return response;
});
