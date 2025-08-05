'use client'

import { useState } from 'react'
import { FileText, Download, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { supabase } from '@/lib/supabaseClient'
import jsPDF from 'jspdf'

interface Project {
  id: number
  name: string
  client: string
  budget: number
  description: string
}

interface InvoiceGeneratorProps {
  project: Project
  onClose: () => void
}

export default function InvoiceGenerator({ project, onClose }: InvoiceGeneratorProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid' | 'overdue'>('draft')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // En-tête
    doc.setFontSize(20)
    doc.text('FACTURE', 20, 30)
    
    doc.setFontSize(12)
    doc.text(`Numéro: ${invoiceNumber}`, 20, 50)
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60)
    doc.text(`Échéance: ${dueDate ? new Date(dueDate).toLocaleDateString('fr-FR') : 'Non définie'}`, 20, 70)
    
    // Informations client
    doc.text('FACTURÉ À:', 20, 90)
    doc.text(project.client, 20, 100)
    
    // Détails du projet
    doc.text('DESCRIPTION DES SERVICES:', 20, 120)
    doc.text(`Projet: ${project.name}`, 20, 130)
    
    const splitDescription = doc.splitTextToSize(project.description, 170)
    doc.text(splitDescription, 20, 140)
    
    // Montant
    doc.text('MONTANT:', 20, 180)
    doc.setFontSize(16)
    doc.text(`${project.budget} €`, 20, 190)
    
    // Notes additionnelles
    if (additionalNotes) {
      doc.setFontSize(12)
      doc.text('NOTES:', 20, 210)
      const splitNotes = doc.splitTextToSize(additionalNotes, 170)
      doc.text(splitNotes, 20, 220)
    }
    
    return doc
  }

  const handleDownload = () => {
    const doc = generatePDF()
    doc.save(`facture-${invoiceNumber}.pdf`)
  }

  const handleSave = async () => {
    setLoading(true)
    
    const { data: userData } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('invoices').insert({
      project_id: project.id,
      user_id: userData?.user?.id,
      invoice_number: invoiceNumber,
      client_name: project.client,
      amount: project.budget,
      status,
      due_date: dueDate || null
    })

    if (!error) {
      handleDownload()
      onClose()
    }
    
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générer une facture - {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-number">Numéro de facture</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="due-date">Date d'échéance</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">Envoyée</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="additional-notes">Notes additionnelles</Label>
            <Textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Conditions de paiement, informations supplémentaires..."
              rows={3}
            />
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Aperçu de la facture</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Client:</strong> {project.client}</div>
              <div><strong>Projet:</strong> {project.name}</div>
              <div><strong>Montant:</strong> {project.budget} €</div>
              <div><strong>Numéro:</strong> {invoiceNumber}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger uniquement
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder et télécharger'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}