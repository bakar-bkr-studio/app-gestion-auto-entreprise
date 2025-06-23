'use client';
import { Camera, Video, Banknote, Star, Copy, Calendar, Pen, Trash } from 'lucide-react';
import { Project, Status } from './ProjectsProvider';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white',
};

const paymentColors = {
  'Payé': 'bg-emerald-100 text-emerald-700',
  'Acompte': 'bg-orange-100 text-orange-700',
  'Non payé': 'bg-red-100 text-red-700',
};

export default function ProjectCard({ project, onEdit, onDelete, onDuplicate, onToggleFavorite, onOpen }: ProjectCardProps) {
  return (
    <div
      onClick={onOpen}
      className="relative cursor-pointer rounded-xl bg-gray-800 p-6 text-gray-100 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
    >
      <button
        aria-label={project.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute right-2 top-2 rounded p-1 hover:bg-gray-700"
      >
        <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
      </button>
      <div className="flex items-center space-x-2">
        {project.type === 'Photo' ? <Camera className="h-5 w-5 text-gray-400" /> : <Video className="h-5 w-5 text-gray-400" />}
        <h2 className="text-lg font-semibold">{project.name}</h2>
      </div>
      <p className="text-sm text-gray-300">Client : {project.client}</p>
      <p className="mt-2 text-sm text-gray-200">{project.description}</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="flex items-center space-x-1 text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>{project.startDate}</span>
        </span>
        <span className="flex items-center space-x-1 text-green-400">
          <Banknote className="h-4 w-4" />
          <span className="text-sm">{project.budget} €</span>
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusColors[project.status]}`}>{project.status}</span>
        <span className={`rounded px-2 py-1 text-xs font-semibold ${paymentColors[project.paymentStatus]}`}>{project.paymentStatus}</span>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          aria-label="Modifier"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="rounded border border-yellow-500 p-1 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400"
        >
          <Pen className="h-4 w-4" />
        </button>
        <button
          aria-label="Dupliquer"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="rounded border border-gray-500 p-1 text-gray-300 hover:bg-gray-700"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          aria-label="Supprimer"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded border border-red-500 p-1 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
