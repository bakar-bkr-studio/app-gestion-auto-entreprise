'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCard from '../../components/ProjectCard';
import DeleteModal from '../../components/DeleteModal';
import Toast from '../../components/Toast';
import { useProjects, Status } from '../../components/ProjectsProvider';

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white',
};


export default function ProjectsPage() {
  const router = useRouter();
  const { projects, deleteProject } = useProjects();
  const [filter, setFilter] = useState<Status | 'Tous'>('Tous');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'startDate' | 'budget'>('startDate');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/new-project?id=${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteProject(deleteId);
      setDeleteId(null);
      setToast('Le projet a bien été supprimé ✅');
    }
  };

  const filtered = projects
    .filter((p) => (filter === 'Tous' ? true : p.status === filter))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'startDate'
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : a.budget - b.budget
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projets récents</h1>
        <Link
          href="/new-project"
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          + Ajouter un projet
        </Link>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          aria-label="Rechercher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border px-3 py-1"
          placeholder="Rechercher..."
        />
        <select
          aria-label="Trier"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'startDate' | 'budget')}
          className="rounded border px-3 py-1"
        >
          <option value="startDate">Par date</option>
          <option value="budget">Par budget</option>
        </select>
      </div>

      <div className="my-6 flex space-x-2 overflow-x-auto">
        {['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'].map((s) => (
          <button
            key={s}
            aria-label={s}
            onClick={() => setFilter(s as Status)}
            className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${
              filter === s ? statusColors[s as Status] : 'bg-white text-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          aria-label="Tous"
          onClick={() => setFilter('Tous')}
          className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${
            filter === 'Tous' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Tous
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => handleEdit(project.id)}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
      </div>
      <DeleteModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      >
        Voulez-vous vraiment supprimer ce projet ?
      </DeleteModal>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
