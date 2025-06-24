"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProjects, Task, DocumentFile } from "../../components/ProjectsProvider";
import { Client, initialClients } from "../../lib/data/clients";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";

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
  const project = editId ? projects.find((p) => p.id === Number(editId)) : undefined;

  const [tasks, setTasks] = useState<Task[]>(project?.tasks ?? []);
  const [taskText, setTaskText] = useState("");
  const [documents, setDocuments] = useState<DocumentFile[]>(project?.documents ?? []);
  const [manualClient, setManualClient] = useState(project ? false : true);
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          return JSON.parse(stored) as Client[];
        } catch {
          /* ignore */
        }
      }
    }
    return initialClients;
  });

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name ?? "",
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
    if (project) {
      reset({
        name: project.name,
        client: project.client,
        description: project.description,
        startDate: project.startDate,
        dueDate: project.endDate,
        status: project.status as FormValues["status"],
        type: project.type as FormValues["type"],
        paymentStatus: project.paymentStatus,
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
    setTaskText("");
  };
  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
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
    };
    if (editId) {
      updateProject(Number(editId), payload);
    } else {
      addProject(payload);
    }
    router.push("/projects");
  };

  return (
    <div className="p-4">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{editId ? "Modifier le projet" : "Nouveau projet"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        <SelectItem key={c.id} value={`${c.firstName} ${c.lastName}`}>{`${c.firstName} ${c.lastName}`}</SelectItem>
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
                <Input type="date" id="startDate" {...register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date de fin</Label>
                <Input type="date" id="dueDate" {...register("dueDate")} />
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
                    {(["Conception","Tournage","Montage","Prêt","Envoyé","Terminé"] as const).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
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
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="Acompte">Acompte</SelectItem>
                    <SelectItem value="Non payé">Non payé</SelectItem>
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
              <Button type="button" variant="secondary" onClick={() => router.push('/projects')}>Annuler</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Ajout...' : editId ? 'Enregistrer' : 'Créer le projet'}</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
