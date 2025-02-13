import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../redux/taskSlice";
import { RootState } from "../redux/store"; // Assuming this is where the store is defined

interface AddTaskModalProps {
  onClose: () => void;
}

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const user = useSelector((state: RootState) => state.user.user); // Added useSelector

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return; // Added user check

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid, // Added userId
      title,
      description,
      category,
      dueDate,
      status,
      fileUrl: file ? URL.createObjectURL(file) : undefined
    };
    dispatch(addTask(newTask));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit}>
          {/* Task Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            maxLength={300}
          ></textarea>

          {/* Task Category */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className={`px-3 py-1 rounded ${category === "Work" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCategory("Work")}
            >
              Work
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded ${category === "Personal" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCategory("Personal")}
            >
              Personal
            </button>
          </div>

          {/* Due Date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />

          {/* Task Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="Todo">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* File Upload */}
          <div className="mb-3 border p-3 rounded">
            <label className="block text-gray-600 mb-2">Attach Screenshot</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {file && <p className="text-sm text-gray-500 mt-1">📎 {file.name}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}