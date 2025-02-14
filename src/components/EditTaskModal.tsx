
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../redux/taskSlice";
import { Task } from "../types/Task";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const quill = new (window as any).Quill('#quill-editor-edit', {
      theme: 'snow',
      placeholder: 'Enter description...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    });
    
    quill.root.innerHTML = editedTask.description;
    
    quill.on('text-change', function() {
      setEditedTask({...editedTask, description: quill.root.innerText});
    });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedTask = {
      ...editedTask,
      fileUrl: file ? URL.createObjectURL(file) : editedTask.fileUrl
    };
    dispatch(updateTask(updatedTask));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={editedTask.title}
            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            className="w-full p-2 mb-3 border rounded"
            required
          />

          <div className="mb-3">
            <div id="quill-editor-edit" style={{height: "200px"}} className="mb-3"></div>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className={`px-3 py-1 rounded ${editedTask.category === "Work" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              onClick={() => setEditedTask({...editedTask, category: "Work"})}
            >
              Work
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded ${editedTask.category === "Personal" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              onClick={() => setEditedTask({...editedTask, category: "Personal"})}
            >
              Personal
            </button>
          </div>

          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
            className="w-full p-2 mb-3 border rounded"
            required
          />

          <select
            value={editedTask.status}
            onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
            className="w-full p-2 mb-3 border rounded"
            required
          >
            <option value="Todo">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="mb-3 border p-3 rounded">
            <label className="block text-gray-600 mb-2">Attach Screenshot</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {(file || editedTask.fileUrl) && (
              <p className="text-sm text-gray-500 mt-1">
                📎 {file ? file.name : "Current attachment"}
              </p>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Activity</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {task.activity?.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  <span className="text-gray-700">{entry.details}</span>
                </div>
              )) || (
                <div className="text-gray-500 text-sm">No activity recorded</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
