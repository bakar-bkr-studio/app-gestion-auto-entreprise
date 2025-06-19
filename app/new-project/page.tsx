'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { status: 'Conception', type: 'Photo' } });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert('Projet créé avec succès');
    router.push('/projects');
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Nouveau projet</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
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
        <div>
          <label className="mb-1 block font-semibold">Date de début</label>
          <input type="date" {...register('startDate')} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Date prévue</label>
          <input type="date" {...register('dueDate')} className="w-full rounded border px-3 py-2" />
        </div>
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
          <label className="mb-1 block font-semibold">Type de projet</label>
          <select {...register('type')} className="w-full rounded border px-3 py-2">
            <option value="Photo">Photo</option>
            <option value="Video">Vidéo</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold">Budget (€)</label>
          <input type="number" {...register('budget', { valueAsNumber: true })} className="w-full rounded border px-3 py-2" />
        </div>
        <div className="mt-6 flex space-x-2">
          <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            ✅ Créer le projet
          </button>
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
