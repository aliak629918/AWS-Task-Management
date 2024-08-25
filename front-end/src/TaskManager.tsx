import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface Task {
  TaskID: string;
  title: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', status: 'pending' });

  // get all tasks
  useEffect(() => {
    console.log('help me')
    axios.get('http://localhost:3001/api/tasks')
      .then((response: AxiosResponse<Task[]>) => setTasks(response.data))
      .catch((error: AxiosError) => console.error('Error fetching tasks:', error));
  }, []);

  // handle input change for the new task
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, title: e.target.value });
  };

  // post a new task
  const addTask = () => {
    axios.post('http://localhost:3001/api/tasks', newTask)
      .then((response: AxiosResponse<Task>) => setTasks([...tasks, response.data]))
      .catch((error: AxiosError) => console.error('Error adding task:', error));
  };

  // Update task status
  const updateTaskStatus = (id: string, status: string) => {
    axios.put(`http://localhost:3001/api/tasks/${id}`, { status })
      .then((response: AxiosResponse<Task>) => {
        const updatedTasks = tasks.map(task =>
          task.TaskID === id ? { ...task, status: response.data.status } : task
        );
        setTasks(updatedTasks);
      })
      .catch((error: AxiosError) => console.error('Error updating task:', error));
  };

  // Delete a specific task
  const deleteTask = (id: string) => {
    axios.delete(`http://localhost:3001/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.TaskID !== id));
      })
      .catch((error: AxiosError) => console.error('Error deleting task:', error));
  };

  return (
    <div className='container'>
      <h1>Task Manager</h1>
      <div>
        <input
          className='input-form'
          type="text"
          placeholder="New Task Title"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li className='task-items' key={task.TaskID}>
            <span className={task.status==='completed'?'completed':""}>{task.title}</span>
            <div className='task-buttons'>
              <input type='checkbox' checked={task.status==='completed'}
              onChange={() => updateTaskStatus(task.TaskID,task.status==='completed' ? 'pending':'completed')}></input>
            <button className={"deleteButton"}onClick={() => deleteTask(task.TaskID)}>Delete</button> 
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;

