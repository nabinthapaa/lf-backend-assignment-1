export interface ITodo {
  id: number;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}
