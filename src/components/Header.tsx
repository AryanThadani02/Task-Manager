
import { useDispatch } from "react-redux";
import { openAddTaskModal } from "../redux/modalSlice";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border-b">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">TaskBuddy</h1>
      <div className="w-full sm:w-auto">
        <button
          onClick={() => dispatch(openAddTaskModal())}
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
        >
          ADD TASK
        </button>
      </div>
    </div>
  );
};

export default Header;
