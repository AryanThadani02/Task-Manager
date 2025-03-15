import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { modifyTask } from "../redux/taskSlice";
import NoResultsFound from "./NoResultsFound";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
  </div>
);

export default function BoardView() {
  const { searchQuery } = useOutletContext() as { searchQuery: string };
  const tasks = useSelector((state: any) => state.tasks.tasks);
  const status = useSelector((state: any) => state.tasks.status);
  const dispatch = useDispatch();

  const todoTasks = tasks.filter((task: any) => 
    task.status === "TODO" && 
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const inProgressTasks = tasks.filter((task: any) => 
    task.status === "IN_PROGRESS" && 
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedTasks = tasks.filter((task: any) => 
    task.status === "COMPLETED" && 
    (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTasks = [...todoTasks, ...inProgressTasks, ...completedTasks];

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>
        {filteredTasks.length === 0 ? (
          <NoResultsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Todo ({todoTasks.length})</h3>
              {todoTasks.length > 0 && (
                <div className="space-y-2">
                  {todoTasks.map(task => (
                    <div
                      key={task.id}
                      draggable={!searchQuery}
                      onDragStart={searchQuery ? undefined : (e) => {
                        e.dataTransfer.setData("taskId", task.id);
                      }}
                      className="bg-white p-3 rounded shadow-sm border border-gray-200"
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">In Progress ({inProgressTasks.length})</h3>
              {inProgressTasks.length > 0 && (
                <div className="space-y-2">
                  {inProgressTasks.map(task => (
                    <div
                      key={task.id}
                      draggable={!searchQuery}
                      onDragStart={searchQuery ? undefined : (e) => {
                        e.dataTransfer.setData("taskId", task.id);
                      }}
                      className="bg-white p-3 rounded shadow-sm border border-gray-200"
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Completed ({completedTasks.length})</h3>
              {completedTasks.length > 0 && (
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      draggable={!searchQuery}
                      onDragStart={searchQuery ? undefined : (e) => {
                        e.dataTransfer.setData("taskId", task.id);
                      }}
                      className="bg-white p-3 rounded shadow-sm border border-gray-200"
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}