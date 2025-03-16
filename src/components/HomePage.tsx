import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTasks } from "../redux/taskSlice";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { signOutUser } from "../firebase/firebaseConfig";
import { clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { FaSignOutAlt, FaListUl, FaThLarge } from "react-icons/fa";
import AddTaskModal from "./AddTaskModal";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const categories = ["Work", "Personal", "Other"]; // Added categories array

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
    <div className="p-6 bg-gray-50 min-h-screen mx-3">
      {/* First Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📋 TaskBuddy</h1>
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL ?? ""}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-gray-700 font-medium">{user?.displayName}</span>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex justify-between items-center mt-2 mx-3">
        <div className="flex items-center gap-4">
          <Link
            to="/home/tasks"
            className={`flex items-center gap-2 ${
              location.pathname === '/home/tasks'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <FaListUl /> List
          </Link>
          <Link
            to="/home/board"
            className={`flex items-center gap-2 ${
              location.pathname === '/home/board'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <FaThLarge /> Board
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Third Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 mx-3 space-y-4 sm:space-y-0">
        <div className="text-lg text-gray-700 font-medium mb-2 sm:mb-0">Filter by:</div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <select
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full"
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full"
            onChange={(e) => setDueDateFilter(e.target.value)}
            value={dueDateFilter}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          {(categoryFilter || dueDateFilter) && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Render Task or Board View */}
      <div className="mt-6">
        <Outlet context={{ searchQuery, categoryFilter, dueDateFilter }} />
      </div>

      {/* Task Modal */}
      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}