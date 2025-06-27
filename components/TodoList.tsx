'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Trash } from 'lucide-react'
import { cn } from './lib/utils'

interface Item {
  id: number
  text: string
  done: boolean
}

interface TodoListProps {
  storageKey: string
  defaultTitle: string
}

export default function TodoList({ storageKey, defaultTitle }: TodoListProps) {
  const [title, setTitle] = useState(defaultTitle)
  const [items, setItems] = useState<Item[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const data = JSON.parse(stored) as { title: string; items: Item[] }
          setTitle(data.title || defaultTitle)
          setItems(data.items || [])
        } catch {
          /* ignore */
        }
      }
    }
  }, [storageKey, defaultTitle])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({ title, items }))
    }
  }, [title, items, storageKey])

  const addItem = () => {
    const text = input.trim()
    if (!text) return
    setItems(prev => [...prev, { id: Date.now(), text, done: false }])
    setInput('')
  }

  const toggle = (id: number) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  const remove = (id: number) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="font-semibold text-lg"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox checked={item.done} onCheckedChange={() => toggle(item.id)} id={`cb-${storageKey}-${item.id}`} />
            <label
              htmlFor={`cb-${storageKey}-${item.id}`}
              className={cn('flex-1 text-sm', item.done && 'line-through text-muted-foreground')}
            >
              {item.text}
            </label>
            <Button size="icon" variant="ghost" onClick={() => remove(item.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2 pt-1">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addItem()
            }}
            placeholder="Ajouter..."
          />
          <Button size="icon" onClick={addItem}>
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
