"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TodosContextValue {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, newTitle: string, completed: boolean) => Promise<void>;
}

const TodosContext = createContext<TodosContextValue | undefined>(undefined);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else if (data) {
        setTodos(data as Todo[]);
        setError(null);
      }
      setLoading(false);
    };

    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: text, completed: false })
      .select("*")
      .single();
    if (error) {
      setError(error.message);
    } else if (data) {
      setTodos((prev) => [data as Todo, ...prev]);
      setError(null);
    }
    setLoading(false);
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    }
    setLoading(false);
  };

  const updateTodo = async (id: string, newTitle: string, completed: boolean) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .update({ title: newTitle, completed })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      setError(error.message);
    } else if (data) {
      setTodos((prev) => prev.map((t) => (t.id === id ? (data as Todo) : t)));
      setError(null);
    }
    setLoading(false);
  };

  return (
    <TodosContext.Provider
      value={{ todos, loading, error, addTodo, deleteTodo, updateTodo }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodos must be used within TodosProvider");
  }
  return context;
}
