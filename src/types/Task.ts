
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Completed";
  category: string;
  dueDate: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  activity?: { timestamp: string; action: string; details: string }[];
  selected?: boolean;
  completed?: boolean;
  order?: number;
}
