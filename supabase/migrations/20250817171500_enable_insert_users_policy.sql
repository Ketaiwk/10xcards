-- Umożliwia dodawanie własnego rekordu do tabeli users
CREATE POLICY "Allow insert for own user"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
