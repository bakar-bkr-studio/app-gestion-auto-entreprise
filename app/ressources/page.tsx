'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Globe, Plus, Star } from 'lucide-react';
import AddSiteModal from '@/components/AddSiteModal'
import { useWebsites } from '@/components/WebsitesProvider'

interface DocumentItem {
  id: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
  date: string; // DD/MM/YYYY
  path: string;
  priority: boolean;
}


const initialDocuments: DocumentItem[] = [
  {
    id: 1,
    name: 'Contrat Marie Dubois – Mariage',
    category: 'Contrat',
    description: 'Modèle de contrat pour prestation mariage',
    tags: ['mariage'],
    date: '10/04/2024',
    path: '/docs/contrat-marie.pdf',
    priority: true,
  },
];


export default function RessourcesPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const { websites: sites, addWebsite } = useWebsites();
  const [showDocModal, setShowDocModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);

  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const id = documents.length ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    setDocuments([...documents, { id, ...doc }]);
  };


  return (
    <div className="space-y-8 p-6">
      <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-100 text-black p-4 shadow-md">
        <header className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-900">
            <FileText className="mr-2 h-5 w-5" /> Documents
          </h2>
          <button
            onClick={() => setShowDocModal(true)}
            className="flex items-center rounded bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
          >
            <Plus className="mr-1 h-4 w-4" /> Ajouter un document
          </button>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="group relative rounded-xl border border-gray-200 bg-gray-100 text-black p-4 shadow-md transition-transform hover:scale-105"
            >
              {doc.priority && (
                <Star className="absolute right-2 top-2 h-4 w-4 text-yellow-500" />
              )}
              <h3 className="mb-1 font-bold">{doc.name}</h3>
              <span className="mb-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                {doc.category}
              </span>
              <p className="text-sm text-gray-700 line-clamp-1">{doc.description}</p>
              <div className="mt-1 flex flex-wrap gap-1 text-xs">
                {doc.tags.map(tag => (
                  <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{doc.date}</span>
                <a href={doc.path} className="text-blue-600 underline" download>
                  Télécharger
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-100 text-black p-4 shadow-md">
        <header className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-900">
            <Globe className="mr-2 h-5 w-5" /> Sites Web
          </h2>
          <button
            onClick={() => setShowSiteModal(true)}
            className="flex items-center rounded bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
          >
            <Plus className="mr-1 h-4 w-4" /> Ajouter un site
          </button>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map(site => (
            <div
              key={site.id}
              className="rounded-xl border border-gray-200 bg-gray-100 text-black p-4 shadow-md transition-transform hover:scale-105"
            >
              <h3 className="font-bold">{site.name}</h3>
              <p className="text-sm text-gray-600">{site.category}</p>
              <p className="text-sm text-gray-700 line-clamp-1">{site.description}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Ouvrir
                </a>
                <span className="text-gray-400">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showDocModal && (
        <AddDocumentModal
          onAdd={addDocument}
          onClose={() => setShowDocModal(false)}
        />
      )}

      {showSiteModal && (
        <AddSiteModal
          isOpen={showSiteModal}
          onAdd={site => addWebsite(site)}
          onClose={() => setShowSiteModal(false)}
        />
      )}
    </div>
  );
}

interface AddDocumentModalProps {
  onAdd: (doc: Omit<DocumentItem, 'id'>) => void;
  onClose: () => void;
}

function AddDocumentModal({ onAdd, onClose }: AddDocumentModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState('');
  const [path, setPath] = useState('');
  const [priority, setPriority] = useState(false);

  const submit = () => {
    if (!name) return;
    onAdd({
      name,
      category,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      date,
      path,
      priority,
    });
    onClose();
    setName('');
    setCategory('');
    setDescription('');
    setTags('');
    setDate('');
    setPath('');
    setPriority(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="doc-name">Nom du document</Label>
            <Input
              id="doc-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="doc-category">Catégorie principale</Label>
            <Input
              id="doc-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="doc-description">Description</Label>
            <Textarea
              id="doc-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="doc-tags">Tags secondaires</Label>
            <Input
              id="doc-tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="mariage, corporate"
            />
          </div>
          <div>
            <Label htmlFor="doc-date">Date</Label>
            <Input
              id="doc-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="doc-path">Chemin local du fichier</Label>
            <Input
              id="doc-path"
              value={path}
              onChange={e => setPath(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="doc-priority"
              checked={priority} 
              onChange={e => setPriority(e.target.checked)} 
            />
            <Label htmlFor="doc-priority">Document prioritaire</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


