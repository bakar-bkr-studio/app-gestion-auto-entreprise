import * as React from 'react'

import { cn } from '../lib/utils'

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col w-60 bg-white dark:bg-gray-800 shadow-md', className)}
    {...props}
  />
))
Sidebar.displayName = 'Sidebar'

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('border-b p-4', className)} {...props} />
))
SidebarHeader.displayName = 'SidebarHeader'

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('px-2 py-4 space-y-1', className)} {...props} />
))
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('list-none', className)} {...props} />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700',
      className
    )}
    {...props}
  />
))
SidebarMenuButton.displayName = 'SidebarMenuButton'

export { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton }
