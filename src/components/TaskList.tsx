import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { RootState } from "../redux/store";
import { Task } from "../types/task";
import EditTaskModal from "./EditTaskModal";
import { updateTask, deleteTask, removeTask, modifyTask } from "../redux/taskSlice";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id || '');
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);
    dispatch(updateTask({ ...task, selected: e.target.checked } as Task));
  };

  const handleDelete = async () => {
    console.log('DELETE OPERATION - TaskList - Starting delete for task:', task);
    try {
      if (task.id) {
        await dispatch(removeTask(task.id) as any);
        console.log('DELETE OPERATION - TaskList - Delete dispatch completed for task ID:', task.id);
      }
    } catch (error) {
      console.error('DELETE OPERATION - TaskList - Delete failed:', error);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    dispatch(updateTask({
      ...task,
      status: newStatus,
      completed: newStatus === "Completed",
      category: task.category,
      dueDate: task.dueDate,
      selected: false
    } as Task));
  };

  return (
    <div
      id={`task-${task.id}`}
      draggable
      onDragStart={(e) => {
        handleDragStart(e);
        e.currentTarget.classList.add('dragging');
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('dragging');
      }}
      className="task-card bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded mb-2 border border-gray-200 hover:bg-gray-50"
    >
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 border-gray-300 rounded focus:ring-0"
          />
          <div className="hidden md:block drag-handle cursor-move text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </div>
          <input
            type="checkbox"
            checked={task.status === "Completed"}
            onChange={(e) => {
              const isCompleted = e.target.checked;
              dispatch(updateTask({
                ...task,
                completed: isCompleted,
                category: task.category,
                dueDate: task.dueDate,
                status: isCompleted ? "Completed" : "Todo",
                selected: task.selected || false,
                activity: [
                  ...(task.activity || []),
                  {
                    timestamp: new Date().toISOString(),
                    action: "status_change",
                    details: `Task marked as ${isCompleted ? 'completed' : 'incomplete'} via checkbox`
                  }
                ]
              } as Task));
            }}
            className="relative w-4 h-4 rounded-full border border-black text-green-500 focus:ring-green-500 checked:bg-green-500 checked:border-transparent appearance-none before:content-['✓'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:opacity-0 checked:before:opacity-100 before:text-xs"
          />
        </div>
        <div className="flex items-center">
          <span className={`text-sm font-normal text-gray-900 ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</span>
        </div>
        <div className="hidden md:block"> {/* Hide due date in mobile view */}
          <span className="text-sm text-gray-500">
            {task.dueDate === new Date().toISOString().split('T')[0]
              ? "Today"
              : new Date(task.dueDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }).split(',')[0].split(' ').reverse().join(' ') + ', ' + new Date(task.dueDate).getFullYear()
            }
          </span>
        </div>
        <div className="hidden md:block"> {/* Hide status select in mobile view */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-xs border rounded px-2 py-0.5 bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="hidden md:inline-block px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-600">
            {task.category}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-0 py-2 w-36 sm:w-48 bg-white rounded-md shadow-xl z-20">
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
      {isEditModalOpen && <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

export default function TaskView() {
  const { searchQuery, categoryFilter, dueDateFilter } = useOutletContext<{
    searchQuery: string;
    categoryFilter: string;
    dueDateFilter: string;
  }>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesDueDate = !dueDateFilter || task.dueDate === dueDateFilter;
    return matchesSearch && matchesCategory && matchesDueDate;
  });

  const todoTasks = filteredTasks.filter(task => task.status === "Todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

  const renderTaskList = (tasks: Task[], status: string) => {
    if (tasks.length === 0) return null;

    return (
      <div className="border rounded-lg overflow-hidden mb-4">
        <div className={`p-3 font-medium ${
          status === "Todo" ? "bg-red-200" :
            status === "In Progress" ? "bg-blue-200" :
              "bg-green-200"
        }`}>
          {status} ({tasks.length})
        </div>
        <div className="p-4">
          {tasks.map(task => (
            <div key={task.id} className="border rounded p-3 mb-2 last:mb-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  task.category === "Work" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                }`}>
                  {task.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">📋 Task List</h2>
        </div>
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 p-3 bg-gray-100 rounded-t-lg font-medium text-gray-600 border-b">
          <div className="w-12"></div>
          <div>Task name</div>
          <div>Due on</div>
          <div>Task Status</div>
          <div>Task Category</div>
        </div>
        {renderTaskList(todoTasks, "Todo")}
        {renderTaskList(inProgressTasks, "In Progress")}
        {renderTaskList(completedTasks, "Completed")}
      </div>
    </div>
  );
}