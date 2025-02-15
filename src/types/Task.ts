
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Completed";
  category: "Work" | "Personal";
  dueDate: string;
  completed: boolean;
  selected?: boolean;
  order?: number;
}
