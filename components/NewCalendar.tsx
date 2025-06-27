'use client'

import FullCalendar, { EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { EventClickArg } from '@fullcalendar/interaction'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DateInput } from './ui/date-input'

import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'

export default function NewCalendar() {
  const [events, setEvents] = useState<EventInput[]>([
    { title: 'Montage vidéo', date: '2025-07-01' },
    { title: 'Rendez-vous client', date: '2025-07-03' }
  ])

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')

  const addEvent = () => {
    if (!title || !date) return
    setEvents(prev => [...prev, { title, date }])
    setTitle('')
    setDate('')
    setShowForm(false)
  }

  const handleEventClick = (arg: EventClickArg) => {
    console.log(arg.event.title)
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => setShowForm(p => !p)}>Ajouter un événement</Button>
      {showForm && (
        <div className="flex flex-col sm:flex-row items-end gap-2">
          <Input
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1"
          />
          <DateInput
            value={date}
            onChange={e => setDate(e.target.value)}
            className="sm:w-48"
          />
          <Button onClick={addEvent}>Valider</Button>
        </div>
      )}
      <div className="bg-white rounded-lg p-2 dark:bg-gray-800">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>
    </div>
  )
}
