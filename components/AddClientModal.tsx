'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '../lib/data/clients';
import { X } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onAdd: (client: Client) => void;
  onClose: () => void;
}

const schema = z.object({
  firstName: z.string().min(1, 'Ce champ est requis'),
  lastName: z.string().min(1, 'Ce champ est requis'),
  company: z.string().optional(),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Ce champ est requis'),
  address: z.string().optional(),
  status: z.enum(['Client', 'Prospect']),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddClientModal({ isOpen, onAdd, onClose }: AddClientModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'Client' }
  });

  if (!isOpen) return null;

  const onSubmit = (data: FormValues) => {
    const now = new Date();
    const dateAdded = `${now.getDate().toString().padStart(2, '0')}/${
      (now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    onAdd({
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dateAdded,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter un client</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Prénom</label>
            <input className="w-full rounded border px-3 py-2" {...register('firstName')} />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nom</label>
            <input className="w-full rounded border px-3 py-2" {...register('lastName')} />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Entreprise</label>
            <input className="w-full rounded border px-3 py-2" {...register('company')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Adresse email</label>
            <input type="email" className="w-full rounded border px-3 py-2" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Téléphone</label>
            <input className="w-full rounded border px-3 py-2" {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Adresse postale</label>
            <input className="w-full rounded border px-3 py-2" {...register('address')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Statut</label>
            <select className="w-full rounded border px-3 py-2" {...register('status')}>
              <option value="Client">Client</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags (séparés par des virgules)</label>
            <input className="w-full rounded border px-3 py-2" {...register('tags')} placeholder="mariage, corporate" />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">Annuler</button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}
