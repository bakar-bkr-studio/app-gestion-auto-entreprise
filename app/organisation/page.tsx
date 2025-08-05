'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useProjects } from '../../components/ProjectsProvider';
import Toast from '../../components/Toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval?: number;
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
        <NoteModal 
          onAdd={addNote} 
          onClose={() => setShowNoteModal(false)} 
        />
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
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);

  const submit = () => {
    if (!title) return;
    onAdd({ 
      title, 
      project: project || undefined, 
      description, 
      dueDate, 
      priority,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined
    });
    onClose();
    setTitle('');
    setProject('');
    setDescription('');
    setDueDate('');
    setPriority('Normale');
    setIsRecurring(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une tâche</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="project">Projet lié</Label>
            <Select
              value={project}
              onValueChange={setProject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['Faible', 'Normale', 'Urgente'] as const).map(p => (
              <Button
                key={p}
                type="button"
                variant={priority === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPriority(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <div>
            <Label htmlFor="due-date">Date d'échéance</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring">Tâche récurrente</Label>
          </div>
          {isRecurring && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pattern">Fréquence</Label>
                <Select value={recurrencePattern} onValueChange={(value: any) => setRecurrencePattern(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interval">Intervalle</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={recurrenceInterval}
                  onChange={e => setRecurrenceInterval(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une note</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="note-title">Titre</Label>
            <Input
              id="note-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="note-text">Description</Label>
            <Textarea
              id="note-text"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="note-tags">Tags (séparés par des virgules)</Label>
            <Input
              id="note-tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

