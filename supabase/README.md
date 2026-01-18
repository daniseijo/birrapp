# Configuración de Supabase para Birrapp

## Estructura de archivos

```
supabase/
├── migrations/
│   ├── 001_create_tables.sql    # Tablas principales
│   ├── 002_rls_policies.sql     # Políticas de seguridad
│   └── 003_views.sql            # Vistas para estadísticas
├── seed/
│   └── 001_create_users.md      # Guía para crear usuarios
└── README.md
```

## Pasos para configurar

### 1. Crear las tablas

Ejecuta los archivos SQL en orden en el **SQL Editor** de Supabase:

1. Ve a tu proyecto → **SQL Editor**
2. Copia y pega el contenido de cada archivo en orden:
   - `001_create_tables.sql`
   - `002_rls_policies.sql`
   - `003_views.sql`
3. Click en **Run** para cada uno

### 2. Crear los usuarios

Sigue las instrucciones en `seed/001_create_users.md`

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-publishable-key
```

### 4. (Opcional) Importar datos históricos

Una vez creados los usuarios, puedes importar los datos históricos del Excel.
Ver la sección de importación más abajo.

## Esquema de la base de datos

### Tabla `profiles`
Extiende la tabla de usuarios de Supabase Auth.

| Columna    | Tipo        | Descripción                    |
|------------|-------------|--------------------------------|
| id         | UUID        | FK a auth.users                |
| name       | TEXT        | Nombre visible del usuario     |
| color      | TEXT        | Color para gráficas (#HEX)     |
| created_at | TIMESTAMPTZ | Fecha de creación              |
| updated_at | TIMESTAMPTZ | Última actualización           |

### Tabla `beer_entries`
Registros diarios de consumo.

| Columna    | Tipo        | Descripción                    |
|------------|-------------|--------------------------------|
| id         | UUID        | ID único de la entrada         |
| user_id    | UUID        | FK a profiles                  |
| date       | DATE        | Fecha del registro             |
| beers      | INTEGER     | Número de cervezas             |
| created_at | TIMESTAMPTZ | Fecha de creación              |
| updated_at | TIMESTAMPTZ | Última actualización           |

## Vistas disponibles

- `user_yearly_stats` - Estadísticas anuales por usuario
- `yearly_ranking` - Ranking por año
- `user_weekday_stats` - Estadísticas por día de la semana
- `user_monthly_stats` - Estadísticas mensuales
- `user_range_distribution` - Distribución por rangos (1-2, 3-5, etc.)
- `group_yearly_stats` - Estadísticas del grupo completo

## Importar datos históricos

Para importar datos del Excel, puedes usar un script o el SQL Editor:

```sql
-- Ejemplo de inserción de datos
INSERT INTO public.beer_entries (user_id, date, beers)
VALUES
  ('uuid-del-usuario', '2025-01-01', 3),
  ('uuid-del-usuario', '2025-01-02', 2),
  -- ... más datos
;
```

O crear un script de importación que lea un CSV y lo inserte en Supabase.
