import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTasks } from "../redux/taskSlice";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { signOutUser } from "../firebase/firebaseConfig";
import { clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { FaSignOutAlt } from "react-icons/fa";
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

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setDueDateFilter("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex items-center text-xl font-semibold text-gray-900">
                <span className="mr-2">📋</span> TaskBuddy
              </Link>
              <div className="flex items-center space-x-6">
                <Link
                  to="/home/tasks"
                  className={`flex items-center ${
                    isListView ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="fas fa-list-ul mr-2"></i>
                  List
                </Link>
                <Link
                  to="/home/board"
                  className={`flex items-center ${
                    !isListView ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="fas fa-columns mr-2"></i>
                  Board
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm mr-2">Filter by:</span>
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
                  className="border rounded px-3 py-1.5 ml-2 text-sm"
                >
                  <option value="">Due Date</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded pl-8 pr-3 py-1.5 w-48 text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-1.5 rounded text-sm hover:bg-purple-700"
              >
                ADD TASK
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={user?.photoURL || ""}
                  alt={user?.displayName || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
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