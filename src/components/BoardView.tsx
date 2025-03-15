import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { Task } from '../types';
import { modifyTask } from '../redux/taskSlice';
import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';

export default function BoardView() {
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  if (loading) {
    return <LoadingSpinner />;
  }

  const context = useOutletContext<{
    searchQuery: string;
    categoryFilter: string;
    dueDateFilter: string;
  }>();

  const { searchQuery = '', categoryFilter = '', dueDateFilter = '' } = context || {};

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesDueDate = !dueDateFilter || task.dueDate === dueDateFilter;
    return matchesSearch && matchesCategory && matchesDueDate;
  });

  const todoTasks = filteredTasks.filter(task => task.status === "Todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    try {
      const updatedTask: Task = {
        ...task,
        status: newStatus as "Todo" | "In Progress" | "Completed",
        completed: newStatus === "Completed",
        activity: [
          ...(task.activity || []),
          {
            timestamp: new Date().toISOString(),
            action: "status_change",
            details: `Task status changed to ${newStatus} via drag and drop`
          }
        ]
      };

      await dispatch(modifyTask(updatedTask));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-purple-50 p-4 rounded-lg"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "Todo")}
          >
            <h3 className="font-medium mb-3">Todo ({todoTasks.length})</h3>
            <div className="space-y-2">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {todoTasks.length === 0 && !searchQuery && (
                <div className="text-gray-500 text-sm">No tasks in Todo</div>
              )}
            </div>
          </div>

          <div 
            className="bg-blue-50 p-4 rounded-lg"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "In Progress")}
          >
            <h3 className="font-medium mb-3">In Progress ({inProgressTasks.length})</h3>
            <div className="space-y-2">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {inProgressTasks.length === 0 && !searchQuery && (
                <div className="text-gray-500 text-sm">No tasks in progress</div>
              )}
            </div>
          </div>

          <div 
            className="bg-green-50 p-4 rounded-lg"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "Completed")}
          >
            <h3 className="font-medium mb-3">Completed ({completedTasks.length})</h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {completedTasks.length === 0 && !searchQuery && (
                <div className="text-gray-500 text-sm">No completed tasks</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}