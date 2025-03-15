import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTasks } from "../redux/taskSlice";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { signOutUser } from "../firebase/firebaseConfig";
import { clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { FaSignOutAlt, FaList, FaThLarge, FaSearch } from "react-icons/fa";
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

  const isListView = location.pathname.includes('/tasks');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white"> {/* Removed shadow */}
        <div className="max-w-7xl mx-auto px-4">
          {/* First Row */}
          <div className="flex items-center justify-between py-4"> {/* Removed border-b */}
            <Link to="/home" className="flex items-center text-xl font-semibold text-gray-900">
              <span className="mr-2">📋</span> TaskBuddy
            </Link>
            <div className="flex items-center gap-4">
              <img
                src={user?.photoURL || ""}
                alt={user?.displayName || "User"}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">{user?.displayName}</span>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex items-center justify-between py-3"> {/* Removed border-t */}
            <div className="flex items-center space-x-4">
              <Link
                to="/home/tasks"
                className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                  isListView ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaList size={16} />
                List
              </Link>
              <Link
                to="/home/board"
                className={`flex items-center gap-2 px-3 py-1.5 rounded ${
                  !isListView ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaThLarge size={16} />
                Board
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900"
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </div>

          {/* Third Row */}
          <div className="flex items-center justify-between py-3"> {/* Removed border-t */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Filter by:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm"
              >
                <option value="">Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
              <select
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm"
              >
                <option value="">Due Date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border rounded text-sm w-64"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-1.5 rounded text-sm hover:bg-purple-700"
              >
                ADD TASK
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet context={{ searchQuery, categoryFilter, dueDateFilter }} />
      </main>

      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}