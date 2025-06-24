import '../styles/globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { ReactNode } from 'react';
import { ProjectsProvider } from '../components/ProjectsProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="flex min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Image src="/logo.svg" width={32} height={32} alt="logo" />
              <span>BKR STUDIO APP</span>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      Select Workspace
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                    <DropdownMenuItem>
                      <span>Acme Inc</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Acme Corp.</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarMenu className="mt-2 flex-1">
            <SidebarMenuItem>
              <Link className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/">
                Tableau de bord
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/projects">
                Projets
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/clients">
                Clients
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/organisation">
                Organisation
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" href="/ressources">
                Ressources
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <ProjectsProvider>
          <main className="flex-1">{children}</main>
        </ProjectsProvider>
      </body>
    </html>
  );
}
