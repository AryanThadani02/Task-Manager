function TaskList({ tasks, onTaskReorder }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <div
            id={`task-${task.id}`}
            data-task-id={task.id}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('text/plain', task.id);
            }}
          >
            {task.text}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;