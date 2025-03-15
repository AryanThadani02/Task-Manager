
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useOutletContext } from "react-router-dom";
import { modifyTask } from "../redux/taskSlice";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

export default function BoardView() {
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  if (loading) {
    return <LoadingSpinner />;
  }

  const context = useOutletContext<{
    searchQuery: string;
    categoryFilter: string;
    dueDateFilter: string;
  }>();

  const { searchQuery = '', categoryFilter = '', dueDateFilter = '' } = context || {};

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesDueDate = !dueDateFilter || task.dueDate === dueDateFilter;
    return matchesSearch && matchesCategory && matchesDueDate;
  });

  const todoTasks = filteredTasks.filter(task => task.status === "Todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");

  const handleDragOver = (e: React.DragEvent) => {
    if (searchQuery) return;
    e.preventDefault();
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (searchQuery) return;
    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    if (searchQuery) return;
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    const draggedOverElement = e.currentTarget as HTMLElement;
    draggedOverElement.classList.remove('bg-gray-50');

    await dispatch(modifyTask({ ...task, status: newStatus }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📌 Kanban Board</h2>
        {searchQuery && filteredTasks.length === 0 ? (
          <NoResultsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Todo ({todoTasks.length})</h3>
            {todoTasks.length > 0 && (
              <div className="space-y-2">
                {todoTasks.map(task => (
                  <div
                    key={task.id}
                    draggable={!searchQuery}
                    onDragStart={searchQuery ? undefined : (e) => {
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">In Progress ({inProgressTasks.length})</h3>
            {inProgressTasks.length > 0 && (
              <div className="space-y-2">
                {inProgressTasks.map(task => (
                  <div
                    key={task.id}
                    draggable={!searchQuery}
                    onDragStart={searchQuery ? undefined : (e) => {
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Completed ({completedTasks.length})</h3>
            {completedTasks.length > 0 && (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    draggable={!searchQuery}
                    onDragStart={searchQuery ? undefined : (e) => {
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-600 mt-1">Due: {task.dueDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
