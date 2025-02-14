
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Task } from "../types/Task";
import { deleteTask, updateTask } from "../redux/taskSlice";
import EditTaskModal from "./EditTaskModal";

const TaskCard = ({ task }: { task: Task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow mb-3 cursor-move"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.title}</h3>
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
          <img src={task.fileUrl} alt="attachment" className="w-10 h-10 object-cover rounded" />
        )}
      </div>
      {isEditModalOpen && <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default function BoardView() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const todoTasks = tasks.filter(task => task.status === "Todo");
  const inProgressTasks = tasks.filter(task => task.status === "In Progress");
  const completedTasks = tasks.filter(task => task.status === "Completed");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');
    
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      dispatch(updateTask({
        ...task,
        status: newStatus,
        completed: newStatus === "Completed"
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-purple-200 p-3 font-medium">Todo</div>
            <div 
              className="p-4 min-h-[200px] transition-colors duration-200"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "Todo")}
            >
              {todoTasks.length > 0 ? (
                todoTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-gray-600">No Tasks In To-Do</div>
              )}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-blue-200 p-3 font-medium">In-Progress</div>
            <div 
              className="p-4 min-h-[200px] transition-colors duration-200"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "In Progress")}
            >
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-gray-600">No Tasks In Progress</div>
              )}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-200 p-3 font-medium">Completed</div>
            <div 
              className="p-4 min-h-[200px] transition-colors duration-200"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "Completed")}
            >
              {completedTasks.length > 0 ? (
                completedTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-gray-600">No Completed Tasks</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
