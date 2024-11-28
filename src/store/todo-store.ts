import { create } from 'zustand';
import { Todo } from '../types/todo';
import { TodoDB } from '../lib/db';

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
}

const db = new TodoDB();

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true });
    try {
      const todos = await db.getAll();
      set({ todos: todos.reverse(), error: null });
    } catch (error) {
      set({ error: 'Failed to fetch todos' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (title: string) => {
    try {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      await db.add(newTodo);
      set((state) => ({ todos: [newTodo, ...state.todos] }));
    } catch (error) {
      set({ error: 'Failed to add todo' });
    }
  },

  toggleTodo: async (id: string) => {
    try {
      const todo = get().todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
        updatedAt: new Date().toISOString(),
      };
      await db.update(updatedTodo);

      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    } catch (error) {
      set({ error: 'Failed to toggle todo' });
    }
  },

  deleteTodo: async (id: string) => {
    try {
      await db.delete(id);
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete todo' });
    }
  },

  updateTodo: async (id: string, title: string) => {
    try {
      const todo = get().todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        title,
        updatedAt: new Date().toISOString(),
      };
      await db.update(updatedTodo);

      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    } catch (error) {
      set({ error: 'Failed to update todo' });
    }
  },
}));