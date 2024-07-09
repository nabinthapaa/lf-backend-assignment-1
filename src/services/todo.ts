import { UUID } from "crypto";
import { ITodo } from "../interface/todo";
import * as TodoModel from "../models/Todo";
import { getUUID } from "../utils/getUUID";

export async function getTodos(userId: UUID) {
  return await TodoModel.getTodos(userId);
}

export async function createTodo(task: string, userId: UUID) {
  const todo: ITodo = {
    id: getUUID(),
    task,
    user: userId,
    createdAt: new Date(),
    isCompleted: false,
    completedAt: null,
  };
  const data = await TodoModel.createTodo(todo);
  if (data) {
    return {
      message: "Todo created successfully",
      data,
    };
  } else {
    return {
      message: "Failed to create Todo",
      data,
    };
  }
}

export async function updateTodo(
  id: UUID,
  query: string,
  user: UUID,
  task?: string,
  isCompleted?: boolean,
): Promise<{ message: string; data: ITodo | null }> {
  let data: ITodo | null = null;
  if (query === "status" && typeof isCompleted === "boolean") {
    data = await TodoModel.updateTodoStatus(id, isCompleted, user);
  } else if (query === "task" && typeof task === "string") {
    data = await TodoModel.updateTodo(id, task, user);
  }
  if (data) {
    return {
      message: "Update Sucessfull",
      data,
    };
  } else {
    return {
      message: "Update Failed",
      data,
    };
  }
}

export async function deleteTodo(
  id: UUID,
  userId: UUID,
): Promise<{
  message: string;
  data: ITodo | null;
}> {
  const data = await TodoModel.deleteTodo(id, userId);
  if (data) {
    return {
      message: "Successfully deleted",
      data,
    };
  } else {
    return {
      message: "Failed to Delete",
      data,
    };
  }
}
