import React, { useReducer, useRef, useMemo, useCallback, useState } from 'react';

// Reducer logic for task state management
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'ADD':
      return [
        ...tasks,
        { id: Date.now(), text: action.text, completed: false }
      ];
    case 'TOGGLE':
      return tasks.map(task =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE':
      return tasks.filter(task => task.id !== action.id);
    default:
      return tasks;
  }
}

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [filter, setFilter] = useState('all');
  const inputRef = useRef();
  const [input, setInput] = useState('');

  // Memoized filter
  const filteredTasks = useMemo(() => {
    if (filter === 'completed') {
      return tasks.filter(t => t.completed);
    } else if (filter === 'uncompleted') {
      return tasks.filter(t => !t.completed);
    }
    return tasks;
  }, [tasks, filter]);

  // Memoized handlers
  const handleAdd = useCallback(
    e => {
      e.preventDefault();
      if (input.trim() !== '') {
        dispatch({ type: 'ADD', text: input });
        setInput('');
        inputRef.current.focus(); // focus input after add
      }
    },
    [input]
  );

  const handleToggle = useCallback(id => dispatch({ type: 'TOGGLE', id }), []);
  const handleDelete = useCallback(id => dispatch({ type: 'DELETE', id }), []);

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Task Manager</h2>
      <form onSubmit={handleAdd}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('uncompleted')}>Uncompleted</button>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
            />
            <span
              style={{
                flex: 1,
                marginLeft: 8,
                textDecoration: task.completed ? 'line-through' : 'none'
              }}
            >
              {task.text}
            </span>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
