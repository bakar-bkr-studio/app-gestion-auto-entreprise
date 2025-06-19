'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaCamera } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  date: string;
  budget: number;
  status: Status;
}

type Status =
  | 'Conception'
  | 'Tournage'
  | 'Montage'
  | 'Prêt'
  | 'Envoyé'
  | 'Terminé';

const sampleProjects: Project[] = [
  {
    id: 1,
    name: 'Mariage Sarah & Tom',
    client: 'Sarah Martin',
    description: 'Couverture photo et vidéo du mariage',
    date: '2024-06-15',
    budget: 1500,
    status: 'Tournage',
  },
  {
    id: 2,
    name: "Clip promo Maison d'hôtes",
    client: 'Le Beau Gîte',
    description: "Réalisation d'une vidéo publicitaire",
    date: '2024-05-01',
    budget: 2000,
    status: 'Montage',
  },
  {
    id: 3,
    name: 'Shooting produits Printemps',
    client: 'Mode & Chic',
    description: 'Photos catalogue printemps',
    date: '2024-04-20',
    budget: 800,
    status: 'Conception',
  },
];

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white',
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Status | 'Tous'>('Tous');

  const handleEdit = (id: number) => {
    console.log('edit', id);
  };

  const handleDelete = (id: number) => {
    console.log('delete', id);
  };

  const filtered =
    filter === 'Tous' ? sampleProjects : sampleProjects.filter((p) => p.status === filter);

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

      <div className="my-6 flex space-x-2 overflow-x-auto">
        {['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as Status)}
            className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${
              filter === s ? statusColors[s as Status] : 'bg-white text-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={() => setFilter('Tous')}
          className={`whitespace-nowrap rounded px-3 py-1 text-sm font-medium shadow ${
            filter === 'Tous' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Tous
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <div key={project.id} className="rounded-lg bg-white p-4 shadow hover:shadow-md">
            <div className="flex items-center space-x-2">
              <FaCamera className="text-xl text-gray-500" />
              <h2 className="text-lg font-semibold">{project.name}</h2>
            </div>
            <p className="text-sm text-gray-600">Client : {project.client}</p>
            <p className="mt-2 text-sm text-gray-700">{project.description}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1 text-gray-600">
                <span role="img" aria-label="date">
                  📅
                </span>
                <span>{project.date}</span>
              </span>
              <span className="flex items-center space-x-1 text-green-600">
                <span role="img" aria-label="budget">
                  💶
                </span>
                <span>{project.budget}</span>
              </span>
            </div>
            <span
              className={`mt-2 inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(project.id)}
                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
