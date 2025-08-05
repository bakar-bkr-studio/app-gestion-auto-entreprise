'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Phone, Mail, Calendar, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { supabase } from '@/lib/supabaseClient'

interface Interaction {
  id: string
  interaction_type: string
  notes: string
  interaction_date: string
  created_at: string
}

interface ClientInteractionsProps {
  clientId: string
  clientName: string
}

export default function ClientInteractions({ clientId, clientName }: ClientInteractionsProps) {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [interactionType, setInteractionType] = useState('')
  const [notes, setNotes] = useState('')
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInteractions()
  }, [clientId])

  const fetchInteractions = async () => {
    const { data, error } = await supabase
      .from('client_interactions')
      .select('*')
      .eq('client_id', clientId)
      .order('interaction_date', { ascending: false })

    if (!error && data) {
      setInteractions(data)
    }
  }

  const addInteraction = async () => {
    if (!interactionType || !notes) return

    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    const { error } = await supabase.from('client_interactions').insert({
      client_id: clientId,
      user_id: userData?.user?.id,
      interaction_type: interactionType,
      notes,
      interaction_date: interactionDate
    })

    if (!error) {
      setShowForm(false)
      setInteractionType('')
      setNotes('')
      setInteractionDate(new Date().toISOString().split('T')[0])
      fetchInteractions()
    }
    setLoading(false)
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'phone':
        return <Phone className="h-4 w-4" />
      case 'meeting':
        return <Calendar className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'email':
        return 'Email'
      case 'phone':
        return 'Appel téléphonique'
      case 'meeting':
        return 'Rendez-vous'
      case 'message':
        return 'Message'
      default:
        return 'Autre'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Historique des interactions - {clientName}
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interaction-type">Type d'interaction</Label>
                <Select value={interactionType} onValueChange={setInteractionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Appel téléphonique</SelectItem>
                    <SelectItem value="meeting">Rendez-vous</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interaction-date">Date</Label>
                <Input
                  id="interaction-date"
                  type="date"
                  value={interactionDate}
                  onChange={(e) => setInteractionDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Détails de l'interaction..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button onClick={addInteraction} disabled={loading}>
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {interactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucune interaction enregistrée
            </p>
          ) : (
            interactions.map((interaction) => (
              <div key={interaction.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    {getInteractionIcon(interaction.interaction_type)}
                    <span className="font-medium">
                      {getInteractionLabel(interaction.interaction_type)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(interaction.interaction_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <p className="text-sm">{interaction.notes}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}