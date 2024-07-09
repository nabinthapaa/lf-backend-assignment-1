import { Request, Response } from "express";
import * as TodoService from "../services/todo";
import { UUID } from "crypto";

export async function getTodos(_: Request, res: Response) {
  const data = await TodoService.getTodos();
  if (!data) {
    res.status(404).json({
      message: "No todos found",
    });
  } else {
    res.status(200).json([...data]);
  }
}

export function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    res.status(404).json({
      message: "Task is missing. Couldn't create a Todo",
    });
  }
  const { task } = body;
  const service_response = TodoService.createTodo(task as string);
  if (service_response.data) {
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}

export function updateTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
  const { query } = req;
  const { task, isCompleted } = req.body;
  const service_response = TodoService.updateTodo(
    id,
    String(query.update),
    task,
    isCompleted,
  );
  if (service_response.data) {
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}

export function deleteTodo(req: Request<{ id?: UUID }>, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
  const service_response = TodoService.deleteTodo(id);
  if (service_response.data) {
    res.status(200).json(service_response);
  } else {
    res.status(404).json(service_response);
  }
}
