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
      dispatch(setTasks([]));
      return;
    }
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ 
      ...doc.data(), 
      id: doc.id,
      userId: doc.data().userId || userId // Ensure userId is set
    })) as Task[];
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    dispatch(setTasks([]));
  }
};

export const createTask = (task: Task) => async (dispatch: any) => {
  const taskWithActivity = {
    ...task,
    activity: [{
      timestamp: new Date().toISOString(),
      action: 'created',
      details: `Task "${task.title}" created with status "${task.status}"`
    }]
  };
  const docRef = await addDoc(collection(db, 'tasks'), taskWithActivity);
  dispatch(addTask({ ...taskWithActivity, id: docRef.id }));
};

export const modifyTask = (task: Task) => async (dispatch: any) => {
  const currentTask = (await getDocs(query(collection(db, 'tasks'), where('id', '==', task.id)))).docs[0]?.data();
  const updatedTask = {
    ...task,
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
  dispatch(updateTask(updatedTask));
};

export const removeTask = (taskId: string) => async (dispatch: any) => {
  await deleteDoc(doc(db, 'tasks', taskId));
  dispatch(deleteTask(taskId));
};

export default taskSlice.reducer;