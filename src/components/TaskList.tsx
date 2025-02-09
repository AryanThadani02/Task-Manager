import React from "react";

export default function TaskView() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📋 Task List</h2>

        {/* Task Sections */}
        <div className="space-y-4">
          {/* To-Do Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-purple-200 p-3 font-medium">Todo (3)</div>
            <div className="p-4 bg-gray-100 text-gray-600">No Tasks In To-Do</div>
          </div>

          {/* In-Progress Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-blue-200 p-3 font-medium">In-Progress (3)</div>
            <div className="p-4 bg-gray-100 text-gray-600">No Tasks In Progress</div>
          </div>

          {/* Completed Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-200 p-3 font-medium">Completed (3)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
