'use client';
import { Client } from '../lib/data/clients';
import { RefreshCw, Pencil, Trash2 } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onRefresh: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClientCard({ client, onRefresh, onEdit, onDelete }: ClientCardProps) {
  const initials = `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`;

  return (
    <div className="rounded border bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{client.firstName} {client.lastName}</p>
          {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
        </div>
        <span className={`rounded px-2 py-1 text-xs ${client.status === 'Client' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>{client.status}</span>
      </div>
      <div className="mt-2 space-y-1 text-sm">
        <a href={`mailto:${client.email}`} className="block text-blue-600 underline">{client.email}</a>
        <p>{client.phone}</p>
        <p>{client.address}</p>
        <p className="text-xs text-gray-500">Ajouté le {client.dateAdded}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {client.tags.map(tag => (
            <span key={tag} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">{tag}</span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-end space-x-2 text-sm">
        <button onClick={onRefresh} className="rounded bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"><RefreshCw size={16} /></button>
        <button onClick={onEdit} className="rounded bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"><Pencil size={16} /></button>
        <button onClick={onDelete} className="rounded bg-red-500 p-1 text-white hover:bg-red-600"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
