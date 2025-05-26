import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les tâches
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      setLoading(false);
    }
  };

  // Ajouter une tâche
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const task = await response.json();
      setTasks([task, ...tasks]);
      setNewTask('');
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de la tâche');
    }
  };

  // Modifier une tâche
  const toggleTask = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task._id === id ? updatedTask : task
      ));
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification de la tâche');
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      setTasks(tasks.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la tâche');
    }
  };

  if (loading) return (
    <div className="App">
      <div className="App-header">
        <h2>Chargement...</h2>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="App-header">
        <h1>Liste des Tâches MERN</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="task-input"
          />
          <button type="submit" className="add-button">Ajouter</button>
        </form>

        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id, task.completed)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              <button onClick={() => deleteTask(task._id)} className="delete-button">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
