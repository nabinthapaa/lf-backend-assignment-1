import { Request, Response } from "express";
import * as TodoService from "../services/todo";
import { UUID } from "crypto";

export async function getTodos(req: Request, res: Response) {
  //@ts-ignore
  const { user } = req;
  const data = await TodoService.getTodos(user.id);
  if (!data) {
    res.status(404).json({
      message: "No todos found",
    });
  } else {
    res.status(200).json([...data]);
  }
}

export async function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    res.status(404).json({
      message: "Task is missing. Couldn't create a Todo",
    });
  }
  const { task } = body;
  //@ts-ignore
  const { user } = req;
  const service_response = await TodoService.createTodo(
    task as string,
    user.id,
  );
  if (service_response.data) {
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}

export async function updateTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  const {
    //@ts-ignore
    user: { id: userId },
  } = req;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
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
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}

export async function deleteTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  //@ts-ignore
  const { user } = req;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
  const service_response = await TodoService.deleteTodo(id, user.id);
  if (service_response.data) {
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}
