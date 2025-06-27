'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProjectCard, { SimpleProject as Project } from '@/components/ProjectCard'


export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else if (data) {
        setProjects(data as Project[])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur : {error}</div>
  }

  if (!loading && projects.length === 0) {
    return <div className="p-6">Aucun projet pour le moment.</div>
  }

  return (
    <div className="space-y-4 p-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
