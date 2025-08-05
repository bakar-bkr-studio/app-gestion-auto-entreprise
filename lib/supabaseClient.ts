import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid Supabase URL format: ${supabaseUrl}. Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // Add timeout to prevent hanging connections
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
    },
  },
})
