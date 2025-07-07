"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProjects, Task, DocumentFile } from "../../components/ProjectsProvider";
import { supabase } from "../../lib/supabaseClient";
import { useClients, Client } from "@/components/ClientsProvider";
import { Input } from "../../components/ui/input";
import { DateInput } from "../../components/ui/date-input";
import {
  Pencil,
  Video,
  Scissors,
  CheckCircle,
  Send,
  Check,
  Coins,
  Euro,
  Ban,
} from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import Toast from "../../components/Toast";

const formSchema = z.object({
  name: z.string().min(1, "Ce champ est requis"),
  client: z.string().min(1, "Ce champ est requis"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["Conception", "Tournage", "Montage", "Prêt", "Envoyé", "Terminé"]),
  type: z.enum(["Photo", "Video"]),
  paymentStatus: z.enum(["Payé", "Acompte", "Non payé"]),
  budget: z.coerce.number().nonnegative(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addProject, updateProject } = useProjects();
  const editId = searchParams.get("id");
  const duplicateId = searchParams.get("duplicate");
  const project = editId
    ? projects.find((p) => p.id === Number(editId))
    : duplicateId
      ? projects.find((p) => p.id === Number(duplicateId))
      : undefined;

  const [tasks, setTasks] = useState<Task[]>(project?.tasks ?? []);
  const [taskText, setTaskText] = useState("");
  const [documents, setDocuments] = useState<DocumentFile[]>(project?.documents ?? []);
  const { clients } = useClients();
  const [manualClient, setManualClient] = useState(project ? false : true);

  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:
        duplicateId && project && !editId
          ? `Copie de ${project.name}`
          : project?.name ?? "",
      client: project?.client ?? "",
      description: project?.description ?? "",
      startDate: project?.startDate ?? "",
      dueDate: project?.endDate ?? "",
      status: (project?.status as FormValues["status"]) ?? "Conception",
      type: (project?.type as FormValues["type"]) ?? "Photo",
      paymentStatus: project?.paymentStatus ?? "Non payé",
      budget: project?.budget ?? 0,
      notes: project?.notes ?? "",
    },
  });

  useEffect(() => {
    const current = editId
      ? projects.find(p => p.id === Number(editId))
      : duplicateId
        ? projects.find(p => p.id === Number(duplicateId))
        : undefined

    if (current) {
      reset({
        name: current.name,
        client: current.client,
        description: current.description,
        startDate: current.startDate,
        dueDate: current.endDate,
        status: current.status as FormValues['status'],
        type: current.type as FormValues['type'],
        paymentStatus: current.paymentStatus,
        budget: current.budget,
        notes: current.notes,
      })
      setTasks(current.tasks)
      setDocuments(current.documents)
      setManualClient(false)
    }
  }, [editId, duplicateId, projects, reset])

  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
    setTaskText("");
  };
  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    const payload = {
      name: data.name,
      client: data.client,
      description: data.description,
      startDate: data.startDate,
      endDate: data.dueDate,
      status: data.status,
      type: data.type,
      paymentStatus: data.paymentStatus,
      isFavorite: project?.isFavorite ?? false,
      budget: data.budget,
      tasks,
      notes: data.notes,
      documents,
    }

    try {
      const { error } = await supabase.from('projects').insert({
        name: data.name,
        client_name: data.client,
        type: data.type,
        description: data.description,
        start_date: data.startDate,
        end_date: data.dueDate,
        status: data.status,
        budget: data.budget,
        payment_status: data.paymentStatus,
        tasks: JSON.stringify(tasks),
        personal_notes: data.notes,
        attachments_url: documents.length ? JSON.stringify(documents) : null,
      })
      if (error) throw error

      if (!editId) {
        addProject(payload)
      } else {
        updateProject(Number(editId), payload)
      }

      setToastType('success')
      setToast('Projet créé avec succès ✅')
      reset()
      setTasks([])
      setDocuments([])
      setTimeout(() => {
        setClosing(true)
      }, 500)
    } catch (err: any) {
      setToastType('error')
      setToast(`Erreur : ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: closing ? 0 : 1, scale: closing ? 0.95 : 1 }}
        onAnimationComplete={() => {
          if (closing) router.push('/projects')
        }}
      >
        <Card className="mx-auto max-w-3xl backdrop-blur-md">
        <CardHeader className="relative">
          <button
            type="button"
            onClick={() => setClosing(true)}
            aria-label="Fermer le formulaire"
            className="absolute left-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            ✖
          </button>
          <CardTitle>{editId ? "Modifier le projet" : "Nouveau projet"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, () => {
              setToastType('error');
              setToast('Erreur : veuillez remplir tous les champs obligatoires ❌');
            })}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du projet</Label>
                <Input id="name" {...register("name")}/>
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="client">Client</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="manual">Saisie manuelle</Label>
                    <Switch id="manual" checked={manualClient} onCheckedChange={setManualClient} />
                  </div>
                </div>
                {manualClient ? (
                  <Input id="client" {...register("client")}/>
                ) : (
                  <Select onValueChange={(v) => reset({ ...getValues(), client: v })} defaultValue={project?.client ?? ""}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Choisir un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={`${c.first_name} ${c.last_name}`}>{`${c.first_name} ${c.last_name}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.client && <p className="text-sm text-red-600">{errors.client.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={project?.type ?? "Photo"} onValueChange={(v)=>reset({ ...getValues(), type: v as any })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Photo">Photo</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <DateInput id="startDate" {...register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date de fin</Label>
                <DateInput id="dueDate" {...register("dueDate")} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue={project?.status ?? "Conception"} onValueChange={(v)=>reset({ ...getValues(), status: v as any })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Conception","Tournage","Montage","Prêt","Envoyé","Terminé"] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="flex items-center gap-2">
                          {s === 'Conception' && <Pencil className="h-4 w-4" />}
                          {s === 'Tournage' && <Video className="h-4 w-4" />}
                          {s === 'Montage' && <Scissors className="h-4 w-4" />}
                          {s === 'Prêt' && <CheckCircle className="h-4 w-4" />}
                          {s === 'Envoyé' && <Send className="h-4 w-4" />}
                          {s === 'Terminé' && <Check className="h-4 w-4" />}
                          {s}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input type="number" id="budget" {...register("budget", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Paiement</Label>
                <Select defaultValue={project?.paymentStatus ?? "Non payé"} onValueChange={(v)=>reset({ ...getValues(), paymentStatus: v as any })}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payé">
                      <span className="flex items-center gap-2"><Euro className="h-4 w-4" />Payé</span>
                    </SelectItem>
                    <SelectItem value="Acompte">
                      <span className="flex items-center gap-2"><Coins className="h-4 w-4" />Acompte</span>
                    </SelectItem>
                    <SelectItem value="Non payé">
                      <span className="flex items-center gap-2"><Ban className="h-4 w-4" />Non payé</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tâches du projet</Label>
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <span>{t.text}</span>
                  <Button type="button" variant="ghost" onClick={() => removeTask(t.id)}>🗑️</Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={taskText} onChange={(e) => setTaskText(e.target.value)} />
                <Button type="button" onClick={addTask}>➕</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes personnelles</Label>
              <Textarea id="notes" {...register("notes")} />
            </div>
            <div className="space-y-2">
              <Label>Documents liés</Label>
              <ul className="space-y-1">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <span>{d.name}</span>
                    <Button variant="ghost" type="button" onClick={() => setDocuments(documents.filter(doc => doc.id !== d.id))}>🗑️</Button>
                  </li>
                ))}
              </ul>
              <Input type="file" onChange={(e) => {
                const f = e.target.files ? e.target.files[0] : null;
                if (f) setDocuments([...documents, { id: Date.now(), name: f.name, path: f.name }]);
              }} />
            </div>
            <CardFooter className="flex justify-end gap-2 p-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setClosing(true)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>{loading ? 'Ajout...' : editId ? 'Enregistrer' : 'Créer le projet'}</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      </motion.div>
      <Toast
        message={toast}
        onClose={() => setToast(null)}
        position="top-right"
        type={toastType}
      />
    </div>
  );
}
