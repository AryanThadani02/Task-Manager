import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { modifyTask } from "../redux/taskSlice";
import { Task } from "../types/Task";
import { auth } from "../firebase/firebaseConfig";
import { uploadImage } from '../firebase/storageConfig';

export default function EditTaskModal({ task, onClose }) {
  const [editedTask, setEditedTask] = useState(task);
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editedTask.fileUrl;
      if (file && auth.currentUser) {
        imageUrl = await uploadImage(file, auth.currentUser.uid);
      }

      const updatedTask = {
        ...editedTask,
        fileUrl: imageUrl,
        activity: [
          ...editedTask.activity || [],
          {
            timestamp: new Date().toISOString(),
            details: 'Task was edited'
          }
        ]
      };

      await dispatch(modifyTask(updatedTask));
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex">
        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Task Title*</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Description</label>
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Task Category*</label>
                  <div className="flex gap-2">
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
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Due Date*</label>
                  <input
                    type="date"
                    value={editedTask.dueDate}
                    onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Status*</label>
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({...editedTask, status: e.target.value, completed: e.target.value === 'Completed'})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Todo">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Attachment</label>
                <div className="mt-2 p-6 border-2 border-dashed rounded-lg text-center hover:border-purple-400 transition-colors">
                  <p className="text-sm text-gray-500">Drop your files here or <label htmlFor="file-upload" className="text-purple-600 cursor-pointer">Upload</label></p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  {(file || editedTask.fileUrl) && (
                    <div className="mt-4">
                      <img 
                        src={file ? URL.createObjectURL(file) : `${editedTask.fileUrl}?t=${Date.now()}`}
                        alt="Task attachment"
                        className="max-w-xs mx-auto rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/3 bg-gray-50 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold mb-4">Activity</h3>
          <div className="space-y-4">
            {editedTask.activity?.map((entry, index) => (
              <div key={index} className="text-sm border-b pb-2">
                <p className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                <p className="text-gray-700">{entry.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}