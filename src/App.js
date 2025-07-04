import React, { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const TASKS_STORAGE_KEY = 'tasks';

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (parsedTasks && parsedTasks.length > 0) {
          setTasks(parsedTasks);
          return;
        }
      }
      await fetchTasks();
    } catch (error) {
      console.error('Tasks load error:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      const formattedTasks = data.map(post => ({
        id: post.id,
        title: post.title,
        completed: false
      }));
      
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(formattedTasks));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const saveTasksToStorage = (updatedTasks) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const addTask = (e) => {
    e.preventDefault();
    const taskContent = inputValue.trim();
    if (taskContent.length > 0) {
      const newTask = {
        id: Date.now(),
        title: taskContent,
        completed: false
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      setInputValue('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="app">
      <header>
        <h1>ToDoList</h1>
      </header>

      <main>
        <details className="task-container">
          <summary>Active</summary>
          <form onSubmit={addTask}>
            <input
              type="text"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="write description of your task"
              className="task-input"
            />
            <button type="submit" className="add-task-button">+</button>
          </form>
          <TaskList 
            tasks={activeTasks} 
            onDelete={deleteTask} 
            onToggle={toggleTaskStatus}
          />
        </details>

        <details className="task-container">
          <summary>Completed</summary>
          <TaskList 
            tasks={completedTasks} 
            onDelete={deleteTask} 
            onToggle={toggleTaskStatus}
            completed
          />
        </details>

        <details className="task-container">
          <summary>All</summary>
          <TaskList 
            tasks={tasks} 
            onDelete={deleteTask} 
            onToggle={toggleTaskStatus}
          />
        </details>
      </main>

      <footer>
        <hr />
        <a 
          id="copyright" 
          href="https://www.youtube.com/watch?v=E4WlUXrJgy4" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Copyright
        </a>
      </footer>
    </div>
  );
};

const TaskList = ({ tasks, onDelete, onToggle, completed = false }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          completed={completed}
        />
      ))}
    </ul>
  );
};

const TaskItem = ({ task, onDelete, onToggle, completed }) => {
  return (
    <li className="task">
      <input
        type="checkbox"
        id={`task-${task.id}`}
        checked={completed || task.completed}
        onChange={() => onToggle(task.id)}
      />
      <label htmlFor={`task-${task.id}`} className="task-content">
        {task.title}
      </label>
      <button className="delete-button" onClick={() => onDelete(task.id)}>
        𐤕
      </button>
    </li>
  );
};

export default App;