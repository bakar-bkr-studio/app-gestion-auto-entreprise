'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from './lib/utils'
import { Project } from './ProjectsProvider'

interface Task { 
  id: number
  title: string
  dueDate: string
}

interface Note { 
  id: number
  title: string
  createdAt: string
}

interface ModernCalendarProps {
  projects: Project[]
  tasks: Task[]
  notes: Note[]
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'project' | 'task' | 'note'
  color: string
  time?: string
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function ModernCalendar({ projects, tasks, notes }: ModernCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const events = useMemo(() => {
    const eventList: CalendarEvent[] = []
    
    // Ajouter les projets
    projects.forEach(p => {
      if (p.startDate) {
        eventList.push({
          id: `project-${p.id}`,
          title: p.name,
          date: new Date(p.startDate),
          type: 'project',
          color: 'bg-blue-500',
          time: '09:00'
        })
      }
    })
    
    // Ajouter les tâches
    tasks.forEach(t => {
      if (t.dueDate) {
        eventList.push({
          id: `task-${t.id}`,
          title: t.title,
          date: new Date(t.dueDate),
          type: 'task',
          color: 'bg-orange-500',
          time: '14:00'
        })
      }
    })
    
    // Ajouter les notes
    notes.forEach(n => {
      eventList.push({
        id: `note-${n.id}`,
        title: n.title,
        date: new Date(n.createdAt),
        type: 'note',
        color: 'bg-purple-500'
      })
    })
    
    return eventList
  }, [projects, tasks, notes])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Lundi = 0

    const days = []
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Planning
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg p-1 shadow-sm">
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className="text-xs"
              >
                Mois
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className="text-xs"
              >
                Semaine
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd'hui
            </Button>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 rounded-lg p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-1 font-semibold text-lg min-w-[180px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAYS.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-slate-600 dark:text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isCurrentDay = isToday(day.date)
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-2 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
                  day.isCurrentMonth 
                    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600" 
                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400",
                  isCurrentDay && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isCurrentDay && "text-blue-600 dark:text-blue-400 font-bold"
                )}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs px-2 py-1 rounded-md text-white font-medium truncate shadow-sm",
                        event.color
                      )}
                      title={event.title}
                    >
                      <div className="flex items-center gap-1">
                        {event.type === 'project' && <User className="h-3 w-3" />}
                        {event.type === 'task' && <Clock className="h-3 w-3" />}
                        {event.type === 'note' && <MapPin className="h-3 w-3" />}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500 font-medium">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Légende */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Projets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Tâches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Notes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}