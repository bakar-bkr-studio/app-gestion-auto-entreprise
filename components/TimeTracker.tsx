'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { supabase } from '@/lib/supabaseClient'

interface TimeEntry {
  id: string
  project_id: string
  task_name: string
  start_time: string
  end_time?: string
  duration_minutes: number
  description: string
}

interface TimeTrackerProps {
  projectId: string
  projectName: string
}

export default function TimeTracker({ projectId, projectName }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [taskName, setTaskName] = useState('')
  const [description, setDescription] = useState('')
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  useEffect(() => {
    fetchTimeEntries()
  }, [projectId])

  const fetchTimeEntries = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTimeEntries(data)
    }
  }

  const startTimer = () => {
    setStartTime(new Date())
    setIsRunning(true)
    setElapsedTime(0)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopTimer = async () => {
    if (!startTime) return

    const endTime = new Date()
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)

    const { data: userData } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('time_entries').insert({
      project_id: projectId,
      user_id: userData?.user?.id,
      task_name: taskName || 'Tâche sans nom',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
      description: description
    })

    if (!error) {
      setIsRunning(false)
      setStartTime(null)
      setElapsedTime(0)
      setTaskName('')
      setDescription('')
      fetchTimeEntries()
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const totalTime = timeEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Suivi du temps - {projectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold mb-4">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {!isRunning ? (
              <Button onClick={startTimer} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Démarrer
              </Button>
            ) : (
              <>
                <Button onClick={pauseTimer} variant="outline" className="flex items-center gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button onClick={stopTimer} variant="destructive" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Arrêter
                </Button>
              </>
            )}
          </div>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div>
              <Label htmlFor="task-name">Nom de la tâche</Label>
              <Input
                id="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ex: Retouche photos"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails sur la tâche..."
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Historique</h4>
            <span className="text-sm text-muted-foreground">
              Total: {formatDuration(totalTime)}
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center text-sm p-2 bg-muted rounded">
                <div>
                  <div className="font-medium">{entry.task_name}</div>
                  {entry.description && (
                    <div className="text-muted-foreground">{entry.description}</div>
                  )}
                </div>
                <div className="text-right">
                  <div>{formatDuration(entry.duration_minutes)}</div>
                  <div className="text-muted-foreground">
                    {new Date(entry.start_time).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}