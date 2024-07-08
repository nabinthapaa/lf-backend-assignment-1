import { ITodo } from "../interface/todo";
import todos from "../data/todos";

export function getTodos(): ITodo[] {
  return todos;
}

export function createTodo(todo: ITodo): ITodo | null {
  const oldLength = todos.length;
  todos.push(todo);
  const newLength = todos.length;
  return newLength > oldLength ? todo : null;
}

export function updateTodo(id: number, task: string): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return null;
  todo.task = task;
  return todo;
}

export function updateTodoStatus(
  id: number,
  isCompleted: boolean,
): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) return null;
  todo.isCompleted = isCompleted;
  if (todo.isCompleted) {
    todo.completedAt = new Date();
  }
  return todo;
}

export function deleteTodo(id: number): ITodo | null {
  const todo = todos.find((todo) => todo.id === id);
  const remaining = todos.filter((todo) => todo.id !== id);
  if (!todo) return null;
  todos.length = 0;
  todos.push(...remaining);
  return todo;
}
