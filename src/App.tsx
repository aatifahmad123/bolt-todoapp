import React, { useEffect } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { useTodoStore } from './store/todo-store';
import { ListChecks } from 'lucide-react';

function App() {
  const { todos, isLoading, error, fetchTodos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <ListChecks size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Aatif's Todo List</h1>
          </div>

          <TodoInput onAdd={addTodo} />

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="mt-8 space-y-4">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdate={updateTodo}
                />
              ))}
              {todos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No todos yet. Add one above!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;