'use client';
import { Client } from '@/components/ClientsProvider'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { stringToHslColor } from './lib/utils'

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const initials = `${client.first_name.charAt(0)}${client.last_name.charAt(0)}`
  const bg = stringToHslColor(client.first_name + client.last_name)

  return (
    <Card className="mx-auto w-full max-w-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-primary-foreground"
          style={{ backgroundColor: bg }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">
            {client.first_name} {client.last_name}
          </CardTitle>
          {client.company && (
            <p className="text-sm text-muted-foreground">{client.company}</p>
          )}
        </div>
        <span
          className={`rounded px-2 py-1 text-xs ${client.status === 'Client' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
        >
          {client.status}
        </span>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        {client.email && (
          <a
            href={`mailto:${client.email}`}
            className="block break-words text-primary underline"
          >
            {client.email}
          </a>
        )}
        {client.phone && <p className="text-muted-foreground">{client.phone}</p>}
        {client.address && <p className="text-muted-foreground">{client.address}</p>}
        <div className="my-2 h-px bg-border" />
        <p className="text-xs text-muted-foreground">
          Ajouté le {new Date(client.created_at).toLocaleDateString()}
        </p>
        {client.tags.split(',').filter(t => t.trim()).length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {client.tags
              .split(',')
              .map(t => t.trim())
              .filter(Boolean)
              .map(tag => (
                <Badge key={tag} className="animate-in fade-in-0 zoom-in-95" variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end space-x-2 pt-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onEdit}
          aria-label="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={onDelete}
          aria-label="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
