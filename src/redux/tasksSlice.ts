import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  status: string;
  userId: string;
  order: number;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<Task>) => {
      const tasksInSameStatus = state.tasks.filter(t => t.status === action.payload.status);
      const maxOrder = tasksInSameStatus.length > 0 
        ? Math.max(...tasksInSameStatus.map(t => t.order))
        : -1;
      state.tasks.push({
        ...action.payload,
        order: maxOrder + 1
      });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.tasks[index].status;
        const newStatus = action.payload.status;

        if (oldStatus !== newStatus) {
          // Reorder tasks in the new status
          const tasksInNewStatus = state.tasks.filter(t => t.status === newStatus);
          const maxOrder = tasksInNewStatus.length > 0 
            ? Math.max(...tasksInNewStatus.map(t => t.order))
            : -1;
          state.tasks[index] = {
            ...action.payload,
            order: maxOrder + 1
          };
        } else {
          state.tasks[index] = action.payload;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { createTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;