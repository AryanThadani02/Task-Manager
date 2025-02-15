
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
  const [activeTab, setActiveTab] = useState('DETAILS');
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (activeTab === 'DETAILS') {
      setTimeout(() => {
        const quill = new (window as any).Quill('#quill-editor-edit', {
          theme: 'snow',
          placeholder: 'Enter description...',
          modules: {
            toolbar: {
              container: '#toolbar-container-edit'
            }
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

        return () => {
          observer.disconnect();
          const toolbarElement = document.querySelector('.ql-toolbar');
          const editorElement = document.querySelector('.ql-editor');
          if (toolbarElement) toolbarElement.remove();
          if (editorElement) editorElement.remove();
        };
      }, 0);
    }
  }, [activeTab]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
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
      fileUrl: file ? URL.createObjectURL(file) : editedTask.fileUrl,
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
      await dispatch(modifyTask(updatedTask));
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-[9999] md:items-center md:justify-center md:bg-black/50">
      <div className="flex-1 w-full bg-white md:flex-initial md:max-w-lg md:rounded-lg md:max-h-[90vh] md:my-8 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>
          
          <div className="flex border-b">
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

        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 150px)' }}>
          {activeTab === 'DETAILS' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm ${editedTask.category === 'Work' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setEditedTask({...editedTask, category: 'Work'})}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm ${editedTask.category === 'Personal' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setEditedTask({...editedTask, category: 'Personal'})}
                >
                  Personal
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-600">Due on*</label>
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  className="w-full p-2 mt-1 border rounded"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Task Status*</label>
                <select
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({...editedTask, status: e.target.value as Task['status']})}
                  className="w-full p-2 mt-1 border rounded"
                  required
                >
                  <option value="Todo">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Attachment</label>
                <div className="mt-1 p-4 border border-dashed rounded-lg text-center">
                  <p className="text-sm text-gray-500">Drop your files here or <span className="text-purple-600">Upload</span></p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
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
