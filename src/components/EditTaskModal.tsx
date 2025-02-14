
import React, { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
            <EditorContent
              editor={useEditor({
                extensions: [StarterKit, Placeholder.configure({ placeholder: 'Description' })],
                content: editedTask.description,
                onUpdate: ({ editor }) => {
                  setEditedTask({...editedTask, description: editor.getHTML()});
                },
              })}
              className="w-full min-h-[100px] p-2 border rounded prose max-w-none"
            />
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
      </div>
    </div>
  );
}
