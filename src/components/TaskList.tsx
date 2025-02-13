import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Task } from "../types/Task";
import EditTaskModal from "./EditTaskModal";
import { updateTask, deleteTask } from "../redux/taskSlice";

const TaskCard = ({ task }: { task: Task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
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
      className="task-card bg-white p-4 rounded-lg shadow mb-3 cursor-move"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <h3 className="font-semibold w-1/4 truncate">{task.title}</h3>
          <p className="text-gray-600 w-1/4 truncate">{task.description}</p>
          <span className="text-sm text-gray-500 w-24">Due: {task.dueDate}</span>
          <span className={`px-2 py-1 rounded text-sm ${
            task.category === 'Work' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {task.category}
          </span>
          {/* Added to display other fields */}
          <p className="text-gray-600">Status: {task.status}</p>
          <p className="text-gray-600">Priority: {task.priority}</p>
          {/* Add more fields as needed */}

        </div>
        <div className="flex items-center space-x-2">
          {task.fileUrl && (
            <img src={task.fileUrl} alt="attachment" className="w-8 h-8 object-cover rounded" />
          )}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 hover:text-purple-500"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-500"
          >
            🗑️
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
    const draggingElement = document.querySelector('.dragging');
    if (!draggingElement) return;

    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);

    if (afterElement) {
      container.insertBefore(draggingElement, afterElement);
    } else {
      container.appendChild(draggingElement);
    }
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
      const container = e.currentTarget;
      const taskElements = [...container.querySelectorAll('.task-card')];
      const newIndex = taskElements.findIndex(el => el.id === `task-${taskId}`);

      const tasksInSection = tasks.filter(t => t.status === newStatus);
      const reorderedTasks = [...tasksInSection];
      const taskToMove = reorderedTasks.find(t => t.id === taskId);

      if (taskToMove) {
        reorderedTasks.splice(reorderedTasks.indexOf(taskToMove), 1);
        reorderedTasks.splice(newIndex, 0, taskToMove);

        reorderedTasks.forEach((t, index) => {
          dispatch(updateTask({
            ...t,
            status: newStatus,
            order: index
          }));
        });
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📋 Task List</h2>

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