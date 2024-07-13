import { UUID } from "../types/types";

export interface ITodo {
  id: UUID;
  user: UUID;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}
