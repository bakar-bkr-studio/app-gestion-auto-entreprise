'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestPage() {
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*')
      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        console.log('Projects:', data)
      }
    }

    fetchProjects()
  }, [])

  return <div>Check console for projects.</div>
}
