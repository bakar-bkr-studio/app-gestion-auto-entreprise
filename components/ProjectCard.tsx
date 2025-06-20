'use client';
import { FaCamera } from 'react-icons/fa';
import { Project, Status } from './ProjectsProvider';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white',
};

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-800">
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
          <span>{project.startDate}</span>
        </span>
        <span className="flex items-center space-x-1 text-green-600">
          <span role="img" aria-label="budget">
            💶
          </span>
          <span>{project.budget}</span>
        </span>
      </div>
      <span className={`mt-2 inline-block rounded px-2 py-1 text-xs font-semibold ${statusColors[project.status]}`}>{project.status}</span>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={onEdit}
          className="flex items-center space-x-1 rounded border border-yellow-500 px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400"
        >
          <span>✏️</span>
          <span>Modifier</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center space-x-1 rounded border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400"
        >
          <span>🗑️</span>
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  );
}
