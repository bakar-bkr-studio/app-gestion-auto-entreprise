'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCard from './DetailedProjectCard';
import DeleteModal from './DeleteModal';
import Toast from './Toast';
import ProjectModal from './ProjectModal';
import { useProjects, Status, Project, PaymentStatus } from './ProjectsProvider';
import { useState as useReactState } from 'react';

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white',
};

export default function ProjectList() {
  const router = useRouter();
  const { projects, deleteProject, toggleFavorite, updateProject } = useProjects();

  const [filterStatus, setFilterStatus] = useState<Status | 'Tous'>('Tous');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'Tous'>('Tous');
  const [sort, setSort] = useState<'date-desc' | 'date-asc' | 'budget-asc' | 'budget-desc' | 'favoris'>('date-desc');
  const [view, setView] = useState<'grid' | 'kanban'>('grid');
  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState<'Tous' | string>('Tous');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const clientOptions = Array.from(new Set(projects.map(p => p.client)));
  const [currentPage, setCurrentPage] = useReactState(1);
  const itemsPerPage = 12;

  const handleEdit = (id: number) => router.push(`/new-project?id=${id}`);

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteProject(deleteId);
      setDeleteId(null);
      setToast('Le projet a bien été supprimé ✅');
    }
  };

  const filtered = projects
    .filter(p => (filterStatus === 'Tous' ? true : p.status === filterStatus))
    .filter(p => (filterPayment === 'Tous' ? true : p.paymentStatus === filterPayment))
    .filter(p => (filterClient === 'Tous' ? true : p.client === filterClient))
    .filter(p =>
      dateFrom ? new Date(p.startDate) >= new Date(dateFrom) : true
    )
    .filter(p => (dateTo ? new Date(p.startDate) <= new Date(dateTo) : true))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    const favDiff = Number(b.isFavorite) - Number(a.isFavorite);
    if (favDiff !== 0) return favDiff;
    if (sort === 'favoris') return 0;
    if (sort === 'budget-asc') return a.budget - b.budget;
    if (sort === 'budget-desc') return b.budget - a.budget;
    if (sort === 'date-asc') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const ordered = sorted;
  
  // Pagination
  const totalPages = Math.ceil(ordered.length / itemsPerPage);
  const paginatedProjects = ordered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderCards = (list: Project[], compact = false) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => handleEdit(project.id)}
          onDelete={() => setDeleteId(project.id)}
          onDuplicate={() => router.push(`/new-project?duplicate=${project.id}`)}
          onToggleFavorite={() => toggleFavorite(project.id)}
          onOpen={() => setActiveProject(project)}
          compact={compact}
        />
      ))}
    </div>
  );

  const renderKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'] as Status[]).map(status => (
        <div key={status} className="space-y-2">
          <h3 className={`rounded px-2 py-1 text-sm font-semibold ${statusColors[status]}`}>{status}</h3>
          {renderCards(ordered.filter(p => p.status === status), true)}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mt-8 mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-center text-4xl font-bold">Mes projets</h1>
        <Link href="/new-project" className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          + Ajouter un projet
        </Link>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full">
          <Input
            aria-label="Rechercher"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 bg-white text-black shadow-sm"
            placeholder="Rechercher..."
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setFilterClient('Tous');
                setFilterStatus('Tous');
                setFilterPayment('Tous');
                setDateFrom('');
                setDateTo('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              ×
            </button>
          )}
        </div>
        <select
          aria-label="Client"
          value={filterClient}
          onChange={e => setFilterClient(e.target.value)}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        >
          <option value="Tous">Tous</option>
          {clientOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Trier"
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        >
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="budget-desc">Montant ↓</option>
          <option value="budget-asc">Montant ↑</option>
          <option value="favoris">Favoris</option>
        </select>
        <select
          aria-label="Paiement"
          value={filterPayment}
          onChange={e => setFilterPayment(e.target.value as any)}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        >
          <option value="Tous">Tous</option>
          <option value="Payé">Payé</option>
          <option value="Acompte">Acompte</option>
          <option value="Non payé">Non payé</option>
        </select>
        <input
          type="date"
          aria-label="Du"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        />
        <input
          type="date"
          aria-label="Au"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        />
        <button
          aria-label="Vue Kanban"
          onClick={() => setView(view === 'grid' ? 'kanban' : 'grid')}
          className="rounded-md border-gray-300 bg-white px-3 py-1 text-black shadow-sm"
        >
          {view === 'grid' ? 'Kanban' : 'Grille'}
        </button>
      </div>
      <div className="mb-4 flex space-x-2 overflow-x-auto">
        {(['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'] as Status[]).map(s => (
          <button
            key={s}
            aria-label={s}
            onClick={() => setFilterStatus(s)}
            className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${filterStatus === s ? statusColors[s] : 'bg-white text-gray-600'}`}
          >
            {s}
          </button>
        ))}
        <button
          aria-label="Tous"
          onClick={() => setFilterStatus('Tous')}
          className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${filterStatus === 'Tous' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
        >
          Tous
        </button>
      </div>
      {view === 'grid' ? (
        <>
          {renderCards(paginatedProjects)}
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
        </>
      ) : (
        renderKanban()
      )}
      <DeleteModal isOpen={deleteId !== null} onCancel={() => setDeleteId(null)} onConfirm={confirmDelete}>
        Voulez-vous vraiment supprimer ce projet ?
      </DeleteModal>
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} onEdit={() => handleEdit(activeProject.id)} />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
