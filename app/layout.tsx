'use client';
import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export const metadata = {
  title: 'BKR STUDIO APP',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const linkClass = (path: string) =>
    `px-6 py-2 hover:bg-gray-100 ${pathname === path ? 'bg-gray-200 font-semibold' : ''}`;

  return (
    <html lang="fr">
      <body className="flex min-h-screen bg-gray-50">
        <aside className="w-60 bg-white shadow-md">
          <div className="p-6 text-2xl font-bold">BKR STUDIO APP</div>
          <nav className="mt-8 flex flex-col space-y-2">
            <Link className={linkClass('/')} href="/">
              Tableau de bord
            </Link>
            <Link className={linkClass('/projects')} href="/projects">
              Projets
            </Link>
            <Link className={linkClass('/clients')} href="/clients">
              Clients
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100" href="#">
              Organisation
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100" href="#">
              Ressources
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
