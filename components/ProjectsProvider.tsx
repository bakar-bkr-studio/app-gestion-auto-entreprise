'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

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


export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
      } else if (data) {
        const mapped = data.map((row) => ({
          id: row.id,
          name: row.name,
          client: row.client_name,
          description: row.description,
          startDate: row.start_date,
          endDate: row.end_date,
          budget: row.budget,
          status: row.status as Status,
          type: row.type as ProjectType,
          paymentStatus: row.payment_status as PaymentStatus,
          isFavorite: row.is_favorite ?? false,
          tasks: row.tasks ? JSON.parse(row.tasks) : [],
          notes: row.personal_notes ?? '',
          documents: row.attachments_url ? JSON.parse(row.attachments_url) : [],
        })) as Project[];

        setProjects(mapped);
      }
    };

    fetchProjects();
  }, []);

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
