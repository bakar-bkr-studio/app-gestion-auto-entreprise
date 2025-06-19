'use client';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';

export const metadata = {
  title: 'BKR STUDIO APP',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const linkClass = (path: string) =>
    `px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
      pathname === path ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''
    }`;

  return (
    <html lang="fr" className={dark ? 'dark' : ''}>
      <body className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <aside className="flex w-60 flex-col bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center space-x-2 p-6 text-2xl font-bold">
            <Image src="/logo.svg" width={32} height={32} alt="logo" />
            <span>BKR STUDIO APP</span>
          </div>
          <nav className="mt-2 flex flex-col space-y-2 flex-1">
            <Link className={linkClass('/')} href="/">
              Tableau de bord
            </Link>
            <Link className={linkClass('/projects')} href="/projects">
              Projets
            </Link>
            <Link className={linkClass('/clients')} href="/clients">
              Clients
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
              Organisation
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
              Ressources
            </Link>
          </nav>
          <div className="mt-auto space-y-2 p-6">
            <button
              onClick={() => setDark(!dark)}
              className="w-full rounded bg-gray-200 dark:bg-gray-700 px-3 py-1 text-sm"
            >
              {dark ? 'Mode clair' : 'Mode sombre'}
            </button>
            <button className="w-full rounded px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              Déconnexion
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
