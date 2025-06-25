'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '../../components/ProjectsProvider';
import Toast from '../../components/Toast';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { Input } from '../../components/ui/input';

interface Task {
  id: number;
  title: string;
  project?: string;
  description?: string;
  createdAt: string;
  dueDate: string;
  priority: 'Urgente' | 'Normale' | 'Faible';
  status: 'En cours' | 'Terminée';
}

interface Note {
  id: number;
  title: string;
  text: string;
  tags: string[];
  createdAt: string;
}

export default function OrganisationPage() {
  const { projects } = useProjects();
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        try {
          return JSON.parse(stored) as Task[];
        } catch {
          /* ignore */
        }
      }
    }
    return [];
  });
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('notes');
      if (stored) {
        try {
          return JSON.parse(stored) as Note[];
        } catch {
          /* ignore */
        }
      }
    }
    return [];
  });
  const [taskFilter, setTaskFilter] = useState<'En cours' | 'Terminées' | 'Toutes'>('En cours');
  const [projectFilter, setProjectFilter] = useState<string>('Tous');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [noteSearch, setNoteSearch] = useState('');
  const [noteFilter, setNoteFilter] = useState('Toutes');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const id = Date.now();
    const createdAt = new Date().toISOString().split('T')[0];
    const newTask: Task = { id, status: 'En cours', createdAt, ...task };
    setTasks([newTask, ...tasks]);
    setToast('Tâche ajoutée');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Terminée' ? 'En cours' : 'Terminée' } : t));
  };

  const deleteTask = (id: number) => {
    if (confirm('Supprimer cette tâche ?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const id = Date.now();
    const createdAt = new Date().toISOString().split('T')[0];
    const newNote: Note = { id, createdAt, ...note };
    setNotes([newNote, ...notes]);
    setToast('Note ajoutée');
  };

  const deleteNote = (id: number) => {
    if (confirm('Supprimer cette note ?')) {
      setNotes(notes.filter(n => n.id !== id));
      setToast('Note supprimée');
    }
  };

  const filteredTasks = tasks
    .filter(t => (taskFilter === 'Toutes' ? true : t.status === taskFilter))
    .filter(t => (projectFilter === 'Tous' ? true : t.project === projectFilter))
    .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'Urgente' ? -1 : b.priority === 'Urgente' ? 1 : 0));

  const filteredNotes = notes
    .filter(n => (noteFilter === 'Toutes' ? true : n.tags.includes(noteFilter)))
    .filter(n => n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.text.toLowerCase().includes(noteSearch.toLowerCase()));

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <div className="space-y-6 p-6">
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Tâches</h2>
          <div className="flex flex-wrap items-center gap-2">
            {(['En cours', 'Terminées', 'Toutes'] as const).map(status => (
              <button
                key={status}
                onClick={() => setTaskFilter(status)}
                className={`rounded-md px-3 py-1 text-sm transition-colors ${taskFilter === status ? 'bg-black text-white' : 'bg-white text-black border border-gray-300'}`}
              >
                {status}
              </button>
            ))}
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="rounded-md border-gray-300 bg-white px-2 py-1 text-sm text-black shadow-sm"
            >
              <option value="Tous">Tous les projets</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center rounded-lg bg-black px-4 py-2 text-white shadow hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
            </button>
          </div>
        </header>
        <div className="space-y-4">
          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-400">Aucune tâche pour le moment</p>
          )}
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow transition-transform hover:scale-105"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={task.status === 'Terminée'}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div>
                  <h3 className={`font-medium ${task.status === 'Terminée' ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                  {task.project && <p className="text-sm text-blue-600">{task.project}</p>}
                  {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
                  <p className="text-xs text-gray-500">Créée le {task.createdAt} - échéance <span className={new Date(task.dueDate) < new Date() ? 'text-red-500' : ''}>{task.dueDate}</span></p>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    <span className={`rounded px-2 py-0.5 ${task.priority === 'Urgente' ? 'bg-red-100 text-red-800' : task.priority === 'Normale' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">{task.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => alert('Edit task')} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} /></button>
                <button onClick={() => deleteTask(task.id)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={noteSearch}
              onChange={e => setNoteSearch(e.target.value)}
              placeholder="Rechercher dans les notes..."
              className="rounded-md border-gray-300 bg-white text-black px-3 py-1 text-sm shadow-sm"
            />
            {['Toutes', ...allTags].map(tag => (
              <button
                key={tag}
                onClick={() => setNoteFilter(tag)}
                className={`rounded px-3 py-1 text-sm transition-colors ${noteFilter === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {tag}
              </button>
            ))}
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center rounded-lg bg-black px-4 py-2 text-white shadow hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter une note
            </button>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length === 0 && (
            <p className="text-center text-gray-400 sm:col-span-2 lg:col-span-3">Aucune note</p>
          )}
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow transition-transform hover:scale-105"
            >
              <div className="absolute right-2 top-2 flex space-x-2">
                <button onClick={() => alert('Edit note')} className="rounded p-1 hover:bg-gray-100"><Pencil size={16} /></button>
                <button onClick={() => deleteNote(note.id)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
              <h3 className="mb-1 font-bold">{note.title}</h3>
              <p className="flex-1 whitespace-pre-wrap text-sm text-gray-700">{note.text}</p>
              <p className="mt-2 text-xs text-gray-500">{note.createdAt}</p>
              <div className="mt-1 flex flex-wrap gap-1 text-xs">
                {note.tags.map(tag => (
                  <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {showTaskModal && (
        <TaskModal
          projects={projects.map(p => p.name)}
          onAdd={addTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showNoteModal && (
        <NoteModal onAdd={addNote} onClose={() => setShowNoteModal(false)} />
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

interface TaskModalProps {
  projects: string[];
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
}

function TaskModal({ projects, onAdd, onClose }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Urgente' | 'Normale' | 'Faible'>('Normale');

  const submit = () => {
    if (!title) return;
    onAdd({ title, project: project || undefined, description, dueDate, priority });
    onClose();
    setTitle('');
    setProject('');
    setDescription('');
    setDueDate('');
    setPriority('Normale');
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ajouter une tâche</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Titre</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" rows={3} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Projet lié</label>
            <select value={project} onChange={e => setProject(e.target.value)} className="w-full rounded border px-3 py-2">
              <option value="">Aucun</option>
              {projects.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['Faible', 'Normale', 'Urgente'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`rounded px-3 py-1 text-sm ${priority === p ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Date d'échéance</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="rounded border px-4 py-1 hover:bg-gray-100">Annuler</button>
          <button onClick={submit} className="rounded bg-black px-4 py-1 text-white hover:bg-gray-800">Ajouter</button>
        </div>
      </div>
    </div>
  );
}

interface NoteModalProps {
  onAdd: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function NoteModal({ onAdd, onClose }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');

  const submit = () => {
    if (!title) return;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    onAdd({ title, text, tags: tagList });
    onClose();
    setTitle('');
    setText('');
    setTags('');
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ajouter une note</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Titre</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full rounded border px-3 py-2" rows={4} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags (séparés par des virgules)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="rounded border px-4 py-1 hover:bg-gray-100">Annuler</button>
          <button onClick={submit} className="rounded bg-black px-4 py-1 text-white hover:bg-gray-800">Ajouter</button>
        </div>
      </div>
    </div>
  );
}

