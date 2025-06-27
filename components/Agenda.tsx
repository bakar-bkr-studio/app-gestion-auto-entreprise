'use client'
import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import fr from 'date-fns/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useRouter } from 'next/navigation'
import { Project } from './ProjectsProvider'

interface Task { id: number; title: string; dueDate: string }
interface Note { id: number; title: string; createdAt: string }

interface AgendaProps {
  projects: Project[]
  tasks: Task[]
  notes: Note[]
}

const locales = {
  fr
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
})

export default function Agenda({ projects, tasks, notes }: AgendaProps) {
  const router = useRouter()

  const events = useMemo(() => {
    const ev: Event[] = []
    projects.forEach(p => {
      ev.push({
        title: `Début ${p.name}`,
        start: new Date(p.startDate),
        end: new Date(p.startDate),
        resource: { type: 'project', id: p.id }
      })
    })
    tasks.forEach(t => {
      if (t.dueDate)
        ev.push({
          title: t.title,
          start: new Date(t.dueDate),
          end: new Date(t.dueDate),
          resource: { type: 'task', id: t.id }
        })
    })
    notes.forEach(n => {
      ev.push({
        title: n.title,
        start: new Date(n.createdAt),
        end: new Date(n.createdAt),
        resource: { type: 'note', id: n.id }
      })
    })
    return ev
  }, [projects, tasks, notes])

  const onSelect = (event: Event) => {
    const { type, id } = (event.resource || {}) as any
    if (type === 'project') router.push('/projects')
    if (type === 'task') router.push('/tasks')
    if (type === 'note') router.push('/notes')
  }

  return (
    <div className="h-96 bg-white rounded-lg p-2">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={onSelect}
      />
    </div>
  )
}
