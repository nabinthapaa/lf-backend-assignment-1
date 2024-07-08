import * as TodoModel from "../models/Todo";

export function getTodos() {
  return TodoModel.getTodos();
}

export function createTodo(task: string) {
  return TodoModel.createTodo(task as string);
}

export function updateTodo(id: number, task: string) {
  return TodoModel.updateTodo(id, task);
}

export function updateTodoStatus(id: number, isCompleted: boolean) {
  return TodoModel.updateTodoStatus(id, isCompleted);
}

export function deleteTodo(id: number) {
  return TodoModel.deleteTodo(id);
}
