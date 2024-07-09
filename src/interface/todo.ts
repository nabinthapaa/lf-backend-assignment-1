import { UUID } from "crypto";

export interface ITodo {
  id: UUID;
  user: UUID;
  task: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}
