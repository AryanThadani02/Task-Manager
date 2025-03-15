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

  const location = useLocation();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-md space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">📋 TaskBuddy</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL ?? ""}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 font-medium">{user.displayName}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
          >
            <FaSignOutAlt className="text-gray-600" />
            Logout
          </button>
        </div>
      </div>

      {/* New Header and Navigation */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and View Toggles */}
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold">📋 TaskBuddy</h1>
              <div className="flex items-center gap-4">
                <Link 
                  to="/home/tasks"
                  className={`flex items-center gap-2 ${
                    location.pathname === '/home/tasks' 
                      ? 'text-purple-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </Link>
                <Link 
                  to="/home/board"
                  className={`flex items-center gap-2 ${
                    location.pathname === '/home/board' 
                      ? 'text-purple-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Board
                </Link>
              </div>
            </div>

            {/* Search, Add Task, and Profile */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 rounded-md border border-gray-300 w-64 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
              >
                ADD TASK
              </button>
              <div className="flex items-center gap-2">
                <img 
                  src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.email} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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