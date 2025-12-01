import { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  onClose: () => void;
}

export function TodoList({ onClose }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete project proposal', completed: false },
    { id: '2', text: 'Review design mockups', completed: true },
    { id: '3', text: 'Prepare presentation slides', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-green-500/30 animate-in slide-in-from-bottom-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 text-green-400/60 hover:text-green-400 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mb-4">
        <h2 className="text-green-400 text-xl mb-1">Tasks</h2>
        <p className="text-green-500/60 text-sm">
          {completedCount} of {totalCount} completed
        </p>
      </div>

      {/* Add Todo Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-900 border border-green-500/30 rounded-xl px-3 py-2 text-green-400 text-sm placeholder-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        />
        <button
          onClick={addTodo}
          className="p-2 bg-green-500 text-black rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-green-500/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-green-500/40 text-sm">
            No tasks yet. Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group bg-gray-900/50 hover:bg-gray-900 rounded-xl p-3 transition-all duration-300 flex items-center gap-3 border border-green-500/10"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-green-500/40 hover:border-green-500'
                }`}
              >
                {todo.completed && <Check className="w-3 h-3 text-black" />}
              </button>
              <span
                className={`flex-1 text-green-400 text-sm transition-all duration-300 ${
                  todo.completed ? 'line-through opacity-50' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-300 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}