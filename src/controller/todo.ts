import { Request, Response } from "express";
import * as TodoService from "../services//todo";

export function getTodos(_: Request, res: Response) {
  const data = TodoService.getTodos();
  if (!data) {
    res.status(404).json({
      message: "No todos found",
    });
  } else {
    res.status(404).json([...data]);
  }
}

export function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    res.status(404).send({
      message: "Task is missing. Couldn't create a Todo",
    });
  }
  const { task } = body;
  const service_response = TodoService.createTodo(task as string);
  if (service_response.data) {
    res.status(200).send(service_response);
  } else {
    res.status(404).send(service_response);
  }
}

export function updateTodo(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const { query } = req;
  const { task, isCompleted } = req.body;
  const service_response = TodoService.updateTodo(
    id,
    String(query.update),
    task,
    isCompleted,
  );
  if (service_response.data) {
    res.status(200).send(service_response);
  } else {
    res.status(404).send(service_response);
  }
}

export function deleteTodo(req: Request, res: Response) {
  const { params } = req;
  const id = parseInt(params.id, 10);
  console.log(id);
  const service_response = TodoService.deleteTodo(id);
  if (service_response.data) {
    res.status(200).send(service_response);
  } else {
    res.status(404).send(service_response);
  }
}
