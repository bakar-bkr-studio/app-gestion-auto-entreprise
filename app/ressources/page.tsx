'use client';

import { useState } from 'react';
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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ajouter un document</h3>
          <button onClick={onClose} aria-label="close" className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du document</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Catégorie principale</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" rows={2} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tags secondaires</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="mariage, corporate" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Chemin local du fichier</label>
            <input value={path} onChange={e => setPath(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={priority} onChange={e => setPriority(e.target.checked)} />
            <span>Document prioritaire</span>
          </label>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="rounded border px-4 py-1 hover:bg-gray-100">Annuler</button>
          <button onClick={submit} className="rounded bg-black px-4 py-1 text-white hover:bg-gray-800">Ajouter</button>
        </div>
      </div>
    </div>
  );
}


