import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

export const metadata = {
  title: 'BKR STUDIO APP',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        <aside className="flex w-60 flex-col bg-white shadow-md">
          <div className="flex items-center space-x-2 p-6 text-2xl font-bold">
            <Image src="/logo.svg" width={32} height={32} alt="logo" />
            <span>BKR STUDIO APP</span>
          </div>
          <nav className="mt-2 flex flex-col space-y-2 flex-1">
            <Link className="px-6 py-2 hover:bg-gray-100" href="/">
              Tableau de bord
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100" href="/projects">
              Projets
            </Link>
            <Link className="px-6 py-2 hover:bg-gray-100" href="/clients">
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
