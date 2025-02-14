import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
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
    const taskDoc = await getDocs(query(collection(db, 'tasks'), where('id', '==', task.id)));
    const currentTask = taskDoc.docs[0]?.data();
    console.log("Current task data:", currentTask);
    
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
      activity: [
        ...(currentTask?.activity || []),
        {
          timestamp: new Date().toISOString(),
          action: 'updated',
          details: `Task "${task.title}" updated - New Status: ${task.status}`
        }
      ]
    };
    
    await updateDoc(doc(db, 'tasks', task.id), updatedTask);
    console.log("Task updated successfully");
    dispatch(updateTask(updatedTask));
  } catch (error) {
    console.error("Error modifying task:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
  }
};

export const removeTask = (taskId: string) => async (dispatch: any) => {
  try {
    console.log("Removing task:", taskId);
    await deleteDoc(doc(db, 'tasks', taskId));
    console.log("Task removed successfully");
    dispatch(deleteTask(taskId));
  } catch (error) {
    console.error("Error removing task:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
  }
};

export default taskSlice.reducer;