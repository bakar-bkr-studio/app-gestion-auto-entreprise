'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCard from './ProjectCard';
import DeleteModal from './DeleteModal';
import Toast from './Toast';
import ProjectModal from './ProjectModal';
import { useProjects, Status, Project, PaymentStatus } from './ProjectsProvider';

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
  const { projects, deleteProject, duplicateProject, toggleFavorite, updateProject } = useProjects();

  const [filterStatus, setFilterStatus] = useState<Status | 'Tous'>('Tous');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'Tous'>('Tous');
  const [sort, setSort] = useState<'date-desc' | 'date-asc' | 'budget-asc' | 'budget-desc' | 'favoris'>('date-desc');
  const [view, setView] = useState<'grid' | 'kanban'>('grid');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'favoris') {
      return Number(b.isFavorite) - Number(a.isFavorite);
    }
    if (sort === 'budget-asc') return a.budget - b.budget;
    if (sort === 'budget-desc') return b.budget - a.budget;
    if (sort === 'date-asc') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const ordered = [...sorted].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

  const renderCards = (list: Project[]) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => handleEdit(project.id)}
          onDelete={() => setDeleteId(project.id)}
          onDuplicate={() => duplicateProject(project.id)}
          onToggleFavorite={() => toggleFavorite(project.id)}
          onOpen={() => setActiveProject(project)}
        />
      ))}
    </div>
  );

  const renderKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'] as Status[]).map(status => (
        <div key={status} className="space-y-2">
          <h3 className={`rounded px-2 py-1 text-sm font-semibold ${statusColors[status]}`}>{status}</h3>
          {renderCards(ordered.filter(p => p.status === status))}
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
        <input
          aria-label="Rechercher"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded border px-3 py-1"
          placeholder="Rechercher..."
        />
        <select
          aria-label="Trier"
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="rounded border px-3 py-1"
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
          className="rounded border px-3 py-1"
        >
          <option value="Tous">Tous</option>
          <option value="Payé">Payé</option>
          <option value="Acompte">Acompte</option>
          <option value="Non payé">Non payé</option>
        </select>
        <button
          aria-label="Vue Kanban"
          onClick={() => setView(view === 'grid' ? 'kanban' : 'grid')}
          className="rounded border px-3 py-1"
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
      {view === 'grid' ? renderCards(ordered) : renderKanban()}
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
