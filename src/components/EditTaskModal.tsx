
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { modifyTask } from "../redux/taskSlice";
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
        toolbar: '#toolbar-container-edit'
      }
    });

    quill.root.innerHTML = editedTask.description;

    const observer = new MutationObserver(() => {
      setEditedTask({...editedTask, description: quill.root.innerHTML});
    });

    observer.observe(quill.root, {
      characterData: true,
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
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
    try {
      await dispatch(modifyTask(updatedTask));
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg p-4 z-50">
      <div ref={modalRef} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-[80%] md:max-w-[70%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        <div className="flex gap-6">
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              placeholder="Task Title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              className="w-full p-2 mb-3 border rounded"
              required
            />

            <div className="mb-3">
              <div id="toolbar-container-edit">
                <span className="ql-formats">
                  <button className="ql-bold"></button>
                  <button className="ql-italic"></button>
                  <button className="ql-underline"></button>
                </span>
                <span className="ql-formats">
                  <button className="ql-list" value="ordered"></button>
                  <button className="ql-list" value="bullet"></button>
                </span>
                <span className="ql-formats">
                  <button className="ql-clean"></button>
                </span>
              </div>
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

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
                Update
              </button>
            </div>
          </form>

          <div className="w-80 border-l pl-6">
            <h3 className="text-lg font-medium mb-3">Activity</h3>
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto space-y-2">
              {task.activity?.map((entry, index) => (
                <div key={index} className="flex flex-col gap-1 text-sm border-b pb-2">
                  <span className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  <span className="text-gray-700">{entry.details}</span>
                </div>
              )) || (
                <div className="text-gray-500 text-sm">No activity recorded</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
