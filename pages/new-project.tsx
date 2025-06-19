import React, { useState } from 'react';

const NewProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Conception');
  const [type, setType] = useState('Photo');
  const [budget, setBudget] = useState(0);

  const handleCreateProject = () => {
    console.log({ name, client, description, startDate, dueDate, status, type, budget });
  };

  const handleCancel = () => {
    window.location.href = '/projects';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Nouveau projet</h1>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="mb-1 block font-semibold">Nom du projet</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Client</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            <option value="Client A">Client A</option>
            <option value="Client B">Client B</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold">Description</label>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Date de d\xE9but</label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Date pr\xE9vue</label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold">Statut</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {['Conception', 'Tournage', 'Montage', 'Pr\xEAt', 'Envoy\xE9', 'Termin\xE9'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold">Type de projet</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Photo">Photo</option>
            <option value="Video">Vid\xE9o</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold">Budget (\u20AC)</label>
          <input
            type="number"
            className="w-full rounded border px-3 py-2"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </div>
        <div className="mt-6 flex space-x-2">
          <button
            onClick={handleCreateProject}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            ✅ Cr\xE9er le projet
          </button>
          <button
            onClick={handleCancel}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            ❌ Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectPage;
