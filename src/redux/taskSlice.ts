import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  activity?: { timestamp: string; action: string; details: string }[];
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
      builder.addCase(fetchTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
      });
      builder.addCase(fetchTasks.fulfilled, (state, action) => {
          state.tasks = action.payload;
          state.loading = false;
          state.error = null;
      });
      builder.addCase(fetchTasks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      });
      builder.addCase(createTask.pending, (state) => {
          state.loading = true;
          state.error = null;
      });
      builder.addCase(createTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
          state.loading = false;
          state.error = null;
      });
      builder.addCase(createTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      });
      builder.addCase(modifyTask.pending, (state) => {
          state.loading = true;
          state.error = null;
      });
      builder.addCase(modifyTask.fulfilled, (state, action) => {
          const index = state.tasks.findIndex((task) => task.id === action.payload.id);
          if (index !== -1) {
              state.tasks[index] = action.payload;
          }
          state.loading = false;
          state.error = null;
      });
      builder.addCase(modifyTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      });
      builder.addCase(removeTask.pending, (state) => {
          state.loading = true;
          state.error = null;
      });
      builder.addCase(removeTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter((task) => task.id !== action.payload);
          state.loading = false;
          state.error = null;
      });
      builder.addCase(removeTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      });
  }
});

export const { setTasks, addTask, updateTask, deleteTask, setLoading, setError } = taskSlice.actions;

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (userId: string) => {
      try {
        if (!userId) {
          console.warn("fetchTasks: No userId provided");
          return [];
        }
        console.log("Fetching tasks for userId:", userId);
        const tasksRef = collection(db, 'tasks');
        const q = query(tasksRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        console.log("Fetched tasks count:", querySnapshot.size);
        const tasks = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          userId: doc.data().userId || userId,
        })) as Task[];
        return tasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error instanceof Error ? error : new Error('An error occurred');
      }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (task: Task) => {
      try {
        console.log("Creating task:", task);
        const tasksCollection = collection(db, 'tasks');
        const { fileUrl, ...taskData } = task;
        const taskWithActivity = {
          ...taskData,
          fileUrl: fileUrl || null,
          createdAt: new Date().toISOString(),
          activity: [{
            timestamp: new Date().toISOString(),
            action: 'created',
            details: `Task "${task.title}" created with status "${task.status}"`
          }]
        };
        const docRef = await addDoc(tasksCollection, taskWithActivity);
        console.log("Task created successfully with ID:", docRef.id);
        return { ...taskWithActivity, id: docRef.id };
      } catch (error) {
        console.error("Error creating task:", error);
        throw error instanceof Error ? error : new Error('An error occurred');
      }
    }
);


export const modifyTask = createAsyncThunk(
    'tasks/modifyTask',
    async (task: Task) => {
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
        return updatedTask;
      } catch (error) {
        console.error("Error modifying task:", error);
        throw error instanceof Error ? error : new Error('An error occurred');
      }
    }
);

export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (taskId: string) => {
      try {
        console.log('=== DELETE OPERATION START ===');
        if (!taskId) {
          console.error("VALIDATION ERROR: No taskId provided for deletion");
          throw new Error("No taskId provided");
        }
        console.log('1. DELETE REQUEST - Task ID:', taskId);
        console.log('2. FIRESTORE CONNECTION:', !!db ? 'Connected' : 'Not Connected');
        const taskRef = doc(db, 'tasks', taskId);
        console.log("CHECKING TASK - Verifying task existence in Firestore");
        const docSnapshot = await getDoc(taskRef);
        if (!docSnapshot.exists()) {
          console.error("SERVER RESPONSE - Task not found in Firestore");
          throw new Error("Task not found");
        }
        console.log("TASK DATA - Current task data:", docSnapshot.data());
        console.log("SENDING DELETE - Executing deleteDoc operation");
        await deleteDoc(taskRef);
        const verifySnapshot = await getDoc(taskRef);
        if (!verifySnapshot.exists()) {
          console.log("SERVER RESPONSE - Task successfully deleted from Firestore");
          return taskId;
        } else {
          console.error("SERVER RESPONSE - Delete operation failed, document still exists");
          throw new Error("Delete operation failed");
        }
      } catch (error) {
        console.error('=== DELETE OPERATION FAILED ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        console.error('Firestore connection state:', !!db);
        console.error('TaskId:', taskId);
        throw error instanceof Error ? error : new Error('An error occurred');
      }
    }
);

export default taskSlice.reducer;