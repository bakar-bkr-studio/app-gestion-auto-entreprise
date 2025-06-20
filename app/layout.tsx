import '../styles/globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'BKR STUDIO APP',
};

import { ReactNode } from 'react';
import { ProjectsProvider } from '../components/ProjectsProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="flex min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <aside className="w-60 flex-col bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center space-x-2 p-6 text-2xl font-bold">
            <Image src="/logo.svg" width={32} height={32} alt="logo" />
            <span>BKR STUDIO APP</span>
          </div>
          <nav className="mt-2 flex flex-col space-y-2 flex-1">
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/">Tableau de bord</Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/projects">Projets</Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/clients">Clients</Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/organisation">Organisation</Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/ressources">Ressources</Link>
          </nav>
        </aside>
        <ProjectsProvider>
          <main className="flex-1">{children}</main>
        </ProjectsProvider>
      </body>
    </html>
  );
}
