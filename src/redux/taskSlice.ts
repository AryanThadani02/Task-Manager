
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
  if (!userId) return;
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const tasks = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[];
  dispatch(setTasks(tasks));
};

export const createTask = (task: Task) => async (dispatch: any) => {
  const docRef = await addDoc(collection(db, 'tasks'), task);
  dispatch(addTask({ ...task, id: docRef.id }));
};

export const modifyTask = (task: Task) => async (dispatch: any) => {
  await updateDoc(doc(db, 'tasks', task.id), task);
  dispatch(updateTask(task));
};

export const removeTask = (taskId: string) => async (dispatch: any) => {
  await deleteDoc(doc(db, 'tasks', taskId));
  dispatch(deleteTask(taskId));
};

export default taskSlice.reducer;
