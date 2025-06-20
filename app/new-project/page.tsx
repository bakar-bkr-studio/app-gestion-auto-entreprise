'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useProjects, Task, DocumentFile, Project } from '../../components/ProjectsProvider';

interface FormValues {
  name: string;
  client: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: string;
  type: string;
  budget: number;
  notes: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addProject, updateProject } = useProjects();
  const editId = searchParams.get('id');
  const project = editId ? projects.find((p) => p.id === Number(editId)) : undefined;
  const [tasks, setTasks] = useState<Task[]>(project?.tasks ?? []);
  const [taskText, setTaskText] = useState('');
  const [documents, setDocuments] = useState<DocumentFile[]>(project?.documents ?? []);
  const [manualClient, setManualClient] = useState(project ? false : true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: project
      ? {
          name: project.name,
          client: project.client,
          description: project.description,
          startDate: project.startDate,
          dueDate: project.endDate,
          status: project.status,
          type: 'Photo',
          budget: project.budget,
          notes: project.notes,
        }
      : { status: 'Conception', type: 'Photo', notes: '' },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        client: project.client,
        description: project.description,
        startDate: project.startDate,
        dueDate: project.endDate,
        status: project.status,
        type: 'Photo',
        budget: project.budget,
        notes: project.notes,
      });
      setTasks(project.tasks);
      setDocuments(project.documents);
      setManualClient(false);
    }
  }, [project, reset]);

  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
    setTaskText('');
  };
  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      name: data.name,
      client: data.client,
      description: data.description,
      startDate: data.startDate,
      endDate: data.dueDate,
      status: data.status as any,
      budget: data.budget,
      tasks,
      notes: data.notes,
      documents,
    };
    if (editId) {
      updateProject(Number(editId), payload);
    } else {
      addProject(payload);
    }
    router.push('/projects');
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-3xl font-bold">{editId ? 'Modifier le projet' : 'Nouveau projet'}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-2xl space-y-6 rounded border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Informations générales</h2>
          <div>
            <label className="mb-1 block font-semibold">Nom du projet</label>
            <input
              {...register('name', { required: true })}
              placeholder="Mariage..."
              className="w-full rounded border px-3 py-2"
            />
            {errors.name && <p className="text-sm text-red-600">Ce champ est requis</p>}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Client</label>
            {manualClient ? (
              <input
                {...register('client', { required: true })}
                placeholder="Nom du client"
                className="w-full rounded border px-3 py-2"
              />
            ) : (
              <select {...register('client', { required: true })} className="w-full rounded border px-3 py-2">
                <option value="">-- Sélectionner --</option>
                <option value="Client A">Client A</option>
                <option value="Client B">Client B</option>
              </select>
            )}
            {errors.client && <p className="text-sm text-red-600">Ce champ est requis</p>}
            {!manualClient && (
              <button
                type="button"
                onClick={() => setManualClient(true)}
                className="mt-1 text-sm text-blue-600"
              >
                ➕ Ajouter un client manuellement
              </button>
            )}
          </div>
          <div>
            <label className="mb-1 block font-semibold">Description</label>
            <textarea
              {...register('description')}
              placeholder="Détails du projet"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dates</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold">Date de début</label>
              <input type="date" {...register('startDate')} className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Date de fin</label>
              <input type="date" {...register('dueDate')} className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Budget</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold">Statut</label>
              <select {...register('status')} className="w-full rounded border px-3 py-2">
                {['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-semibold">Budget (€)</label>
              <input type="number" {...register('budget', { valueAsNumber: true })} className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Tâches du projet</h2>
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <span>{t.text}</span>
              <button type="button" onClick={() => removeTask(t.id)} className="text-red-500">🗑️</button>
            </div>
          ))}
          <div className="flex space-x-2">
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
            <button type="button" onClick={addTask} className="rounded bg-blue-500 px-3 text-white">
              ➕
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Notes personnelles</h2>
          <textarea {...register('notes')} className="w-full rounded border px-3 py-2" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Documents liés</h2>
          <ul className="space-y-1">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between">
                <span>{d.name}</span>
                <button type="button" onClick={() => setDocuments(documents.filter(doc => doc.id !== d.id))} className="text-red-500">🗑️</button>
              </li>
            ))}
          </ul>
          <input type="file" onChange={(e) => {
            const f = e.target.files ? e.target.files[0] : null;
            if (f) setDocuments([...documents, { id: Date.now(), name: f.name, path: f.name }]);
          }} />
        </div>

        <div className="flex justify-end space-x-2">
          <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            {editId ? 'Enregistrer' : 'Créer le projet'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
