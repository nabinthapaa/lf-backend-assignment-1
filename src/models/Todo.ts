import { UUID } from "crypto";
import { ITodo } from "../interface/todo";
import fs from "fs/promises";
import path from "node:path";

const todos: ITodo[] = [];

export async function getTodos(): Promise<ITodo[]> {
  const pathToFile = path.join(__dirname, "../data/todo.json");
  const todos: ITodo[] = JSON.parse(await fs.readFile(pathToFile, "utf8"));
  return todos;
}

export function createTodo(todo: ITodo): ITodo | null {
  fs.readFile("../data/todo.json")
    .then((data) => console.log(data))
    .catch((error) => console.log(error));

  return null;
}

export function updateTodo(id: UUID, task: string): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return null;
  todo.task = task;
  return todo;
}

export function updateTodoStatus(id: UUID, isCompleted: boolean): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return null;
  todo.isCompleted = isCompleted;
  if (todo.isCompleted) {
    todo.completedAt = new Date();
  }
  return todo;
}

export function deleteTodo(id: UUID): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  const remaining = todos.filter((todo) => todo.id !== id);
  if (!todo) return null;
  todos.length = 0;
  todos.push(...remaining);
  return todo;
}
