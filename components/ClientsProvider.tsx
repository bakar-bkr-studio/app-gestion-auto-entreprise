'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@/lib/auth'

export interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  address: string
  status: string
  tags: string
  created_at: string
}

interface ClientsContextValue {
  clients: Client[]
  loading: boolean
  addClient: (client: Omit<Client, 'id' | 'created_at'>) => Promise<void>
}

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const authClient = createClient()

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (error) {
        console.error('Error loading clients:', error)
      } else if (data) {
        setClients(data as Client[])
      }
      setLoading(false)
    }

    fetchClients()
  }, [])

  const addClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
      
    if (error) {
      console.error('Error adding client:', error)
      return
    }
    if (data) {
      setClients((prev) => [...prev, data as Client])
    }
  }

  return (
    <ClientsContext.Provider value={{ clients, loading, addClient }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients must be used within ClientsProvider')
  }
  return context
}
