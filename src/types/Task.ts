
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  fileUrl?: string;
  order?: number;
  selected?: boolean;
}
