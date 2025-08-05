import { createClient } from '@supabase/supabase-js'

// Ensure we're accessing environment variables correctly in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug logging to check if env vars are loaded
if (typeof window === 'undefined') {
  console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
  console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'MISSING')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'MISSING')
  throw new Error(
    'Missing Supabase environment variables. Please:\n' +
    '1. Check your .env.local file is in the project root\n' +
    '2. Restart your development server (npm run dev)\n' +
    '3. Clear .next folder if needed'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL:', supabaseUrl)
  throw new Error(
    `Invalid Supabase URL format: ${supabaseUrl}. Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local`
  )
}

// Additional validation to prevent localhost fallback
if (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')) {
  throw new Error(
    `Supabase URL appears to be localhost (${supabaseUrl}). This should be your actual Supabase project URL.`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (url, options = {}) => {
      // Log the actual URL being fetched for debugging
      if (typeof window === 'undefined') {
        console.log('Supabase fetch URL:', url)
      }
      
      // Create timeout signal
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })
    },
  },
})
