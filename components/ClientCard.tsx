'use client';
import { Client } from '../lib/data/clients'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const initials = `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`;

  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">
            {client.firstName} {client.lastName}
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
        {client.phone && <p>{client.phone}</p>}
        {client.address && <p>{client.address}</p>}
        <p className="text-xs text-muted-foreground">Ajouté le {client.dateAdded}</p>
        {client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {client.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
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
