import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { modifyTask } from "../redux/taskSlice";
import { Task } from "../types/Task";
import { auth } from "../firebase/firebaseConfig";
import { uploadImage } from '../firebase/storageConfig';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(task.fileUrl || null);
  const dispatch = useDispatch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    let fileUrl = editedTask.fileUrl;
    if (file) {
      try {
        fileUrl = await uploadImage(file, user.uid);
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const updatedTask = {
      ...editedTask,
      fileUrl,
      lastModified: new Date().toISOString()
    };

    dispatch(modifyTask(updatedTask) as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        <div className="w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Edit Task</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Title*</label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Description*</label>
              <div id="toolbar-container">
                <span className="ql-formats">
                  <select className="ql-header">
                    <option value="1">Heading</option>
                    <option value="2">Subheading</option>
                    <option selected>Normal</option>
                  </select>
                  <button className="ql-bold"></button>
                  <button className="ql-italic"></button>
                  <button className="ql-underline"></button>
                </span>
              </div>
              <div id="quill-editor" className="h-32"></div>
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
                  onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
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
                {previewUrl && (
                  <div className="mt-4">
                    <img src={previewUrl} alt="Preview" className="max-w-xs mx-auto rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/3 p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          <div className="space-y-4">
            {task.activity?.map((entry, index) => (
              <div key={index} className="flex flex-col gap-1 text-sm border-b pb-4">
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
  );
}