import React from "react";

export default function BoardView() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-4">
          {/* To-Do Column */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-purple-200 p-3 font-medium">Todo</div>
            <div className="p-4 bg-gray-100 text-gray-600">No Tasks In To-Do</div>
          </div>

          {/* In-Progress Column */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-blue-200 p-3 font-medium">In-Progress</div>
            <div className="p-4 bg-gray-100 text-gray-600">No Tasks In Progress</div>
          </div>

          {/* Completed Column */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-200 p-3 font-medium">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
