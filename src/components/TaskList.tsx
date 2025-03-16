import React, { useState, useRef, useEffect } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { RootState } from "../redux/store";
import { Task } from "../types/Task";
import EditTaskModal from "./EditTaskModal";
import { updateTask, deleteTask, removeTask, modifyTask } from "../redux/taskSlice";
import NoResultsFound from "./NoResultsFound";

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
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
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
  const dispatch = useDispatch();


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
  };

  const handleImageUpload = async (file: File, taskId: string) => {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const imageUrl = await uploadImage(file, user.uid);
    const docRef = doc(db, 'tasks', taskId);
    await updateDoc(docRef, {
      imageUrl
    });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
};

const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
  e.preventDefault();
  const taskId = e.dataTransfer.getData("taskId");
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;n;

    try {
      const updatedTask: Task = {
        ...task,
        status: newStatus,
        completed: newStatus === "Completed",
        category: task.category,
        dueDate: task.dueDate,
        activity: [
          ...(task.activity || []),
          {
            timestamp: new Date().toISOString(),
            action: "status_change",
            details: `Task status changed to ${newStatus} via drag and drop`
          }
        ]
      };
      
      await dispatch(modifyTask(updatedTask) as any);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleBulkDelete = () => {
    const selectedTasks = tasks.filter(task => task.selected);
    selectedTasks.forEach(task => {
      if (task.id) {
        dispatch(deleteTask(task.id));
      }
    });
    // Reset all selected states after bulk delete
    tasks.forEach(task => {
      if (task.selected) {
        dispatch(updateTask({ ...task, selected: false } as Task));
      }
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    const selectedTasks = tasks.filter(task => task.selected);
    selectedTasks.forEach(task => {
      dispatch(updateTask({ 
        ...task, 
        status: newStatus as "Todo" | "In Progress" | "Completed",
        completed: newStatus === "Completed",
        selected: false 
      }));
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md max-w-full overflow-x-auto">
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
        {tasks.some(task => task.selected) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4 z-50">
            <span className="text-sm">
              {tasks.filter(task => task.selected).length} Tasks Selected
            </span>
            <span className="text-gray-400">|</span>
            <div className="relative group">
              <button className="text-sm hover:text-gray-300">
                Status ▾
              </button>
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="py-1">
                  <button onClick={() => handleBulkStatusChange('Todo')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Todo</button>
                  <button onClick={() => handleBulkStatusChange('In Progress')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">In Progress</button>
                  <button onClick={() => handleBulkStatusChange('Completed')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Completed</button>
                </div>
              </div>
            </div>
            <button 
              onClick={handleBulkDelete}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        )}
        {filteredTasks.length === 0 && searchQuery ? (
          <NoResultsFound />
        ) : (
          <div className="flex flex-col gap-4">
            {(!searchQuery || todoTasks.length > 0) && (
            <div className="border rounded-lg overflow-hidden h-auto min-h-[150px] sm:min-h-[200px]">
              <div className="bg-purple-200 p-2 sm:p-3 font-medium text-sm sm:text-base">
                Todo ({todoTasks.length})
              </div>
              <div 
                className="p-4 min-h-[50px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "Todo")}
              >
                {todoTasks.length > 0 ? (
                  todoTasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                  <div className="text-gray-600">No Tasks In To-Do</div>
                )}
              </div>
            </div>
          )}

          {(!searchQuery || inProgressTasks.length > 0) && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-200 p-3 font-medium">
                In-Progress ({inProgressTasks.length})
              </div>
              <div 
                className="p-4 min-h-[100px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "In Progress")}
              >
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                  <div className="text-gray-600">No Tasks In Progress</div>
                )}
              </div>
            </div>
          )}

          {(!searchQuery || completedTasks.length > 0) && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-200 p-3 font-medium">
                Completed ({completedTasks.length})
              </div>
              <div 
                className="p-4 min-h-[100px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "Completed")}
              >
                {completedTasks.length > 0 ? (
                  completedTasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                  <div className="text-gray-600">No Completed Tasks</div>
                )}
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}