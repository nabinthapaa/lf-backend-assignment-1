import { Request, Response } from "express";
import * as TodoService from "../services//todo";

export function getTodos(_: Request, res: Response) {
  const data = TodoService.getTodos();
  if (!data) {
    res.status(404).json({
      message: "No todos found",
    });
  } else {
    res.status(400).json({
      ...data,
    });
  }
}

export function createTodo(req: Request, res: Response) {
  const { body } = req;
  if (!req.body.task) {
    res.status(404).send({
      message: "Task is missing. Couldn't create a Todo",
    });
  }
  const { task } = body.task;
  const data = TodoService.createTodo(task as string);
  if (data) {
    res.status(200).send({
      message: "Todo Created Succesfully",
    });
  } else {
    res.status(404).send({
      message: "Couldn't create a Todo",
    });
  }
}

export function updateTodo(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const { body } = req;
  const task = String(body.task);
  const data = TodoService.updateTodo(id, task);
  if (data) {
    res.status(200).send({
      message: "Todo Updated Succesfully",
      data,
    });
  } else {
    res.status(404).send({
      message: "Couldn't update a Todo",
      todo: data,
    });
  }
}

export function updateTodoStatus(req: Request, res: Response) {
  const { body } = req;
  const id = parseInt(req.params.id, 10);
  const isCompleted = !!body.isCompleted;
  const data = TodoService.updateTodoStatus(id, isCompleted);
  if (data) {
    res.status(200).send({
      message: "Todo Updated Succesfully",
      data,
    });
  } else {
    res.status(404).send({
      message: "Couldn't update a Todo",
      todo: data,
    });
  }
}

export function deleteTodo(req: Request, res: Response) {
  const { body } = req;
  const id = parseInt(body.id, 10);
  const data = TodoService.deleteTodo(id);
  if (data) {
    res.status(200).json({
      message: "Succesfully deleted Todo",
      todo: data,
    });
  } else {
    res.status(404).json({
      message: "Couldn't find the todo",
    });
  }
}
