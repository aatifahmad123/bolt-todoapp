import React, { useState } from 'react';
import { Check, Trash2, Edit2, X, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onUpdate(todo.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
          todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"
        )}
      >
        {todo.completed && <Check size={12} className="text-white" />}
      </button>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 px-2 py-1 border rounded-md"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 text-green-600 hover:text-green-700"
          >
            <Save size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(todo.title);
            }}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </form>
      ) : (
        <>
          <span className={cn("flex-1", todo.completed && "line-through text-gray-500")}>
            {todo.title}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-600 hover:text-blue-700"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  );
}