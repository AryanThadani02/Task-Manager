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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error: null,
  loading: false
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.status = 'succeeded';
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
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
      builder.addCase(fetchTasks.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      });
      builder.addCase(fetchTasks.fulfilled, (state, action) => {
          state.tasks = action.payload;
          state.status = 'succeeded';
          state.error = null;
      });
      builder.addCase(fetchTasks.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'An unknown error occurred';
      });
      builder.addCase(createTask.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      });
      builder.addCase(createTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
          state.status = 'succeeded';
          state.error = null;
      });
      builder.addCase(createTask.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'An unknown error occurred';
      });
      builder.addCase(modifyTask.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      });
      builder.addCase(modifyTask.fulfilled, (state, action) => {
          const index = state.tasks.findIndex((task) => task.id === action.payload.id);
          if (index !== -1) {
              state.tasks[index] = action.payload;
          }
          state.status = 'succeeded';
          state.error = null;
      });
      builder.addCase(modifyTask.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'An unknown error occurred';
      });
      builder.addCase(removeTask.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      });
      builder.addCase(removeTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter((task) => task.id !== action.payload);
          state.status = 'succeeded';
          state.error = null;
      });
      builder.addCase(removeTask.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'An unknown error occurred';
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
        const err = error as Error;
        console.error('Error fetching tasks:', err);
        throw err;
      }
    }
);

export const createTask = createAsyncThunk<Task, Omit<Task, 'id' | 'createdAt' | 'activity'>>('tasks/createTask',
    'tasks/createTask',
    async (taskData) => {
      try {
        console.log("Creating task:", taskData);
        const tasksCollection = collection(db, 'tasks');
        const { fileUrl, ...taskDataWithoutFileUrl } = taskData;
        const taskWithActivity = {
          ...taskDataWithoutFileUrl,
          fileUrl: fileUrl ?? undefined,
          createdAt: new Date().toISOString(),
          activity: [{
            timestamp: new Date().toISOString(),
            action: 'created',
            details: `Task "${taskData.title}" created with status "${taskData.status}"`
          }]
        } as Task;
        const docRef = await addDoc(tasksCollection, taskWithActivity);
        console.log("Task created successfully with ID:", docRef.id);
        return { ...taskWithActivity, id: docRef.id };
      } catch (error) {
        const err = error as Error;
        console.error("Error creating task:", err);
        throw err;
      }
    }
);


export const modifyTask = createAsyncThunk<Task, Task>(
    'tasks/modifyTask',
    async (taskData) => {
      try {
        console.log("Modifying task:", taskData);
        const taskRef = doc(db, 'tasks', taskData.id || '');
        const updatedTask = {
          ...taskData,
          updatedAt: new Date().toISOString(),
          activity: [
            ...(taskData.activity || []),
            {
              timestamp: new Date().toISOString(),
              action: 'updated',
              details: `Task "${taskData.title}" updated - New Status: ${taskData.status}`
            }
          ]
        };
        await updateDoc(taskRef, updatedTask);
        console.log("Task updated successfully");
        return updatedTask;
      } catch (error) {
        const err = error as Error;
        console.error("Error modifying task:", err);
        throw err;
      }
    }
);

export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (taskId: string | undefined) => {
      if (!taskId) {
        throw new Error('Task ID is required');
      }
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
        const err = error as Error;
        console.error('=== DELETE OPERATION FAILED ===');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('Firestore connection state:', !!db);
        console.error('TaskId:', taskId);
        throw err;
      }
    }
);

export default taskSlice.reducer;