import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Task } from "../types/Task";
import EditTaskModal from "./EditTaskModal";
import { updateTask, deleteTask } from "../redux/taskSlice";

const TaskCard = ({ task }: { task: Task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);
    dispatch(updateTask({ ...task, selected: e.target.checked }));
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
      className="task-card bg-white px-3 py-2 rounded mb-2 border border-gray-200 cursor-move hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4 border-gray-300 rounded focus:ring-0"
        />
        <div className="drag-handle cursor-move text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </div>
        <div className="flex-grow flex items-center space-x-2">
          <span className="text-sm font-normal text-gray-900">{task.title}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">{task.dueDate}</span>
          <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
            {task.status}
          </span>
          <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-600">
            {task.category}
          </span>
          <button onClick={() => setIsEditModalOpen(true)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      {isEditModalOpen && <EditTaskModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default function TaskView() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const todoTasks = tasks.filter(task => task.status === "Todo");
  const inProgressTasks = tasks.filter(task => task.status === "In Progress");
  const completedTasks = tasks.filter(task => task.status === "Completed");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getDragAfterElement = (container: Element, y: number) => {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      // Update the task's status
      dispatch(updateTask({
        ...task,
        status: newStatus
      }));

      const container = e.currentTarget;
      const taskElements = [...container.querySelectorAll('.task-card')];
      const newIndex = taskElements.findIndex(el => el.id === `task-${taskId}`);

      // Update order for all tasks in the section
      const tasksInSection = tasks.filter(t => t.status === newStatus);
      tasksInSection.forEach((t, index) => {
        if (t.id !== taskId) {
          dispatch(updateTask({
            ...t,
            order: index
          }));
        }
      });
    }
  };

  const handleBulkDelete = () => {
    const selectedTasks = tasks.filter(task => task.selected);
    selectedTasks.forEach(task => {
      dispatch(deleteTask(task.id));
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    const selectedTasks = tasks.filter(task => task.selected);
    selectedTasks.forEach(task => {
      dispatch(updateTask({ ...task, status: newStatus }));
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">📋 Task List</h2>
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
                  <button onClick={() => handleBulkStatusChange('TO-DO')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">To-Do</button>
                  <button onClick={() => handleBulkStatusChange('IN-PROGRESS')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">In-Progress</button>
                  <button onClick={() => handleBulkStatusChange('COMPLETED')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Completed</button>
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
        <div className="flex flex-col gap-4">
          <div className="border rounded-lg overflow-hidden h-auto">
            <div className="bg-purple-200 p-3 font-medium">
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
        </div>
      </div>
    </div>
  );
}