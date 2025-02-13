import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";
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
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTasks(user.uid));
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">📋 TaskBuddy</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-3">
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
            className="md:flex hidden items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
          >
            <FaSignOutAlt className="text-gray-600" />
            Logout
          </button>
          <button
            onClick={handleLogout}
            className="flex md:hidden items-center justify-center w-10 h-10 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
          >
            <FaSignOutAlt className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation for Task/Board */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <Link to="/home/tasks" className="px-3 py-1 bg-gray-200 text-gray-800 rounded">
            📋 Task View
          </Link>
          <Link to="/home/board" className="px-3 py-1 bg-gray-200 text-gray-800 rounded">
            📌 Board View
          </Link>
        </div>

        {/* Hamburger Menu for Filters */}
        <div className="md:hidden">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Add Task Button and Filters */}
        <div className={`${isFilterMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 items-center absolute md:relative right-0 top-full md:top-auto bg-white md:bg-transparent p-4 md:p-0 rounded-lg shadow-lg md:shadow-none z-50 w-full md:w-auto`}>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setDueDateFilter(e.target.value)}
            value={dueDateFilter}
          />
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

      {/* Render Task or Board View */}
      <Outlet context={{ searchQuery, categoryFilter, dueDateFilter }} />

      {/* Task Modal */}
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
