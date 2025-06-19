import Link from 'next/link';
import { FaPlusCircle, FaListUl, FaUsers } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenue sur BKR STUDIO APP</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/new-project"
          className="flex flex-col items-center rounded-lg bg-white p-6 shadow hover:shadow-md"
        >
          <FaPlusCircle className="mb-2 text-2xl text-blue-600" />
          <span>Créer un projet</span>
        </Link>
        <Link
          href="/projects"
          className="flex flex-col items-center rounded-lg bg-white p-6 shadow hover:shadow-md"
        >
          <FaListUl className="mb-2 text-2xl text-green-600" />
          <span>Voir les projets</span>
        </Link>
        <Link
          href="/clients"
          className="flex flex-col items-center rounded-lg bg-white p-6 shadow hover:shadow-md"
        >
          <FaUsers className="mb-2 text-2xl text-purple-600" />
          <span>Liste des clients</span>
        </Link>
      </div>
    </div>
  );
}
