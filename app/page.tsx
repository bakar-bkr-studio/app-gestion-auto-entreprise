'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useProjects, Status } from '@/components/ProjectsProvider'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts'
import {
  Briefcase,
  CheckCircle,
  Coins,
  PiggyBank,
  ListTodo,
  AlarmClock,
  Pencil,
  Trash
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AddSiteModal from '@/components/AddSiteModal'
import { useWebsites, Website } from '@/components/WebsitesProvider'
import Toast from '@/components/Toast'
import { cn } from '@/components/lib/utils'

interface Task {
  id: number
  title: string
  project?: string
  description?: string
  createdAt: string
  dueDate: string
  priority: 'Urgente' | 'Normale' | 'Faible'
  status: 'En cours' | 'Terminée'
}

const statusColors: Record<Status, string> = {
  Conception: 'bg-yellow-200 text-yellow-700',
  Tournage: 'bg-blue-200 text-blue-700',
  Montage: 'bg-purple-200 text-purple-700',
  Prêt: 'bg-green-200 text-green-700',
  Envoyé: 'bg-blue-500 text-white',
  Terminé: 'bg-gray-500 text-white'
}

export default function DashboardPage() {
  const { projects, deleteProject } = useProjects()
  const { websites, addWebsite, updateWebsite, deleteWebsite } = useWebsites()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stepFilter, setStepFilter] = useState<Status | 'Tous'>('Tous')
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Website | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tasks')
      if (stored) {
        try {
          setTasks(JSON.parse(stored) as Task[])
        } catch {
          /* ignore */
        }
      }
    }
  }, [])

  const kpi = useMemo(() => {
    const ongoingProjects = projects.filter(p => p.status !== 'Terminé').length
    const finishedProjects = projects.filter(p => p.status === 'Terminé').length
    const revenueRealized = projects
      .filter(p => p.paymentStatus === 'Payé')
      .reduce((sum, p) => sum + p.budget, 0)
    const revenueForecast = projects
      .filter(p => p.paymentStatus === 'Non payé' || p.paymentStatus === 'Acompte')
      .reduce((sum, p) => sum + p.budget, 0)
    const tasksInProgress = tasks.filter(t => t.status === 'En cours').length
    return { ongoingProjects, finishedProjects, revenueRealized, revenueForecast, tasksInProgress }
  }, [projects, tasks])

  const chartData = useMemo(() => {
    const map: Record<string, { month: string; realized: number; forecast: number; order: number }> = {}
    projects.forEach(p => {
      const date = new Date(p.endDate)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const label = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' })
      if (!map[key]) {
        map[key] = { month: label, realized: 0, forecast: 0, order: date.getFullYear() * 12 + date.getMonth() }
      }
      if (p.paymentStatus === 'Payé') map[key].realized += p.budget
      else map[key].forecast += p.budget
    })
    return Object.values(map)
      .sort((a, b) => a.order - b.order)
      .map(({ order, ...rest }) => rest)
  }, [projects])

  const recentProjects = useMemo(() => {
    const filtered = projects.filter(p => (stepFilter === 'Tous' ? true : p.status === stepFilter))
    return filtered
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 4)
  }, [projects, stepFilter])

  const urgentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [tasks]
  )

  const stepOrder: Status[] = ['Conception', 'Tournage', 'Montage', 'Prêt', 'Envoyé', 'Terminé']

  const openAddSite = () => {
    setEditingSite(null)
    setShowSiteModal(true)
  }

  const handleEditSite = (site: Website) => {
    setEditingSite(site)
    setShowSiteModal(true)
  }

  const handleDeleteSite = (id: number) => {
    deleteWebsite(id)
    setToast('Site supprimé \u2714\uFE0F')
  }


  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sites favoris</h2>
          <Button size="sm" onClick={openAddSite}>+ Ajouter un site</Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {websites.map(site => (
            <Card key={site.id} className="relative group overflow-hidden hover:scale-105 transition-transform duration-200">
              <a href={site.url} target="_blank" rel="noreferrer" className="block p-4">
                <div className="flex items-center space-x-2">
                  <img src={`https://icon.horse/icon/${(() => { try { return new URL(site.url).hostname } catch { return site.url } })()}`} alt="" className="h-4 w-4" />
                  <span className="text-sm font-semibold text-white truncate">{site.name}</span>
                </div>
                {site.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{site.description}</p>
                )}
                {site.tag && <Badge className="mt-2">{site.tag}</Badge>}
              </a>
              <div className="absolute right-1 top-1 flex space-x-1 opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="ghost" onClick={e => {e.preventDefault(); handleEditSite(site);}}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" onClick={e => {e.preventDefault(); handleDeleteSite(site.id);}}>
                  <Trash className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card aria-label="Projets en cours" className="transition-transform hover:scale-105">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets en cours</CardTitle>
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.ongoingProjects}</div>
            <p className="text-xs text-green-500">+12%</p>
          </CardContent>
        </Card>
        <Card aria-label="Projets terminés" className="transition-transform hover:scale-105">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets terminés</CardTitle>
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.finishedProjects}</div>
            <p className="text-xs text-green-500">+5%</p>
          </CardContent>
        </Card>
        <Card aria-label="CA réalisé" className="transition-transform hover:scale-105">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CA réalisé</CardTitle>
            <Coins className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.revenueRealized} €</div>
            <p className="text-xs text-green-500">+8%</p>
          </CardContent>
        </Card>
        <Card aria-label="CA prévisionnel" className="transition-transform hover:scale-105">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CA prévisionnel</CardTitle>
            <PiggyBank className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.revenueForecast} €</div>
            <p className="text-xs text-green-500">+3%</p>
          </CardContent>
        </Card>
        <Card aria-label="Tâches en cours" className="transition-transform hover:scale-105">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
            <ListTodo className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.tasksInProgress}</div>
            <p className="text-xs text-green-500">+2%</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Évolution du chiffre d'affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} className="text-sm">
                <defs>
                  <linearGradient id="realizedGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="realized" fill="url(#realizedGrad)" name="Réalisé">
                  <LabelList dataKey="realized" position="top" />
                </Bar>
                <Bar dataKey="forecast" fill="url(#forecastGrad)" name="Prévisionnel">
                  <LabelList dataKey="forecast" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projets récents</h2>
          <Tabs value={stepFilter} onValueChange={(v: any) => setStepFilter(v)}>
            <TabsList>
              {stepOrder.map(s => (
                <TabsTrigger key={s} value={s} className="px-3">
                  {s}
                </TabsTrigger>
              ))}
              <TabsTrigger value="Tous" className="px-3">
                Tous
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentProjects.map(p => {
            const currentIndex = stepOrder.indexOf(p.status)
            return (
              <Card key={p.id} className="transition-transform hover:scale-105 hover:shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/placeholder.svg" alt="miniature" width={24} height={24} />
                      <CardTitle className="text-base font-medium">{p.name}</CardTitle>
                    </div>
                    <Badge className={`${statusColors[p.status]}`}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.client}</p>
                  <p className="text-sm text-muted-foreground">Échéance {p.endDate}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-1">
                    {stepOrder.map((s, i) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full ${i <= currentIndex ? 'bg-primary' : 'bg-muted'}`}
                        />
                        {i < stepOrder.length - 1 && (
                          <div className={`h-px w-4 ${i < currentIndex ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{p.budget} €</span>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => location.href = `/new-project?id=${p.id}` }>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Éditer</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => deleteProject(p.id)}>
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Supprimer</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tâches urgentes</h2>
        <div className="space-y-2">
          {urgentTasks.map(t => (
            <Card
              key={t.id}
              className={cn(
                'transition-transform hover:scale-105',
                t.priority === 'Urgente' && 'bg-red-100/10'
              )}
            >
              <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-1">
                  {t.priority === 'Urgente' && <AlarmClock className="h-4 w-4" />}
                  {t.priority === 'Normale' && <ListTodo className="h-4 w-4" />}
                  {t.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="secondary">{t.priority}</Badge>
                  <Badge>{t.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                {t.project && (
                  <p>
                    Projet : <Link href="/projects" className="underline">{t.project}</Link>
                  </p>
                )}
                <p>
                  Créée le {t.createdAt} - échéance{' '}
                  <span className={new Date(t.dueDate) < new Date() ? 'text-red-500' : ''}>{t.dueDate}</span>
                </p>
                <div className="flex space-x-2 pt-1">
                  <Button size="icon" variant="ghost" onClick={() => alert('edit')}> <Pencil className="h-4 w-4" /> </Button>
                  <Button size="icon" variant="ghost" onClick={() => alert('delete')}> <Trash className="h-4 w-4 text-red-500" /> </Button>
                  <Button size="icon" variant="ghost" onClick={() => setTasks(prev => prev.map(tt => tt.id === t.id ? { ...tt, status: 'Terminée' } : tt))}>✅</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <AddSiteModal
        isOpen={showSiteModal}
        site={editingSite}
        onAdd={data => {
          addWebsite(data)
          setToast('Site ajouté avec succès')
        }}
        onUpdate={data => {
          if (editingSite) {
            updateWebsite(editingSite.id, data)
            setToast('Site modifi\u00e9 !')
          }
        }}
        onClose={() => {
          setShowSiteModal(false)
          setEditingSite(null)
        }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

