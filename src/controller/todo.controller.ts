import { UUID } from "../types/types";
import { Response } from "express";
import httpStatusCode from "http-status-codes";
import { Request } from "../interface/auth";
import * as TodoService from "../services/todo.services";
import { BadRequestError, NotFoundError } from "../errors";

export async function getTodos(req: Request, res: Response) {
  const { user } = req;
  if (!user) {
    throw new NotFoundError(`User not found`);
  }
  const data = await TodoService.getTodos(user.id);
  return res.status(httpStatusCode.OK).json([...data]);
}

export async function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    throw new BadRequestError("Task is required");
  }
  const { task } = body;
  const { user } = req;
  const data = await TodoService.createTodo(task as string, user?.id!);
  return res.status(httpStatusCode.OK).json(data);
}

export async function updateTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    throw new BadRequestError("Task id is not provided");
  }
  if (!user) {
    throw new BadRequestError("User not found");
  }
  const { id: userId } = user;
  const { query } = req;
  const { task, isCompleted } = req.body;
  const service_response = await TodoService.updateTodo(
    id,
    String(query.update),
    userId,
    task,
    isCompleted,
  );
  return res.status(httpStatusCode.OK).json(service_response);
}

export async function deleteTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    throw new BadRequestError("Id is required for deletion");
  }
  if (!user) {
    throw new NotFoundError(`User not found`);
  }
  const data = await TodoService.deleteTodo(id, user.id);
  return res.status(httpStatusCode.OK).json(data);
}
