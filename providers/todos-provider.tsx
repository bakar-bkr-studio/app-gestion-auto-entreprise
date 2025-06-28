'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type Category = 'tasks' | 'ideas'

export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
  category: Category
}

interface TodosContextValue {
  todos: Record<Category, Todo[]>
  loading: Record<Category, boolean>
  error: string | null
  addTodo: (category: Category, title: string) => Promise<void>
  deleteTodo: (category: Category, id: string) => Promise<void>
  toggleTodo: (category: Category, id: string) => Promise<void>
}

const TodosContext = createContext<TodosContextValue | undefined>(undefined)

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Record<Category, Todo[]>>({ tasks: [], ideas: [] })
  const [loading, setLoading] = useState<Record<Category, boolean>>({ tasks: false, ideas: false })
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = async (category: Category) => {
    setLoading(prev => ({ ...prev, [category]: true }))
    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError(fetchError.message)
    } else if (data) {
      setTodos(prev => ({ ...prev, [category]: data as Todo[] }))
      setError(null)
    }
    setLoading(prev => ({ ...prev, [category]: false }))
  }

  useEffect(() => {
    fetchTodos('tasks')
    fetchTodos('ideas')
  }, [])

  const addTodo = async (category: Category, title: string) => {
    setLoading(prev => ({ ...prev, [category]: true }))
    const { data: userData } = await supabase.auth.getUser()
    const { data, error: insertError } = await supabase
      .from('todos')
      .insert({ title, completed: false, category, user_id: userData?.user?.id })
      .select('*')
      .single()
    if (insertError) {
      setError(insertError.message)
    } else if (data) {
      setTodos(prev => ({ ...prev, [category]: [data as Todo, ...prev[category]] }))
      setError(null)
    }
    setLoading(prev => ({ ...prev, [category]: false }))
  }

  const deleteTodo = async (category: Category, id: string) => {
    setLoading(prev => ({ ...prev, [category]: true }))
    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      setTodos(prev => ({ ...prev, [category]: prev[category].filter(t => t.id !== id) }))
      setError(null)
    }
    setLoading(prev => ({ ...prev, [category]: false }))
  }

  const toggleTodo = async (category: Category, id: string) => {
    setLoading(prev => ({ ...prev, [category]: true }))
    const current = todos[category].find(t => t.id === id)
    const { data, error: updateError } = await supabase
      .from('todos')
      .update({ completed: !current?.completed })
      .eq('id', id)
      .select('*')
      .single()
    if (updateError) {
      setError(updateError.message)
    } else if (data) {
      setTodos(prev => ({ ...prev, [category]: prev[category].map(t => (t.id === id ? (data as Todo) : t)) }))
      setError(null)
    }
    setLoading(prev => ({ ...prev, [category]: false }))
  }

  return (
    <TodosContext.Provider value={{ todos, loading, error, addTodo, deleteTodo, toggleTodo }}>
      {children}
    </TodosContext.Provider>
  )
}

export function useTodos(category: Category) {
  const context = useContext(TodosContext)
  if (!context) {
    throw new Error('useTodos must be used within TodosProvider')
  }
  return {
    todos: context.todos[category],
    loading: context.loading[category],
    error: context.error,
    addTodo: (title: string) => context.addTodo(category, title),
    deleteTodo: (id: string) => context.deleteTodo(category, id),
    toggleTodo: (id: string) => context.toggleTodo(category, id),
  }
}
