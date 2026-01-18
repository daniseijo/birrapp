-- =============================================
-- BIRRAPP: Vistas para estadísticas
-- =============================================
-- Nota: Las vistas usan SECURITY INVOKER (por defecto), lo que significa
-- que respetan las políticas RLS de las tablas subyacentes (profiles, beer_entries).
-- Como todos los usuarios autenticados pueden leer esas tablas, las vistas
-- funcionarán correctamente para mostrar estadísticas grupales.

-- Vista con estadísticas anuales por usuario
-- days_active solo cuenta días donde beers > 0
-- avg_daily se calcula sobre TODOS los días con entrada (incluyendo días con 0)
CREATE OR REPLACE VIEW public.user_yearly_stats AS
SELECT
  p.id AS user_id,
  p.name,
  p.color,
  EXTRACT(YEAR FROM be.date)::INTEGER AS year,
  COUNT(DISTINCT CASE WHEN be.beers > 0 THEN be.date END) AS days_active,
  COALESCE(SUM(be.beers), 0) AS total_beers,
  COALESCE(
    ROUND(
      SUM(be.beers)::NUMERIC / NULLIF(COUNT(DISTINCT be.date), 0),
      2
    ),
    0
  ) AS avg_daily,
  COALESCE(MAX(be.beers), 0) AS max_daily,
  MIN(be.date) AS first_entry,
  MAX(be.date) AS last_entry
FROM public.profiles p
LEFT JOIN public.beer_entries be ON p.id = be.user_id
GROUP BY p.id, p.name, p.color, EXTRACT(YEAR FROM be.date);

-- Vista con ranking por año
CREATE OR REPLACE VIEW public.yearly_ranking AS
SELECT
  user_id,
  name,
  color,
  year,
  total_beers,
  avg_daily,
  days_active,
  RANK() OVER (PARTITION BY year ORDER BY total_beers DESC) AS position
FROM public.user_yearly_stats
WHERE year IS NOT NULL;

-- Vista con estadísticas por día de la semana
CREATE OR REPLACE VIEW public.user_weekday_stats AS
SELECT
  p.id AS user_id,
  p.name,
  EXTRACT(YEAR FROM be.date)::INTEGER AS year,
  EXTRACT(DOW FROM be.date)::INTEGER AS day_of_week, -- 0=Sunday, 6=Saturday
  TO_CHAR(be.date, 'Day') AS day_name,
  COUNT(*) AS days_count,
  COALESCE(SUM(be.beers), 0) AS total_beers,
  COALESCE(ROUND(AVG(be.beers)::NUMERIC, 2), 0) AS avg_beers
FROM public.profiles p
JOIN public.beer_entries be ON p.id = be.user_id
GROUP BY p.id, p.name, EXTRACT(YEAR FROM be.date), EXTRACT(DOW FROM be.date), TO_CHAR(be.date, 'Day');

-- Vista con estadísticas mensuales
CREATE OR REPLACE VIEW public.user_monthly_stats AS
SELECT
  p.id AS user_id,
  p.name,
  EXTRACT(YEAR FROM be.date)::INTEGER AS year,
  EXTRACT(MONTH FROM be.date)::INTEGER AS month,
  TO_CHAR(be.date, 'Month') AS month_name,
  COUNT(DISTINCT be.date) AS days_active,
  COALESCE(SUM(be.beers), 0) AS total_beers,
  COALESCE(ROUND(AVG(be.beers)::NUMERIC, 2), 0) AS avg_daily,
  COALESCE(MAX(be.beers), 0) AS max_daily
FROM public.profiles p
JOIN public.beer_entries be ON p.id = be.user_id
GROUP BY p.id, p.name, EXTRACT(YEAR FROM be.date), EXTRACT(MONTH FROM be.date), TO_CHAR(be.date, 'Month');

-- Vista con distribución por rangos de consumo (incluye días con 0 cervezas)
CREATE OR REPLACE VIEW public.user_range_distribution AS
SELECT
  p.id AS user_id,
  p.name,
  EXTRACT(YEAR FROM be.date)::INTEGER AS year,
  CASE
    WHEN be.beers = 0 THEN '0'
    WHEN be.beers BETWEEN 1 AND 2 THEN '1-2'
    WHEN be.beers BETWEEN 3 AND 5 THEN '3-5'
    WHEN be.beers BETWEEN 6 AND 9 THEN '6-9'
    WHEN be.beers >= 10 THEN '10+'
  END AS range_label,
  COUNT(*) AS days_count
FROM public.profiles p
JOIN public.beer_entries be ON p.id = be.user_id
GROUP BY p.id, p.name, EXTRACT(YEAR FROM be.date),
  CASE
    WHEN be.beers = 0 THEN '0'
    WHEN be.beers BETWEEN 1 AND 2 THEN '1-2'
    WHEN be.beers BETWEEN 3 AND 5 THEN '3-5'
    WHEN be.beers BETWEEN 6 AND 9 THEN '6-9'
    WHEN be.beers >= 10 THEN '10+'
  END;

-- Vista para estadísticas del grupo por año
CREATE OR REPLACE VIEW public.group_yearly_stats AS
SELECT
  EXTRACT(YEAR FROM be.date)::INTEGER AS year,
  COUNT(DISTINCT be.user_id) AS active_users,
  COUNT(DISTINCT be.date) AS days_with_entries,
  COALESCE(SUM(be.beers), 0) AS total_group_beers,
  COALESCE(ROUND(AVG(be.beers)::NUMERIC, 2), 0) AS avg_daily_per_entry,
  COALESCE(MAX(be.beers), 0) AS max_single_entry
FROM public.beer_entries be
GROUP BY EXTRACT(YEAR FROM be.date);
