import { ITodo } from "../interface/todo";
import * as TodoModel from "../models/Todo";
import { getTodoId } from "../utils/getId";

export function getTodos() {
  return TodoModel.getTodos();
}

export function createTodo(task: string) {
  const todo: ITodo = {
    id: getTodoId(),
    task,
    createdAt: new Date(),
    isCompleted: false,
    completedAt: null,
  };
  const data = TodoModel.createTodo(todo);
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

export function updateTodo(
  id: number,
  query: string,
  task?: string,
  isCompleted?: boolean,
): { message: string; data: ITodo | null } {
  let data: ITodo | null = null;
  if (query === "status" && typeof isCompleted === "boolean") {
    data = TodoModel.updateTodoStatus(id, isCompleted);
  } else if (query === "task" && typeof task === "string") {
    data = TodoModel.updateTodo(id, task);
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

export function deleteTodo(id: number): {
  message: string;
  data: ITodo | null;
} {
  const data = TodoModel.deleteTodo(id);
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
