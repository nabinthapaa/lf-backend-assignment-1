import path from "node:path";
import { NotFoundError } from "../errors";
import { ITodo } from "../interface/todo";
import { UUID } from "../types/types";
import { getFileContents, writeContentsToFile } from "../utils/fileHandler";

const pathToTodos = path.join(__dirname, "../data/todo.json");

/**
 * Returns an array of todos of the user with id passed
 *
 * @param {UUID} userId - id of user whose todos are to be retrived
 * @returns {Promise<ITodo[]>} - Array of todos of user
 */
export async function getTodos(userId: UUID): Promise<ITodo[]> {
  let fileContents = await getFileContents(pathToTodos);
  let todos = JSON.parse(fileContents) as ITodo[];
  return todos.filter(({ user }) => user === userId);
}

/**
 * Adds a newly created to todo to the list
 *
 * @param {ITodo} todo - new todo to add
 * @returns {Promise<ITodo>} - newly created todo
 */
export async function createTodo(todo: ITodo): Promise<ITodo> {
  let fileContents = await getFileContents(pathToTodos);
  let todos = JSON.parse(fileContents) as ITodo[];
  todos.push(todo);
  const dataToWrite = JSON.stringify(todos, null, 2);
  await writeContentsToFile(dataToWrite, pathToTodos);
  return todos.find(({ id: todoId }) => todoId === todo.id);
}

/**
 * Modifies the existing todo with the newly provided value of task
 * only if the list contains mactching `id` of `todo` and `id` of `user`
 *
 * @param {UUID} id - id of todo to modify
 * @param {string} task - new value of task to assign to todo
 * @param {UUID} userId - id of user whose todo is to be modified
 * @returns {Promise<ITodo>} - Updated todo
 * @throws {NotFoundError} - if the condition for finding todo do not match
 */
export async function updateTodo(
  id: UUID,
  task: string,
  userId: UUID,
): Promise<ITodo> {
  let fileContents = await getFileContents(pathToTodos);
  let todos = JSON.parse(fileContents) as ITodo[];
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  if (!todo) {
    throw new NotFoundError(`Todo not found`);
  }
  todo.task = task;
  const dataToWrite = JSON.stringify(todos, null, 2);
  await writeContentsToFile(dataToWrite, pathToTodos);
  return todo;
}

/**
 * Modifies todo based on the value of `isCompleted`
 * if true : Update `isCompleted` to `true` and set `compeleteAt` to `current date`
 * else : set `isCompleted` to `false` and `compeleteAt` to `null`
 *
 * @param {UUID} id - id of todo to modify
 * @param {boolean} isCompleted - value indication if task is completed or not
 * @param {UUID} userId - id of user whose todo is to be modified
 * @returns {Promise<ITodo>} - Updated todo
 * @throws {NotFoundError} - if the condition for finding todo do not match
 */
export async function updateTodoStatus(
  id: UUID,
  isCompleted: boolean,
  userId: UUID,
): Promise<ITodo> {
  let fileContents = await getFileContents(pathToTodos);
  let todos = JSON.parse(fileContents) as ITodo[];
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  if (!todo) {
    throw new NotFoundError(`Todo not found`);
  }
  todo.isCompleted = isCompleted;
  if (todo.isCompleted) {
    todo.completedAt = new Date();
  } else {
    todo.completedAt = null;
  }
  const dataToWrite = JSON.stringify(todos, null, 2);
  await writeContentsToFile(dataToWrite, pathToTodos);
  return todo;
}

/**
 *  Deletes the todo by comparing the passed on value of userId
 *  and id with users from todo and id of todo respectively
 *
 * @param {UUID} id - id of to which is to be deleted
 * @param {UUID} userId - id of user whose todo is to be deleted
 * @returns {Promise<ITodo>} - Deleted todo
 * @throws {NotFoundError} - if the todo is not found
 */
export async function deleteTodo(id: UUID, userId: UUID): Promise<ITodo> {
  let fileContents = await getFileContents(pathToTodos);
  let todos = JSON.parse(fileContents) as ITodo[];
  const todo = todos.find((todo) => todo.id === id && todo.user === userId);
  if (!todo) {
    throw new NotFoundError(`Todo not found`);
  }
  const remaining = todos.filter((todo) => todo.id !== id);
  todos.length = 0;
  todos.push(...remaining);
  const dataToWrite = JSON.stringify(todos, null, 2);
  await writeContentsToFile(dataToWrite, pathToTodos);
  return todo;
}
