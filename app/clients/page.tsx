'use client';
import { useState, useEffect } from 'react';
import AddClientModal from '../../components/AddClientModal';
import ClientCard from '../../components/ClientCard';
import Toast from '../../components/Toast';
import { initialClients, Client } from '../../lib/data/clients';
import { Plus } from 'lucide-react';

const filterTags = ['Tous', 'Prospect', 'Client', 'mariage', 'client-fidele', 'e-commerce', 'corporate', 'startup'];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('clients');
      if (stored) {
        try {
          return JSON.parse(stored) as Client[];
        } catch {
          /* ignore */
        }
      }
    }
    return initialClients;
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (client: Client) => {
    setClients([...clients, client]);
    setToast('Client ajouté avec succès');
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer client ?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const filtered = clients.filter(c => {
    const text = `${c.firstName} ${c.lastName} ${c.company ?? ''}`.toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchFilter = filter === 'Tous'
      ? true
      : filter === 'Client' || filter === 'Prospect'
      ? c.status === filter
      : c.tags.includes(filter);
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-center text-4xl font-bold">Gestion des clients</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </button>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full rounded border px-3 py-1"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filterTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`rounded-full px-3 py-1 text-sm shadow ${filter === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onRefresh={() => alert(`Client actualisé : ${client.lastName}`)}
            onEdit={() => alert(`Modifier client : ${client.lastName}`)}
            onDelete={() => handleDelete(client.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-4 text-center text-gray-500">Aucun client pour le moment</p>
      )}
      <AddClientModal isOpen={showModal} onAdd={addClient} onClose={() => setShowModal(false)} />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
