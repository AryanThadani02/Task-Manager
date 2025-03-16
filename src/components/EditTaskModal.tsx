import React, { useState, useRef, useEffect } from "react";
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
  const [editedTask, setEditedTask] = useState(task);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('DETAILS');
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  React.useEffect(() => {
    let quill: any = null;

    // Wait for the element to be available
    const initQuill = () => {
      const editor = document.querySelector('#quill-editor-edit');
      if (!editor) {
        setTimeout(initQuill, 100);
        return;
      }

      // Remove any existing toolbar
      const existingToolbar = document.querySelector('.ql-toolbar');
      if (existingToolbar) {
        existingToolbar.remove();
      }

      // Initialize Quill
      quill = new (window as any).Quill('#quill-editor-edit', {
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

      // Set initial content
      if (editedTask.description) {
        quill.root.innerHTML = editedTask.description;
      }

      // Handle content changes
      quill.on('text-change', () => {
        setEditedTask(prev => ({...prev, description: quill.root.innerHTML}));
      });
    };

    initQuill();

    // Cleanup
    return () => {
      if (quill) {
        quill.off('text-change');
        const toolbar = document.querySelector('.ql-toolbar');
        if (toolbar) {
          toolbar.remove();
        }
      }
    };
  }, [editedTask.id]); // Only reinitialize when editing a different task

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && auth.currentUser) {
      const file = e.target.files[0];
      setFile(file);
      try {
        const imageUrl = await uploadImage(file, auth.currentUser.uid);
        setEditedTask(prev => ({...prev, fileUrl: imageUrl}));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const changes: string[] = [];

    if (task.title !== editedTask.title) {
      changes.push(`Title changed from "${task.title}" to "${editedTask.title}"`);
    }
    if (task.description !== editedTask.description) {
      changes.push("Description was updated");
    }
    if (task.category !== editedTask.category) {
      changes.push(`Category changed from "${task.category}" to "${editedTask.category}"`);
    }
    if (task.status !== editedTask.status) {
      changes.push(`Status changed from "${task.status}" to "${editedTask.status}"`);
    }
    if (task.dueDate !== editedTask.dueDate) {
      changes.push(`Due date changed from "${task.dueDate}" to "${editedTask.dueDate}"`);
    }
    if (file) {
      changes.push("New file was attached");
    }

    const updatedTask = {
      ...editedTask,
      fileUrl: file ? file.name : editedTask.fileUrl,
      activity: [
        ...(editedTask.activity || []),
        {
          timestamp: new Date().toISOString(),
          action: 'updated',
          details: changes.length > 0 ? changes.join(", ") : "Task was edited"
        }
      ]
    };

    try {
      await dispatch(modifyTask(updatedTask) as any);
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-[9999] md:items-center md:justify-center md:bg-black/50">
      <div ref={modalRef} className="flex-1 w-full bg-white md:flex-initial md:max-w-5xl md:rounded-lg md:max-h-[90vh] md:my-8 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex border-b md:hidden">
            <button 
              className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'DETAILS' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('DETAILS')}
            >
              DETAILS
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'ACTIVITY' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('ACTIVITY')}
            >
              ACTIVITY
            </button>
          </div>
        </div>

        {/* Desktop Row Layout */}
        <div className="hidden md:flex">
          <div className="flex-1 p-4 overflow-y-auto border-r" style={{ height: 'calc(100vh - 150px)' }}>
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Task Title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="w-full p-2 text-base border-0 border-b focus:ring-0 focus:border-gray-300"
                required
              />

              <div className="space-y-2">
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
                <div id="quill-editor-edit" className="h-32 mb-4"></div>
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
                  <label className="text-sm text-gray-600 mb-1 block">Task Status*</label>
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({...editedTask, status: e.target.value as Task['status']})}
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
                        src={file ? URL.createObjectURL(file) : editedTask.fileUrl} 
                        alt="Task attachment" 
                        className="max-w-full h-auto rounded-lg mx-auto"
                        style={{ maxHeight: '200px' }} 
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        📎 {file ? file.name : editedTask.fileUrl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="w-96 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 150px)' }}>
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

        {/* Mobile Content */}
        <div className="md:hidden p-4 overflow-y-auto" style={{ height: 'calc(100vh - 150px)' }}>
          {activeTab === 'DETAILS' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Task Title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="w-full p-2 text-base border-0 border-b focus:ring-0 focus:border-gray-300"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm text-gray-600 mb-2">Description</label>
                <textarea
                  value={editedTask.description?.replace(/<[^>]+>/g, '') || ''}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  className="w-full p-2 border rounded min-h-[100px] mb-4"
                  placeholder="Enter description..."
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
                  <label className="text-sm text-gray-600 mb-1 block">Task Status*</label>
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({...editedTask, status: e.target.value as Task['status']})}
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
                        src={file ? URL.createObjectURL(file) : editedTask.fileUrl} 
                        alt="Task attachment" 
                        className="max-w-full h-auto rounded-lg mx-auto"
                        style={{ maxHeight: '200px' }} 
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        📎 {file ? file.name : editedTask.fileUrl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          ) : (
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
          )}
        </div>

        <div className="sticky bottom-0 flex justify-between items-center p-4 bg-white border-t">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium"
          >
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
}