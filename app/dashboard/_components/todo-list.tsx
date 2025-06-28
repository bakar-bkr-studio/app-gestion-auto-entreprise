"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { useTodos, Category } from "@/providers/todos-provider";

interface TodoListProps {
  category: Category;
}

export default function TodoList({ category }: TodoListProps) {
  const { todos, addTodo, deleteTodo, toggleTodo, loading } = useTodos(category);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTodo(text);
    setInput("");
  };

  const toggle = (id: string) => {
    toggleTodo(id);
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        {loading && <div>Loading...</div>}
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center space-x-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggle(todo.id)}
              id={`cb-${todo.id}`}
            />
            <label
              htmlFor={`cb-${todo.id}`}
              className={cn(
                "flex-1 text-sm",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </label>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2 pt-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="Ajouter..."
          />
          <Button size="icon" onClick={handleAdd}>
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
