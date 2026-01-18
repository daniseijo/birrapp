# Crear usuarios iniciales en Supabase

Los usuarios se crean a través de la **Authentication** de Supabase, no directamente en SQL.

## Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en Supabase
2. Click en **Authentication** en el menú lateral
3. Click en **Users** → **Add User** → **Create new user**
4. Para cada usuario, ingresa:

| Nombre   | Email                    | Contraseña    | Color (metadata) |
|----------|--------------------------|---------------|------------------|
| Seijo    | seijo@birrapp.local      | (tu elección) | #F59E0B          |
| José     | jose@birrapp.local       | (tu elección) | #EF4444          |
| Carlos   | carlos@birrapp.local     | (tu elección) | #3B82F6          |
| Dani M   | danim@birrapp.local      | (tu elección) | #10B981          |
| Javi     | javi@birrapp.local       | (tu elección) | #8B5CF6          |

5. En **User Metadata** (JSON), añade:
```json
{
  "name": "Seijo",
  "color": "#F59E0B"
}
```

## Opción 2: Script con Supabase Admin API

Puedes ejecutar este script en Node.js para crear los usuarios programáticamente.
Necesitas la **service_role key** (secret key) para esto.

```typescript
// scripts/create-users.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANTE: usar service_role, no anon
)

const users = [
  { email: 'seijo@birrapp.local', name: 'Seijo', color: '#F59E0B', password: 'changeme123' },
  { email: 'jose@birrapp.local', name: 'José', color: '#EF4444', password: 'changeme123' },
  { email: 'carlos@birrapp.local', name: 'Carlos', color: '#3B82F6', password: 'changeme123' },
  { email: 'danim@birrapp.local', name: 'Dani M', color: '#10B981', password: 'changeme123' },
  { email: 'javi@birrapp.local', name: 'Javi', color: '#8B5CF6', password: 'changeme123' },
]

async function createUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: user.name,
        color: user.color,
      },
    })

    if (error) {
      console.error(`Error creating ${user.name}:`, error.message)
    } else {
      console.log(`Created user: ${user.name} (${data.user.id})`)
    }
  }
}

createUsers()
```

## Configuración de autenticación

En Supabase Dashboard → Authentication → Providers:

1. **Desactiva** "Confirm email" si quieres que los usuarios puedan entrar directamente
2. O mantén el flujo de confirmación si prefieres validar emails

En Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (desarrollo) / tu dominio en producción
- Redirect URLs: `http://localhost:3000/auth/callback`
