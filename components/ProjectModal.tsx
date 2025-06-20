'use client';
import { useState } from 'react';
import { Project, Task, DocumentFile, useProjects, Status } from './ProjectsProvider';
import DeleteModal from './DeleteModal';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

const steps: Status[] = ['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'];

export default function ProjectModal({ project, onClose, onEdit }: ProjectModalProps) {
  const { updateProject, deleteProject } = useProjects();
  const [taskText, setTaskText] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask: Task = { id: Date.now(), text: taskText, completed: false };
    updateProject(project.id, { ...project, tasks: [...project.tasks, newTask] });
    setTaskText('');
  };
  const toggleTask = (id: number) => {
    const tasks = project.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    updateProject(project.id, { ...project, tasks });
  };
  const removeTask = (id: number) => {
    const tasks = project.tasks.filter(t => t.id !== id);
    updateProject(project.id, { ...project, tasks });
  };
  const saveNotes = (notes: string) => {
    updateProject(project.id, { ...project, notes });
  };
  const addDocument = (file: File | null) => {
    if (!file) return;
    const doc: DocumentFile = { id: Date.now(), name: file.name, path: file.name };
    updateProject(project.id, { ...project, documents: [...project.documents, doc] });
  };
  const removeDocument = (id: number) => {
    const documents = project.documents.filter(d => d.id !== id);
    updateProject(project.id, { ...project, documents });
  };
  const confirmDelete = () => {
    deleteProject(project.id);
    setShowDelete(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 overflow-auto">
      <div className="m-4 w-full max-w-2xl space-y-6 rounded-lg bg-gray-900 p-6 text-gray-100 shadow-lg">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold flex-1 text-center">{project.name}</h2>
          <button onClick={onClose} className="ml-4 text-xl">❌</button>
        </div>
        <div className="space-y-4">
          <div className="space-x-2 flex flex-wrap justify-center">
            {steps.map((s) => (
              <span
                key={s}
                className={`flex items-center space-x-1 text-sm ${
                  steps.indexOf(s) <= steps.indexOf(project.status) ? 'text-green-400' : 'text-gray-500'
                }`}
              >
                <span>{steps.indexOf(s) < steps.indexOf(project.status) ? '✔️' : steps.indexOf(s) === steps.indexOf(project.status) ? '⚪️' : '⚪️'}</span>
                <span>{s}{s === project.status && ' (En cours)'}</span>
              </span>
            ))}
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Tâches</h3>
            <div className="space-y-2">
              {project.tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
                    <span className={t.completed ? 'line-through text-gray-400' : ''}>{t.text}</span>
                  </label>
                  <button onClick={() => removeTask(t.id)} className="text-red-400">🗑️</button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="flex-1 rounded border border-gray-700 bg-gray-800 px-2 py-1"
                />
                <button onClick={addTask} className="rounded bg-blue-600 px-3 text-white">➕</button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Notes personnelles</h3>
            <textarea
              defaultValue={project.notes}
              onBlur={(e) => saveNotes(e.target.value)}
              className="w-full rounded border border-gray-700 bg-gray-800 p-2"
            />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Documents liés</h3>
            <ul className="space-y-1">
              {project.documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <a href={d.path} className="text-blue-400 underline" target="_blank" rel="noreferrer">
                    {d.name}
                  </a>
                  <button onClick={() => removeDocument(d.id)} className="text-red-400">🗑️</button>
                </li>
              ))}
            </ul>
            <input
              type="file"
              onChange={(e) => addDocument(e.target.files ? e.target.files[0] : null)}
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button onClick={onEdit} className="rounded bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400 sm:w-auto w-full">✏️ Modifier</button>
          <button onClick={() => setShowDelete(true)} className="rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 sm:w-auto w-full">🗑️ Supprimer</button>
        </div>
      </div>
      <DeleteModal
        isOpen={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      >Voulez-vous vraiment supprimer ce projet ?</DeleteModal>
    </div>
  );
}
