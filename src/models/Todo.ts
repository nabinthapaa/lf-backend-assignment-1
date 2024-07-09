import { UUID } from "crypto";
import { ITodo } from "../interface/todo";
import fs from "fs/promises";
import path from "node:path";

const pathToTodos = path.join(__dirname, "../data/todo.json");

export async function getTodos(userId: UUID): Promise<ITodo[]> {
  const todos = await getTodosFromFile();
  return todos.filter(({ user }) => user === userId);
}

export async function createTodo(todo: ITodo) {
  const todos = await getTodosFromFile();
  todos.push(todo);
  await writeTodos(todos);
  return todo;
}

export async function updateTodo(id: UUID, task: string, userId: UUID) {
  const todos = await getTodosFromFile();
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  if (!todo) return null;
  todo.task = task;
  return todo;
}

export async function updateTodoStatus(
  id: UUID,
  isCompleted: boolean,
  userId: UUID,
) {
  const todos = await getTodosFromFile();
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  if (!todo) return null;
  todo.isCompleted = isCompleted;
  if (todo.isCompleted) {
    todo.completedAt = new Date();
  }
  await writeTodos(todos);
  return todo;
}

export async function deleteTodo(id: UUID, userId: UUID) {
  const todos = await getTodosFromFile();
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  const remaining = todos.filter((todo) => todo.id !== id);
  if (!todo) return null;
  todos.length = 0;
  todos.push(...remaining);
  return todo;
}

async function getTodosFromFile() {
  try {
    const usersData = await fs.readFile(pathToTodos, "utf8");
    const parsedData: ITodo[] = JSON.parse(usersData);
    return parsedData;
  } catch (error) {
    console.error("Model -> getUsersData: ", error);
    throw new Error("Error reading user data");
  }
}

async function writeTodos(todos: ITodo[]) {
  try {
    const data = JSON.stringify(todos, null, 2);
    await fs.writeFile(pathToTodos, data, "utf8");
  } catch (error) {
    console.error("Model -> writeUserData: ", error);
    throw new Error("Internal Error");
  }
}
