
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Task } from '../types/task';
import { updateTask, removeTask } from '../redux/taskSlice';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id || '');
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);
    dispatch(updateTask({ ...task, selected: e.target.checked } as Task));
  };

  const handleDelete = async () => {
    try {
      if (task.id) {
        await dispatch(removeTask(task.id) as any);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
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
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        </div>
        <span className="text-sm">{task.title}</span>
        <span className="text-sm text-gray-500">{task.category}</span>
        <span className="text-sm text-gray-500">{task.dueDate}</span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
          >
            ⋮
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
      {isEditModalOpen && <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default TaskCard;
