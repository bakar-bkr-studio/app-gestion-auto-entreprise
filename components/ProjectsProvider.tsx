'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type Status =
  | 'Conception'
  | 'Tournage'
  | 'Montage'
  | 'Prêt'
  | 'Envoyé'
  | 'Terminé';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface DocumentFile {
  id: number;
  name: string;
  path: string;
}

export type PaymentStatus = 'Payé' | 'Acompte' | 'Non payé';
export type ProjectType = 'Photo' | 'Video';

export interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: Status;
  type: ProjectType;
  paymentStatus: PaymentStatus;
  isFavorite: boolean;
  tasks: Task[];
  notes: string;
  documents: DocumentFile[];
}

type ProjectsContextType = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Omit<Project, 'id'>) => void;
  deleteProject: (id: number) => void;
  duplicateProject: (id: number) => void;
  toggleFavorite: (id: number) => void;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: 1,
    name: 'Mariage Sarah & Tom',
    client: 'Sarah Martin',
    description: 'Couverture photo et vidéo du mariage',
    startDate: '2024-06-10',
    endDate: '2024-06-15',
    budget: 1500,
    status: 'Tournage',
    type: 'Photo',
    paymentStatus: 'Acompte',
    isFavorite: false,
    tasks: [],
    notes: '',
    documents: [],
  },
  {
    id: 2,
    name: "Clip promo Maison d'hôtes",
    client: 'Le Beau Gîte',
    description: "Réalisation d'une vidéo publicitaire",
    startDate: '2024-05-01',
    endDate: '2024-05-02',
    budget: 2000,
    status: 'Montage',
    type: 'Video',
    paymentStatus: 'Non payé',
    isFavorite: false,
    tasks: [],
    notes: '',
    documents: [],
  },
  {
    id: 3,
    name: 'Shooting produits Printemps',
    client: 'Mode & Chic',
    description: 'Photos catalogue printemps',
    startDate: '2024-04-20',
    endDate: '2024-04-22',
    budget: 800,
    status: 'Conception',
    type: 'Photo',
    paymentStatus: 'Payé',
    isFavorite: false,
    tasks: [],
    notes: '',
    documents: [],
  },
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (project: Omit<Project, 'id'>) => {
    const id = projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    setProjects([...projects, { id, ...project }]);
  };

  const updateProject = (id: number, project: Omit<Project, 'id'>) => {
    setProjects(projects.map((p) => (p.id === id ? { id, ...project } : p)));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const duplicateProject = (id: number) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;
    const newId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects([...projects, { ...target, id: newId, name: `${target.name} (copie)` }]);
  };

  const toggleFavorite = (id: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, duplicateProject, toggleFavorite }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
}
