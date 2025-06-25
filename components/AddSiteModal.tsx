'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Website } from './WebsitesProvider'

interface AddSiteModalProps {
  isOpen: boolean
  onAdd: (site: Omit<Website, 'id'>) => void
  onUpdate?: (site: Omit<Website, 'id'>) => void
  onClose: () => void
  site?: Website | null
}

export default function AddSiteModal({ isOpen, onAdd, onUpdate, onClose, site }: AddSiteModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')

  useEffect(() => {
    if (site) {
      setName(site.name)
      setUrl(site.url)
      setDescription(site.description ?? '')
      setTag(site.tag ?? '')
    } else {
      setName('')
      setUrl('')
      setDescription('')
      setTag('')
    }
  }, [site])

  if (!isOpen) return null

  const submit = () => {
    if (!name || !url) return
    const data = { name, url, description: description || undefined, tag: tag || undefined }
    if (site) onUpdate?.(data)
    else onAdd(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-2 w-full max-w-md animate-in fade-in-0 zoom-in-95">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{site ? 'Modifier un site' : 'Ajouter un site'}</CardTitle>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du site</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Tag / Cat\u00e9gorie</Label>
            <Input id="tag" value={tag} onChange={e => setTag(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="button" onClick={submit}>{site ? 'Modifier' : 'Ajouter'}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
