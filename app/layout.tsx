'use client';
import '../styles/globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { ReactNode, useState } from 'react';
import { ProjectsProvider } from '../components/ProjectsProvider';
import { WebsitesProvider } from '../components/WebsitesProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="fr" className="dark">
      <body className="flex min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <Sidebar collapsed={collapsed}>
          <SidebarHeader className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="rounded p-1 hover:bg-gray-700"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            {!collapsed && (
              <div className="flex items-center space-x-2 text-2xl font-bold">
                <Image src="/logo.svg" width={32} height={32} alt="logo" />
                <span>BKR STUDIO APP</span>
              </div>
            )}
          </SidebarHeader>
          <SidebarMenu className="mt-2 flex-1">
            <SidebarMenuItem>
              <Link className="block px-6 py-2 text-white hover:bg-gray-700" href="/">
                Tableau de bord
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 text-white hover:bg-gray-700" href="/projects">
                Projets
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 text-white hover:bg-gray-700" href="/clients">
                Clients
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 text-white hover:bg-gray-700" href="/organisation">
                Organisation
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 text-white hover:bg-gray-700" href="/ressources">
                Ressources
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <ProjectsProvider>
          <WebsitesProvider>
            <main className="flex-1">{children}</main>
          </WebsitesProvider>
        </ProjectsProvider>
      </body>
    </html>
  );
}
