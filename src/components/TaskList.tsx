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
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-lg shadow mb-3 cursor-move"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.title}</h3>
        <div>
          <span className={`px-2 py-1 rounded text-sm ${
            task.category === 'Work' ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {task.category}
          </span>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="ml-2 text-gray-600 hover:text-purple-500"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            className="ml-2 text-gray-600 hover:text-red-500"
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{task.description}</p>
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

export default function TaskView() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const todoTasks = tasks.filter(task => task.status === "Todo");
  const inProgressTasks = tasks.filter(task => task.status === "In Progress");
  const completedTasks = tasks.filter(task => task.status === "Completed");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      dispatch(updateTask({
        ...task,
        status: newStatus
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📋 Task List</h2>

        <div className="grid grid-rows-3 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-purple-200 p-3 font-medium">
              Todo ({todoTasks.length})
            </div>
            <div 
              className="p-4 min-h-[200px]"
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
              className="p-4 min-h-[200px]"
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
              className="p-4 min-h-[200px]"
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