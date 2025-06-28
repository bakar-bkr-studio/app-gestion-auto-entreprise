"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { useTodos } from "@/providers/todos-provider";

interface TodoListProps {
  defaultTitle: string;
}

export default function TodoList({ defaultTitle }: TodoListProps) {
  const { todos, addTodo, deleteTodo, updateTodo, loading } = useTodos();
  const [title, setTitle] = useState(defaultTitle);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTodo(text);
    setInput("");
  };

  const toggle = (id: string, completed: boolean, currentTitle: string) => {
    updateTodo(id, currentTitle, !completed);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-semibold text-lg"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <div>Loading...</div>}
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center space-x-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggle(todo.id, todo.completed, todo.title)}
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
