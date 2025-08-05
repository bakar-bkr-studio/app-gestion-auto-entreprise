'use client';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Folder,
  Users,
  ListTodo,
  FileText,
  LogOut,
} from 'lucide-react';
import { cn } from '../components/lib/utils';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import type { ReactNode } from 'react';
import { ProjectsProvider } from '../components/ProjectsProvider';
import { WebsitesProvider } from '../components/WebsitesProvider';
import { ClientsProvider } from '@/components/ClientsProvider';
import { TodosProvider } from '@/providers/todos-provider';
import { Button } from '@/components/ui/button';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <html lang="fr" className="dark">
        <body className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </body>
      </html>
    );
  }

  if (!user && !pathname?.startsWith('/auth')) {
    return (
      <html lang="fr" className="dark">
        <body className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </body>
      </html>
    );
  }

  return (
    <html lang="fr" className="dark">
      <body className="flex min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {user && !pathname?.startsWith('/auth') && (
        <Sidebar collapsed={collapsed}>
          <SidebarHeader className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="rounded p-1 hover:bg-gray-700"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Image src="/logo.svg" width={32} height={32} alt="logo" />
              {!collapsed && <span>BKR STUDIO APP</span>}
            </div>
          </SidebarHeader>
          <SidebarMenu className="mt-2 flex-1">
            <SidebarMenuItem>
              <Link
                href="/"
                className={cn(
                  'flex items-center rounded px-6 py-2 transition-all hover:bg-muted/20 hover:font-semibold',
                  collapsed ? 'gap-0 justify-center' : 'gap-2',
                  pathname === '/'
                    ? 'bg-muted border-l-4 border-primary font-bold text-primary'
                    : 'text-white'
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className={cn('transition-all', collapsed && 'w-0 overflow-hidden opacity-0')}>
                  Tableau de bord
                </span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                href="/projects"
                className={cn(
                  'flex items-center rounded px-6 py-2 transition-all hover:bg-muted/20 hover:font-semibold',
                  collapsed ? 'gap-0 justify-center' : 'gap-2',
                  pathname?.startsWith('/projects')
                    ? 'bg-muted border-l-4 border-primary font-bold text-primary'
                    : 'text-white'
                )}
              >
                <Folder className="h-5 w-5" />
                <span className={cn('transition-all', collapsed && 'w-0 overflow-hidden opacity-0')}>Projets</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                href="/clients"
                className={cn(
                  'flex items-center rounded px-6 py-2 transition-all hover:bg-muted/20 hover:font-semibold',
                  collapsed ? 'gap-0 justify-center' : 'gap-2',
                  pathname?.startsWith('/clients')
                    ? 'bg-muted border-l-4 border-primary font-bold text-primary'
                    : 'text-white'
                )}
              >
                <Users className="h-5 w-5" />
                <span className={cn('transition-all', collapsed && 'w-0 overflow-hidden opacity-0')}>Clients</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                href="/organisation"
                className={cn(
                  'flex items-center rounded px-6 py-2 transition-all hover:bg-muted/20 hover:font-semibold',
                  collapsed ? 'gap-0 justify-center' : 'gap-2',
                  pathname?.startsWith('/organisation')
                    ? 'bg-muted border-l-4 border-primary font-bold text-primary'
                    : 'text-white'
                )}
              >
                <ListTodo className="h-5 w-5" />
                <span className={cn('transition-all', collapsed && 'w-0 overflow-hidden opacity-0')}>Organisation</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                href="/ressources"
                className={cn(
                  'flex items-center rounded px-6 py-2 transition-all hover:bg-muted/20 hover:font-semibold',
                  collapsed ? 'gap-0 justify-center' : 'gap-2',
                  pathname?.startsWith('/ressources')
                    ? 'bg-muted border-l-4 border-primary font-bold text-primary'
                    : 'text-white'
                )}
              >
                <FileText className="h-5 w-5" />
                <span className={cn('transition-all', collapsed && 'w-0 overflow-hidden opacity-0')}>Ressources</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-auto p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <div className="text-sm text-gray-300 truncate">
                  {user?.email}
                </div>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSignOut}
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>
        )}
        <ProjectsProvider>
          <WebsitesProvider>
            <ClientsProvider>
              <TodosProvider>
                <main className={cn("flex-1", !user && "w-full")}>{children}</main>
              </TodosProvider>
            </ClientsProvider>
          </WebsitesProvider>
        </ProjectsProvider>
      </body>
    </html>
  );
}
