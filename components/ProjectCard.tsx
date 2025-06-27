'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderIcon } from 'lucide-react'

export interface SimpleProject {
  id: string | number
  name: string
  status: string
  created_at: string
}

const statusVariant = (status: string) => {
  if (status === 'Terminé') return 'secondary'
  if (status === 'En pause') return 'destructive'
  return 'default'
}

export default function ProjectCard({ project }: { project: SimpleProject }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderIcon className="h-5 w-5" />
          {project.name}
        </CardTitle>
        <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Créé le {new Date(project.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
