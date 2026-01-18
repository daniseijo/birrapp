/**
 * Script para importar datos de cervezas desde un CSV
 *
 * Uso:
 *   pnpm tsx scripts/import-beers.ts <archivo.csv>
 *
 * Formato del CSV esperado:
 *   date,seijo,jose,carlos,danim,javi
 *   2025-01-01,3,2,4,1,0
 *   2025-01-02,2,3,2,2,1
 *   ...
 *
 * Requiere:
 *   - SUPABASE_SECRET_KEY en .env.local (NO la publishable key)
 *   - Los usuarios ya deben existir en Supabase Auth
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !secretKey) {
  console.error('Error: Faltan variables de entorno')
  console.error('Asegúrate de tener en .env.local:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('  SUPABASE_SECRET_KEY=...')
  process.exit(1)
}

// Cliente con secret key (bypasea RLS)
const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Mapeo de nombres de columna a emails de usuario
const USER_EMAIL_MAP: Record<string, string> = {
  seijo: 'seijo@birrapp.local',
  jose: 'jose@birrapp.local',
  carlos: 'carlos@birrapp.local',
  danim: 'danim@birrapp.local',
  javi: 'javi@birrapp.local',
}

interface CsvRow {
  date: string
  [key: string]: string
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.error('Error listing users:', error.message)
    return null
  }

  const users = data.users as Array<{ id: string; email?: string }>
  const user = users.find((u) => u.email === email)
  return user?.id || null
}

async function importFromCsv(filePath: string) {
  console.log(`\n📂 Leyendo archivo: ${filePath}\n`)

  // Leer y parsear CSV
  const fileContent = readFileSync(filePath, 'utf-8')
  const records: CsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`📊 Encontradas ${records.length} filas\n`)

  // Obtener IDs de usuarios
  console.log('👥 Obteniendo IDs de usuarios...')
  const userIdMap: Record<string, string> = {}

  for (const [columnName, email] of Object.entries(USER_EMAIL_MAP)) {
    const userId = await getUserIdByEmail(email)
    if (userId) {
      userIdMap[columnName] = userId
      console.log(`   ✓ ${columnName} -> ${userId.slice(0, 8)}...`)
    } else {
      console.log(`   ✗ ${columnName} (${email}) - Usuario no encontrado`)
    }
  }

  const foundUsers = Object.keys(userIdMap)
  if (foundUsers.length === 0) {
    console.error('\n❌ No se encontraron usuarios. Asegúrate de crearlos primero.')
    process.exit(1)
  }

  // Preparar datos para inserción
  console.log('\n📝 Preparando datos para inserción...')

  const entries: { user_id: string; date: string; beers: number }[] = []

  for (const row of records) {
    const date = row.date

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.warn(`   ⚠ Fecha inválida: ${date}, saltando fila`)
      continue
    }

    for (const [columnName, userId] of Object.entries(userIdMap)) {
      const beersStr = row[columnName]
      if (beersStr === undefined || beersStr === '') continue

      const beers = parseInt(beersStr, 10)
      if (isNaN(beers) || beers < 0) {
        console.warn(`   ⚠ Valor inválido para ${columnName} en ${date}: ${beersStr}`)
        continue
      }

      // Insertar también días con 0 cervezas para calcular la media correctamente
      entries.push({ user_id: userId, date, beers })
    }
  }

  console.log(`   Total de entradas a insertar: ${entries.length}`)

  // Insertar en lotes
  const BATCH_SIZE = 500
  let inserted = 0
  let errors = 0

  console.log('\n🚀 Insertando datos...\n')

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)

    const { error } = await supabase.from('beer_entries').upsert(batch, {
      onConflict: 'user_id,date',
      ignoreDuplicates: false,
    })

    if (error) {
      console.error(`   ❌ Error en lote ${i / BATCH_SIZE + 1}:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      process.stdout.write(`   Progreso: ${inserted}/${entries.length}\r`)
    }
  }

  console.log(`\n\n✅ Importación completada`)
  console.log(`   - Insertadas: ${inserted} entradas`)
  console.log(`   - Errores: ${errors} entradas`)
}

// Ejecutar
const csvFile = process.argv[2]

if (!csvFile) {
  console.log('Uso: pnpm tsx scripts/import-beers.ts <archivo.csv>')
  console.log('')
  console.log('Formato del CSV:')
  console.log('  date,seijo,jose,carlos,danim,javi')
  console.log('  2025-01-01,3,2,4,1,0')
  console.log('  2025-01-02,2,3,2,2,1')
  process.exit(1)
}

importFromCsv(csvFile).catch(console.error)
