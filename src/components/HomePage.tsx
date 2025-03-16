import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTasks } from "../redux/taskSlice";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { signOutUser } from "../firebase/firebaseConfig";
import { clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { FaSignOutAlt, FaListUl, FaThLarge } from "react-icons/fa";
import AddTaskModal from "./AddTaskModal";

const Header = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    signOutUser();
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">📋 TaskBuddy</h1>
      <div className="flex items-center gap-3">
        <img
          src={user?.photoURL ?? ""}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-white font-medium">{user?.displayName}</span>
        <button onClick={handleLogout} className="ml-4">
          Logout
        </button>
      </div>
    </header>
  );
};

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const categories = ["Work", "Personal", "Other"];

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Filter by:</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full sm:w-auto"
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
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full sm:w-auto"
                onChange={(e) => setDueDateFilter(e.target.value)}
                value={dueDateFilter}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full sm:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                to="/home/tasks"
                className={`flex items-center gap-2 ${
                  location.pathname === "/home/tasks"
                    ? "text-purple-600"
                    : "text-gray-600"
                }`}
              >
                <FaListUl /> List
              </Link>
              <Link
                to="/home/board"
                className={`flex items-center gap-2 ${
                  location.pathname === "/home/board"
                    ? "text-purple-600"
                    : "text-gray-600"
                }`}
              >
                <FaThLarge /> Board
              </Link>
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
          {isModalOpen && (
            <AddTaskModal onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </main>
    </div>
  );
}