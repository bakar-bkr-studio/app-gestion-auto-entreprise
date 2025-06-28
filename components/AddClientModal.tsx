'use client';
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@/lib/providers/ClientsProvider'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
import { cn } from './lib/utils'

interface AddClientModalProps {
  isOpen: boolean;
  onAdd: (client: Omit<Client, 'id' | 'created_at'>) => void;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? {
          firstName: client.first_name,
          lastName: client.last_name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          address: client.address,
          status: client.status as any,
          tags: client.tags,
        }
      : { status: 'Client' },
  });
  const tagSuggestions = ['mariage', 'corporate', 'e-commerce', 'client-fidele', 'startup']
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (client) {
      reset({
        firstName: client.first_name,
        lastName: client.last_name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        status: client.status as any,
        tags: client.tags,
      })
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
      })
    }
  }, [client, reset])

  const onSubmit = (data: FormValues) => {
    setLoading(true)

    const payload: Omit<Client, 'id' | 'created_at'> = {
      first_name: data.firstName,
      last_name: data.lastName,
      company: data.company ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      address: data.address ?? '',
      status: data.status,
      tags: data.tags ?? '',
    }

    if (client) {
      onUpdate?.({ ...client, ...payload })
    } else {
      onAdd(payload)
    }

    reset();
    onClose();
    setLoading(false)
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
            <Card className="mx-2 w-full max-w-xl">
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
                <Input id="firstName" {...register('firstName')} className={cn(errors.firstName && 'border-red-500 animate-pulse')} />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} className={cn(errors.lastName && 'border-red-500 animate-pulse')} />
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
                <Input list="tag-list" id="tags" {...register('tags')} placeholder="mariage, corporate" />
                <datalist id="tag-list">
                  {tagSuggestions.map(t => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              ) : null}
              {client ? 'Modifier' : 'Ajouter'}
            </Button>
          </CardFooter>
        </form>
      </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
