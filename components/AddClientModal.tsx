'use client';
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '../lib/data/clients'
import { X } from 'lucide-react'

import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

interface AddClientModalProps {
  isOpen: boolean;
  onAdd: (client: Client) => void;
  onUpdate?: (client: Client) => void;
  onClose: () => void;
  client?: Client;
}

const schema = z.object({
  firstName: z.string().min(1, 'Ce champ est requis'),
  lastName: z.string().min(1, 'Ce champ est requis'),
  company: z.string().optional(),
  email: z
    .string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['Client', 'Prospect']),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddClientModal({ isOpen, onAdd, onUpdate, onClose, client }: AddClientModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? { ...client, tags: client.tags.join(', ') }
      : { status: 'Client' },
  });

  useEffect(() => {
    if (client) {
      reset({ ...client, tags: client.tags.join(', ') });
    } else {
      reset({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        status: 'Client',
        tags: '',
      });
    }
  }, [client, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: FormValues) => {
    const now = new Date();
    const dateAdded = `${now.getDate().toString().padStart(2, '0')}/${
      (now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newClient: Client = {
      id: client?.id ?? Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dateAdded: client?.dateAdded ?? dateAdded,
    };

    if (client) {
      onUpdate?.(newClient);
    } else {
      onAdd(newClient);
    }

    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-2 w-full max-w-xl animate-in fade-in-0 zoom-in-95">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{client ? 'Modifier le client' : 'Ajouter un client'}</CardTitle>
            <Button type="button" size="icon" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" {...register('company')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse postale</Label>
                <Input id="address" {...register('address')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select onValueChange={(v)=>reset({ ...getValues(), status: v as any })} defaultValue={client ? client.status : 'Client'}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Textarea id="tags" {...register('tags')} placeholder="mariage, corporate" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{client ? 'Modifier' : 'Ajouter'}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
