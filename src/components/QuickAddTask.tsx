
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../redux/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Task } from '../types/Task';

export default function QuickAddTask() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Task['status']>('Todo');
  const [category, setCategory] = useState<'Work' | 'Personal'>('Work');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    try {
      const newTask = {
        userId: user.uid,
        title: title.trim(),
        description: '',
        category,
        dueDate,
        status,
        completed: status === 'Completed',
        selected: false,
      };

      await dispatch(createTask(newTask));
      handleCancel();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDueDate('');
    setStatus('Todo');
    setCategory('Work');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded flex items-center gap-2"
      >
        <span className="text-xl">+</span> Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 border rounded"
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
              className="w-full p-2 border rounded"
            >
              <option value="Todo">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded ${category === 'Work' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCategory('Work')}
          >
            Work
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${category === 'Personal' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCategory('Personal')}
          >
            Personal
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}
