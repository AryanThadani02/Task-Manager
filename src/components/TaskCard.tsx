interface TaskCardProps {
  task: Task;
  draggable?: boolean;
}

export default function TaskCard({ task, draggable = true }: TaskCardProps) {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm mb-3 cursor-pointer border ${task.selected ? 'border-purple-500' : 'border-gray-200'}`}
      draggable={draggable}
      onDragStart={draggable ? (e) => {
        e.dataTransfer.setData("taskId", task.id || "");
      } : undefined}
    >
      {/* Rest of TaskCard component remains unchanged */}
    </div>
  );
}