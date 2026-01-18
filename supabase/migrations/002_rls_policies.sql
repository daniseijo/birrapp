-- =============================================
-- BIRRAPP: Row Level Security (RLS) Policies
-- =============================================

-- Habilitar RLS en las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beer_entries ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Políticas para profiles
-- =============================================

-- Todos los usuarios autenticados pueden ver todos los perfiles
-- (necesario para ver el ranking y comparativas)
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir lectura pública de profiles (para desarrollo/demo)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- Políticas para beer_entries
-- =============================================

-- Todos los usuarios autenticados pueden ver todas las entradas
-- (necesario para estadísticas grupales y comparativas)
CREATE POLICY "Beer entries are viewable by authenticated users"
  ON public.beer_entries
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir lectura pública de beer_entries (para desarrollo/demo)
CREATE POLICY "Beer entries are viewable by everyone"
  ON public.beer_entries
  FOR SELECT
  TO anon
  USING (true);

-- Los usuarios solo pueden insertar sus propias entradas
CREATE POLICY "Users can insert own beer entries"
  ON public.beer_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias entradas
CREATE POLICY "Users can update own beer entries"
  ON public.beer_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propias entradas
CREATE POLICY "Users can delete own beer entries"
  ON public.beer_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
