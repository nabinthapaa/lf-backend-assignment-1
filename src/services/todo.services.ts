import { BaseError } from "../errors";
import { ITodo } from "../interface/todo";
import * as TodoModel from "../models/Todo.model";
import { UUID } from "../types/types";
import { getUUID } from "../utils/getUUID";

/**
 * Retrieves todos for a specified user ID.
 * @param {UUID} userId - The ID of the user whose todos are to be fetched.
 * @returns {Promise<ITodo[]>} - A promise that resolves to an array of todos belonging to the user.
 */
export async function getTodos(userId: UUID): Promise<ITodo[]> {
  return (await TodoModel.getTodos(userId)).filter(
    (todo) => todo.id === userId,
  );
}

/**
 * Creates a new todo for a specified user.
 *
 * @param {string} task - The task description for the todo.
 * @param {UUID} userId - The ID of the user for whom the todo is created.
 * @returns {Promise<ITodo>} - A promise that resolves to the created todo object.
 * @throws {BaseError} - If creating the todo fails.
 */
export async function createTodo(task: string, userId: UUID): Promise<ITodo> {
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
    return data;
  }
  throw new BaseError("Failed to create a todo");
}

/**
 * Updates a todo based on the specified query.
 *
 * @param {UUID} id - The ID of the todo to update.
 * @param {string} query  - The type of update operation ("status" or "task").
 * @param {UUID} user - The ID of the user performing the update.
 * @param {string} task - The new task description if updating task.
 * @param {boolean} isCompleted - The new status (completed or not) if updating status.
 * @returns {Promise<ITodo>}  - A promise that resolves to the updated todo object.
 * @throws {BaseError} - If updating the todo fails or if the query parameters are invalid.
 */
export async function updateTodo(
  id: UUID,
  query: string,
  user: UUID,
  task?: string,
  isCompleted?: boolean,
): Promise<ITodo> {
  let data: ITodo | null = null;
  if (query === "status" && typeof isCompleted === "boolean") {
    data = await TodoModel.updateTodoStatus(id, isCompleted, user);
  } else if (query === "task" && typeof task === "string") {
    data = await TodoModel.updateTodo(id, task, user);
  }
  if (data) {
    return data;
  }
  throw new BaseError("Failed to update Todo");
}

/**
 * Deletes a todo with the specified ID for a user.
 *
 * @param {UUID} id - The ID of the todo to delete.
 * @param {UUID} userId - The ID of the user who owns the todo.
 * @returns {Promise<Itodo>} - Deleted Todo
 * @throws {BaseError} - If deleting the todo fails.
 */
export async function deleteTodo(id: UUID, userId: UUID): Promise<ITodo> {
  const data = await TodoModel.deleteTodo(id, userId);
  if (data) {
    return data;
  }
  throw new BaseError("Failed to delete todo");
}
