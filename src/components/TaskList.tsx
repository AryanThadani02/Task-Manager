
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Task } from "../types/Task";
import EditTaskModal from "./EditTaskModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateTask, deleteTask } from "../redux/taskSlice";

const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  
  if (showEditModal) {
    return <EditTaskModal task={task} onClose={() => setShowEditModal(false)} />;
  }

  const handleComplete = () => {
    dispatch(updateTask({
      ...task,
      status: task.status === "Completed" ? "Todo" : "Completed"
    }));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateTask({
      ...task,
      status: e.target.value
    }));
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow mb-3"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleComplete}
                className={`text-xl ${task.status === "Completed" ? "text-green-500" : "text-gray-300"}`}
              >
                ✓
              </button>
              <h3 className={`font-semibold ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}>
                {task.title}
              </h3>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span className={`px-2 py-1 rounded text-sm ${
                task.category === 'Work' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {task.category}
              </span>
              <button 
                onClick={() => setShowEditModal(true)}
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
          <p className="text-gray-600 mt-2">{task.description}</p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
            {task.fileUrl && (
              <img src={task.fileUrl} alt="attachment" className="w-10 h-10 object-cover rounded" />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default function TaskView() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const todoTasks = tasks.filter(task => task.status === "Todo");
  const inProgressTasks = tasks.filter(task => task.status === "In Progress");
  const completedTasks = tasks.filter(task => task.status === "Completed");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const task = tasks.find(t => t.id === draggableId);
    
    if (task) {
      let newStatus = task.status;
      
      if (destination.droppableId === "todo") newStatus = "Todo";
      else if (destination.droppableId === "inProgress") newStatus = "In Progress";
      else if (destination.droppableId === "completed") newStatus = "Completed";

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

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-purple-200 p-3 font-medium">
                Todo ({todoTasks.length})
              </div>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div className="p-4" ref={provided.innerRef} {...provided.droppableProps}>
                    {todoTasks.length > 0 ? (
                      todoTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))
                    ) : (
                      <div className="text-gray-600">No Tasks In To-Do</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-200 p-3 font-medium">
                In-Progress ({inProgressTasks.length})
              </div>
              <Droppable droppableId="inProgress">
                {(provided) => (
                  <div className="p-4" ref={provided.innerRef} {...provided.droppableProps}>
                    {inProgressTasks.length > 0 ? (
                      inProgressTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))
                    ) : (
                      <div className="text-gray-600">No Tasks In Progress</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-200 p-3 font-medium">
                Completed ({completedTasks.length})
              </div>
              <Droppable droppableId="completed">
                {(provided) => (
                  <div className="p-4" ref={provided.innerRef} {...provided.droppableProps}>
                    {completedTasks.length > 0 ? (
                      completedTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))
                    ) : (
                      <div className="text-gray-600">No Completed Tasks</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
