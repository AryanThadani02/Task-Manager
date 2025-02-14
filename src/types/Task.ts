
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  fileUrl?: string | null;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
  activity: {
    timestamp: string;
    action: string;
    details: string;
  }[];
}
