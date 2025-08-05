"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus, CheckCircle2, Circle } from "lucide-react";
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

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  return (
    <Card className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span className="flex items-center gap-2">
            {category === 'tasks' ? (
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            ) : (
              <Circle className="h-5 w-5 text-purple-500" />
            )}
            {category === 'tasks' ? 'Tâches à effectuer' : 'Idées de contenu'}
          </span>
          {totalCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {completedCount}/{totalCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <div>Loading...</div>}
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-2">
                {category === 'tasks' ? (
                  <CheckCircle2 className="h-12 w-12 mx-auto text-gray-300" />
                ) : (
                  <Circle className="h-12 w-12 mx-auto text-gray-300" />
                )}
              </div>
              <p className="text-sm">
                {category === 'tasks' ? 'Aucune tâche pour le moment' : 'Aucune idée pour le moment'}
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id} 
                className={cn(
                  "group flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
                  todo.completed 
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggle(todo.id)}
                  id={`cb-${todo.id}`}
                  className={cn(
                    "transition-colors",
                    todo.completed && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  )}
                />
                <label
                  htmlFor={`cb-${todo.id}`}
                  className={cn(
                    "flex-1 text-sm cursor-pointer transition-all duration-200",
                    todo.completed 
                      ? "line-through text-green-600 dark:text-green-400" 
                      : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {todo.title}
                </label>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder={category === 'tasks' ? "Nouvelle tâche..." : "Nouvelle idée..."}
            className="flex-1 border-0 bg-gray-50 dark:bg-gray-800 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <Button 
            size="icon" 
            onClick={handleAdd}
            disabled={!input.trim()}
            className={cn(
              "transition-all duration-200",
              category === 'tasks' 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-purple-500 hover:bg-purple-600"
            )}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
