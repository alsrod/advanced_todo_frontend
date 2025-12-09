import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import { FaTrash, FaCheck, FaPlus, FaEdit, FaTimes } from 'react-icons/fa';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const newTodo = await createTodo({ text: inputText });
      setTodos([...todos, newTodo]);
      setInputText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updated = await updateTodo(todo._id, { ...todo, completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === todo._id ? updated : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const updated = await updateTodo(id, { text: editText });
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="header">
          <h1>My Tasks</h1>
          <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </header>

        <form onSubmit={handleAddTodo} className="input-group">
          <input
            type="text"
            placeholder="Add a new task..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <FaPlus />
          </button>
        </form>

        <div className="todo-list">
          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  className={`check-btn ${todo.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleComplete(todo)}
                >
                  <FaCheck />
                </button>

                <div className="todo-content">
                  {editingId === todo._id ? (
                    <div className="edit-mode">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo._id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <div className="edit-actions">
                        <button onClick={() => saveEdit(todo._id)} className="save-btn"><FaCheck /></button>
                        <button onClick={cancelEditing} className="cancel-btn"><FaTimes /></button>
                      </div>
                    </div>
                  ) : (
                    <span onClick={() => handleToggleComplete(todo)} className="todo-text">
                      {todo.text}
                    </span>
                  )}
                </div>

                <div className="actions">
                  {editingId !== todo._id && (
                    <>
                      <button className="icon-btn edit-btn" onClick={() => startEditing(todo)}>
                        <FaEdit />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteTodo(todo._id)}>
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
