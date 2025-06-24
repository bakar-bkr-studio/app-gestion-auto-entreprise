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
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import {
  Briefcase,
  CheckCircle,
  Coins,
  PiggyBank,
  ListTodo,
  Pencil,
  Trash
} from 'lucide-react'
import Link from 'next/link'

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [stepFilter, setStepFilter] = useState<Status | 'Tous'>('Tous')

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

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="hover:scale-105 transition-transform duration-300 ease-in-out">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets en cours</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.ongoingProjects}</div>
            <p className="text-xs text-muted-foreground">+12%</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300 ease-in-out">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.finishedProjects}</div>
            <p className="text-xs text-muted-foreground">+5%</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300 ease-in-out">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CA réalisé</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.revenueRealized} €</div>
            <p className="text-xs text-muted-foreground">+8%</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300 ease-in-out">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">CA prévisionnel</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.revenueForecast} €</div>
            <p className="text-xs text-muted-foreground">+3%</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-transform duration-300 ease-in-out">
          <CardHeader className="flex items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.tasksInProgress}</div>
            <p className="text-xs text-muted-foreground">+2%</p>
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
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <RechartsTooltip />
                <Bar dataKey="realized" fill="hsl(var(--chart-1))" name="Réalisé" />
                <Bar dataKey="forecast" fill="hsl(var(--chart-2))" name="Prévisionnel" />
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
              <Card key={p.id} className="transition-transform hover:scale-105">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{p.name}</CardTitle>
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
            <Card key={t.id} className="transition-transform hover:scale-105">
              <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">{t.title}</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

