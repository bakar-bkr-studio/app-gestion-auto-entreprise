'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Website {
  id: number
  name: string
  url: string
  description?: string
  tag?: string
}

interface WebsitesContextType {
  websites: Website[]
  addWebsite: (site: Omit<Website, 'id'>) => void
  updateWebsite: (id: number, site: Omit<Website, 'id'>) => void
  deleteWebsite: (id: number) => void
}

const WebsitesContext = createContext<WebsitesContextType | undefined>(undefined)

const initialWebsites: Website[] = [
  {
    id: 1,
    name: 'Shadcn UI',
    url: 'https://ui.shadcn.com',
    description: 'Biblioth\u00e8que de composants React',
    tag: 'Outils',
  },
]

export function WebsitesProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('websites')
      if (stored) {
        try {
          setWebsites(JSON.parse(stored) as Website[])
        } catch {
          /* ignore */
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('websites', JSON.stringify(websites))
    }
  }, [websites])

  const addWebsite = (site: Omit<Website, 'id'>) => {
    const id = websites.length ? Math.max(...websites.map(s => s.id)) + 1 : 1
    setWebsites([...websites, { id, ...site }])
  }

  const updateWebsite = (id: number, site: Omit<Website, 'id'>) => {
    setWebsites(websites.map(w => (w.id === id ? { id, ...site } : w)))
  }

  const deleteWebsite = (id: number) => {
    setWebsites(websites.filter(w => w.id !== id))
  }

  return (
    <WebsitesContext.Provider value={{ websites, addWebsite, updateWebsite, deleteWebsite }}>
      {children}
    </WebsitesContext.Provider>
  )
}

export function useWebsites() {
  const context = useContext(WebsitesContext)
  if (!context) {
    throw new Error('useWebsites must be used within WebsitesProvider')
  }
  return context
}
