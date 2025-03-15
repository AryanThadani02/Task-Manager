import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTasks } from "../redux/taskSlice";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { signOutUser } from "../firebase/firebaseConfig";
import { clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { FaSignOutAlt } from "react-icons/fa";
import AddTaskModal from "./AddTaskModal"; // Import modal component

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTasks(user.uid) as any);
    } else {
      dispatch(setTasks([]));
    }
  }, [user?.uid, dispatch]);

  const handleLogout = () => {
    signOutUser();
    dispatch(clearUser());
    navigate("/");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setDueDateFilter("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">📋 TaskBuddy</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <img
                src={user.photoURL ?? ""}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-600">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/home/tasks" 
              className={`text-sm ${
                location.pathname === '/home/tasks' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 List
            </Link>
            <Link 
              to="/home/board" 
              className={`text-sm ${
                location.pathname === '/home/board' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📌 Board
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-1 text-sm border rounded-md w-[200px] focus:outline-none focus:border-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
            >
              ADD TASK
            </button>
          </div>
        </div>
      </div>

      {/* Navigation and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
        <div className="hidden md:flex gap-2">
          <Link 
            to="/home/tasks" 
            className={`px-3 py-1 rounded transition-colors ${
              location.pathname === '/home/tasks' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📋 List View
          </Link>
          <Link 
            to="/home/board" 
            className={`px-3 py-1 rounded transition-colors ${
              location.pathname === '/home/board' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📌 Board View
          </Link>
        </div>

        {/* Add Task Button */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
            <input
              type="date"
              className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setDueDateFilter(e.target.value)}
              value={dueDateFilter}
            />
          </div>
          <div className="flex justify-between gap-4">
            {(searchQuery || categoryFilter || dueDateFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-all"
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Render Task or Board View */}
      <Outlet context={{ searchQuery, categoryFilter, dueDateFilter }} />

      {/* Task Modal */}
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}