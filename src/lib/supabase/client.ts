import { Database } from '@/types/database.types'
import { createBrowserClient } from '@supabase/ssr'
import { clientEnv } from '@/lib/env/clientEnv'

export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}