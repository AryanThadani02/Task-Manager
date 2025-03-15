// Assuming necessary imports like useState, useEffect, etc. are already present.

const TaskList = ({ tasks, setTasks, sections }) => {
  const [draggingTask, setDraggingTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggingTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, sectionIndex) => {
    e.preventDefault();
    if (!draggingTask) return;

    const targetSection = sections[sectionIndex];
    const targetIndex = Array.from(e.target.parentNode.children).indexOf(e.target);


    const updatedTasks = [...tasks];
    const originalSectionIndex = updatedTasks.findIndex(task => task.id === draggingTask.id);
    const originalTask = updatedTasks.splice(originalSectionIndex,1)[0];


    const newTaskIndex = targetIndex;
    
    if (targetSection.id === originalTask.sectionId) {
        //Reordering within the same section
        targetSection.tasks.splice(newTaskIndex, 0, originalTask);
    } else {
      targetSection.tasks.push(originalTask);
      originalTask.sectionId = targetSection.id
    }

    const updatedSections = [...sections];
    updatedSections[sectionIndex] = targetSection;

    setTasks(updatedTasks);
    setDraggingTask(null);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2">{section.name}</h2>
          <div
            className="min-h-[200px] bg-white p-2 rounded-lg shadow-inner"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, sectionIndex)}
          >
            {section.tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white p-4 rounded-lg shadow-sm border mb-2 ${task.selected ? 'border-blue-500' : 'border-gray-200'}`}
                data-task-id={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={() => {}}
              >
                {task.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;