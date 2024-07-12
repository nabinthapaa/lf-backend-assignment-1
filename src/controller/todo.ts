import { UUID } from "../types/types";
import { Response } from "express";
import httpStatusCode from "http-status-codes";
import { Request } from "../interface/auth";
import * as TodoService from "../services/todo";

export async function getTodos(req: Request, res: Response) {
  const { user } = req;
  if (!user) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "User not found",
    });
  }
  const data = await TodoService.getTodos(user.id);
  if (!data) {
    res.status(httpStatusCode.NOT_FOUND).json({
      message: "No todos found",
    });
  } else {
    res.status(httpStatusCode.OK).json([...data]);
  }
}

export async function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: "Task is missing. Couldn't create a Todo",
    });
  }
  const { task } = body;
  const { user } = req;
  const service_response = await TodoService.createTodo(
    task as string,
    user?.id!,
  );
  if (service_response.data) {
    res.status(httpStatusCode.OK).json(service_response);
  } else {
    res.status(httpStatusCode.NOT_FOUND).json(service_response);
  }
}

export async function updateTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      error: "Id is required",
    });
    return;
  }
  if (!user) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "User not found",
    });
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
  if (service_response.data) {
    res.status(httpStatusCode.OK).json(service_response);
  } else {
    res.status(httpStatusCode.NOT_FOUND).json(service_response);
  }
}

//@ts-ignore
export async function deleteTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      error: "Id is required",
    });
  }
  if (!user) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "User not found",
    });
  }
  const service_response = await TodoService.deleteTodo(id, user.id);
  if (service_response.data) {
    res.status(httpStatusCode.OK).json(service_response);
  } else {
    res.status(httpStatusCode.NOT_FOUND).json(service_response);
  }
}
