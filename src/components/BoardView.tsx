import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { Task } from "../types/Task";
import { removeTask, modifyTask } from "../redux/taskSlice";
import EditTaskModal from "./EditTaskModal";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

interface TaskCardProps {
  task: Task;
  draggable: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, draggable }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      if (task.id) {
        await dispatch(removeTask(task.id) as any);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id || '');
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow mb-3 ${!isEditModalOpen && 'cursor-move'}`}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-semibold ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-sm ${
            task.category === 'Work' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {task.category}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-600 hover:text-gray-800"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div 
        className="text-gray-600 mt-2"
        dangerouslySetInnerHTML={{ __html: task.description }}
      />
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
        {task.fileUrl && (
          <img 
            src={task.fileUrl} 
            alt="attachment" 
            className="w-20 h-20 object-cover rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => window.open(task.fileUrl, '_blank')}
          />
        )}
      </div>
      {isEditModalOpen && <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

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

  const isSearching = searchQuery.length > 0;

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
    if (isSearching) return;
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isSearching) return;
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    if (isSearching) return;
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');

    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      try {
        const updatedTask: Task = {
          ...task,
          status: newStatus,
          completed: newStatus === "Completed",
          selected: task.selected || false,
          category: task.category,
          dueDate: task.dueDate
        };
        await dispatch(modifyTask(updatedTask) as any);
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-purple-200 p-3 font-medium">Todo</div>
            <div className="p-4 min-h-[50px]">
              {todoTasks.length > 0 && (
                <div className="w-full">
                  {todoTasks.map(task => 
                    <TaskCard key={task.id} task={task} draggable={!isSearching} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-blue-200 p-3 font-medium">In-Progress</div>
            <div className="p-4 min-h-[50px]">
              {inProgressTasks.length > 0 && (
                <div className="w-full">
                  {inProgressTasks.map(task => 
                    <TaskCard key={task.id} task={task} draggable={!isSearching} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-200 p-3 font-medium">Completed</div>
            <div className="p-4 min-h-[50px]">
              {completedTasks.length > 0 && (
                <div className="w-full">
                  {completedTasks.map(task => 
                    <TaskCard key={task.id} task={task} draggable={!isSearching} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}