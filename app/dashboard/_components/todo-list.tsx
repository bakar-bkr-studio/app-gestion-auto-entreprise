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
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2">
            {category === 'tasks' ? (
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            ) : (
              <Circle className="h-4 w-4 text-purple-500" />
            )}
            {category === 'tasks' ? 'Tâches à effectuer' : 'Idées de contenu'}
          </span>
          {totalCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {completedCount}/{totalCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <div>Loading...</div>}
        
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <div className="mb-1">
                {category === 'tasks' ? (
                  <CheckCircle2 className="h-8 w-8 mx-auto text-gray-300" />
                ) : (
                  <Circle className="h-8 w-8 mx-auto text-gray-300" />
                )}
              </div>
              <p className="text-xs">
                {category === 'tasks' ? 'Aucune tâche pour le moment' : 'Aucune idée pour le moment'}
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id} 
                className={cn(
                  "group flex items-center space-x-2 p-2 rounded-md border transition-all duration-200 hover:shadow-sm",
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
                    "flex-1 text-xs cursor-pointer transition-all duration-200",
                    todo.completed 
                      ? "line-through text-green-600 dark:text-green-400" 
                      : "text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {todo.title}
                </label>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-center space-x-2 pt-1.5 border-t border-gray-200 dark:border-gray-700">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder={category === 'tasks' ? "Nouvelle tâche..." : "Nouvelle idée..."}
            className="flex-1 h-8 text-xs border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <Button 
            size="sm"
            onClick={handleAdd}
            disabled={!input.trim()}
            className={cn(
              "h-8 w-8 transition-all duration-200",
              category === 'tasks' 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-purple-500 hover:bg-purple-600"
            )}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
