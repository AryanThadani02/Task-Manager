
import React from 'react';
import { useDispatch } from 'react-redux';
import { openAddTaskModal } from '../redux/modalSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="w-full bg-white">
      {/* Main Header Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b">
        {/* Logo and Profile Section */}
        <div className="flex items-center justify-between w-full sm:w-auto mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">TaskBuddy</h1>
          <div className="flex items-center gap-x-4">
            <img
              src="https://github.com/identicons/jasonlong.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={() => dispatch(openAddTaskModal())}
              className="bg-purple-600 text-white rounded-full px-4 py-2 text-sm sm:text-base hover:bg-purple-700 transition-colors sm:hidden"
            >
              ADD TASK
            </button>
          </div>
        </div>

        {/* Add Task Button (Desktop) */}
        <button
          onClick={() => dispatch(openAddTaskModal())}
          className="hidden sm:block bg-purple-600 text-white rounded-full px-6 py-2 text-base hover:bg-purple-700 transition-colors"
        >
          ADD TASK
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 space-y-4">
        <h2 className="text-gray-600 text-lg">Filter by:</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select className="w-full p-2 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="flex-1">
            <select className="w-full p-2 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Due Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-10 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
