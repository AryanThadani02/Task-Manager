import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Task } from '../types/Task';

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: []
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;

// Thunks
export const fetchTasks = (userId: string) => async (dispatch: any) => {
  try {
    if (!userId) {
      console.warn("fetchTasks: No userId provided");
      dispatch(setTasks([]));
      return;
    }
    console.log("Fetching tasks for userId:", userId);
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    console.log("Fetched tasks count:", querySnapshot.size);
    const tasks = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Task data:", { id: doc.id, ...data });
      return { 
        ...data, 
        id: doc.id,
        userId: data.userId || userId
      };
    }) as Task[];
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    dispatch(setTasks([]));
  }
};

export const createTask = (task: Task) => async (dispatch: any) => {
  try {
    console.log("Creating task:", task);
    
    // First verify the tasks collection
    const tasksCollection = collection(db, 'tasks');
    const snapshot = await getDocs(tasksCollection);
    console.log("Current tasks count before adding:", snapshot.size);
    
    // Prepare task data
    const { fileUrl, ...taskData } = task;
    const taskWithActivity = {
      ...taskData,
      fileUrl: fileUrl || null, // Ensure fileUrl is never undefined
      createdAt: new Date().toISOString(),
      activity: [{
        timestamp: new Date().toISOString(),
        action: 'created',
        details: `Task "${task.title}" created with status "${task.status}"`
      }]
    };

    // Add the document
    const docRef = await addDoc(tasksCollection, taskWithActivity);
    console.log("Task created successfully with ID:", docRef.id);
    
    // Verify the document was added
    const newDoc = await getDocs(tasksCollection);
    console.log("Current tasks count after adding:", newDoc.size);
    
    dispatch(addTask({ ...taskWithActivity, id: docRef.id }));
  } catch (error) {
    console.error("Error creating task:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error; // Rethrow to handle in the UI
  }
};

export const modifyTask = (task: Task) => async (dispatch: any) => {
  try {
    console.log("Modifying task:", task);
    const taskRef = doc(db, 'tasks', task.id);

    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
      activity: [
        ...(task.activity || []),
        {
          timestamp: new Date().toISOString(),
          action: 'updated',
          details: `Task "${task.title}" updated - New Status: ${task.status}`
        }
      ]
    };
    
    await updateDoc(taskRef, updatedTask);
    console.log("Task updated successfully");
    dispatch(updateTask(updatedTask));
  } catch (error) {
    console.error("Error modifying task:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error; // Rethrow to handle in the UI
  }
};

export const removeTask = (taskId: string) => async (dispatch: any) => {
  try {
    if (!taskId) {
      console.error("No taskId provided for deletion");
      return;
    }
    
    console.log("DELETE REQUEST - Attempting to remove task with ID:", taskId);
    const taskRef = doc(db, 'tasks', taskId);
    
    // First verify the task exists
    console.log("CHECKING TASK - Verifying task existence in Firestore");
    const docSnapshot = await getDoc(taskRef);
    
    if (!docSnapshot.exists()) {
      console.error("SERVER RESPONSE - Task not found in Firestore");
      return;
    }
    
    console.log("TASK DATA - Current task data:", docSnapshot.data());
    
    // Proceed with deletion
    console.log("SENDING DELETE - Executing deleteDoc operation");
    await deleteDoc(taskRef);
    
    // Verify deletion
    const verifySnapshot = await getDoc(taskRef);
    if (!verifySnapshot.exists()) {
      console.log("SERVER RESPONSE - Task successfully deleted from Firestore");
      // Update Redux store
      dispatch(deleteTask(taskId));
    } else {
      console.error("SERVER RESPONSE - Delete operation failed, document still exists");
      throw new Error("Delete operation failed");
    }
  } catch (error) {
    console.error("SERVER ERROR - Failed to delete task:", error);
    console.error("ERROR DETAILS:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export default taskSlice.reducer;