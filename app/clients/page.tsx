'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import AddClientModal from '../../components/AddClientModal'
import ClientCard from '../../components/ClientCard'
import Toast from '../../components/Toast'
import { useClients, Client } from '@/components/ClientsProvider'
import { Plus, Search } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { cn } from '../../components/lib/utils'

const filterTags = ['Prospect', 'Client', 'mariage', 'client-fidele', 'e-commerce', 'corporate', 'startup'];
const dateFilters = ['Tous', 'Ce mois-ci', '30 derniers jours', 'Depuis le début']

export default function ClientsPage() {
  const { clients, loading, addClient } = useClients();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState('Tous')
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const addClientHandler = async (client: Omit<Client, 'id' | 'created_at'>) => {
    await addClient(client);
    setToast('Client ajouté avec succès');
  };

  const updateClient = (client: Client) => {
    // TODO: mettre à jour le client dans Supabase
    setToast('Client modifié avec succès');
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer client ?')) {
      // TODO: supprimer le client dans Supabase
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const filtered = clients.filter(c => {
    const text = `${c.first_name} ${c.last_name} ${c.company ?? ''}`.toLowerCase()
    const matchSearch = text.includes(search.toLowerCase())
    const matchFilters =
      filters.length === 0 ||
      filters.every(f =>
        f === 'Client' || f === 'Prospect'
          ? c.status === f
          : c.tags.includes(f)
      )
    const matchDate = (() => {
      if (dateFilter === 'Tous') return true
      const date = new Date(c.created_at)
      const now = new Date()
      if (dateFilter === 'Ce mois-ci') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }
      if (dateFilter === '30 derniers jours') {
        const diff = now.getTime() - date.getTime()
        return diff / (1000 * 60 * 60 * 24) <= 30
      }
      return true
    })()
    return matchSearch && matchFilters && matchDate
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedClients = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-center text-4xl font-bold">Gestion des clients</h1>
        <Button
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Ajouter un client
        </Button>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <motion.span
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="h-4 w-4" />
          </motion.span>
          <Input
            aria-label="Rechercher un client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-8"
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filterTags.map(tag => (
          <motion.button
            key={tag}
            type="button"
            className={cn(
              'rounded-full border px-3 py-1 text-sm',
              filters.includes(tag) ? 'bg-primary/20' : ''
            )}
            onClick={() =>
              setFilters(f =>
                f.includes(tag) ? f.filter(t => t !== tag) : [...f, tag]
              )
            }
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {dateFilters.map(df => (
          <motion.button
            key={df}
            type="button"
            className={cn(
              'rounded-full border px-3 py-1 text-sm',
              dateFilter === df ? 'bg-primary/20' : ''
            )}
            onClick={() => setDateFilter(df)}
            whileTap={{ scale: 0.95 }}
          >
            {df}
          </motion.button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={() => handleEdit(client)}
            onDelete={() => handleDelete(client.id)}
          />
        ))}
      </div>
      {paginatedClients.length === 0 && (
        <p className="mt-4 text-center text-gray-500">Aucun client pour le moment</p>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
      <AddClientModal
        isOpen={showModal}
        client={editingClient ?? undefined}
        onAdd={addClientHandler}
        onUpdate={updateClient}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
      <Button
        onClick={() => {
          setEditingClient(null)
          setShowModal(true)
        }}
        size="icon"
        className="fixed bottom-4 right-4 z-10 rounded-full sm:hidden"
      >
        <Plus />
      </Button>
    </div>
  );
}
