'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useProjects } from '../../components/ProjectsProvider';

interface FormValues {
  name: string;
  client: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: string;
  type: string;
  budget: number;
}

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addProject, updateProject } = useProjects();
  const editId = searchParams.get('id');
  const project = editId ? projects.find((p) => p.id === Number(editId)) : undefined;
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
        }
      : { status: 'Conception', type: 'Photo' },
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
      });
    }
  }, [project, reset]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      name: data.name,
      client: data.client,
      description: data.description,
      startDate: data.startDate,
      endDate: data.dueDate,
      status: data.status as any,
      budget: data.budget,
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
            <select {...register('client', { required: true })} className="w-full rounded border px-3 py-2">
              <option value="">-- Sélectionner --</option>
              <option value="Client A">Client A</option>
              <option value="Client B">Client B</option>
            </select>
            {errors.client && <p className="text-sm text-red-600">Ce champ est requis</p>}
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
