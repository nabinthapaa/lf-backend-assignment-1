import { Request, Response } from "express";
import * as UserService from "../services/user";
import { UUID } from "crypto";
import { IUser } from "../interface/user";

interface Params {
  id?: UUID;
}

export async function getUserInfo(
  req: Request<any, any, any, Params>,
  res: Response,
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
  }
  try {
    const service_response = await UserService.getUserInfo(id!);
    if (!service_response) {
      res.status(404).json({
        error: "Could not find the user",
      });
    }
    res.status(200).json(service_response);
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserController -> createUser", e.message);
      res.status(404).json({
        error: e.message,
      });
    }
  }
}

export async function createUser(req: Request<any, any, IUser>, res: Response) {
  const { body } = req;
  const { email, password, name } = body;
  if (!email || !password || !name) {
    res.status(404).json({
      error: "All the required fields are not provided",
    });
    return;
  }
  try {
    const data = await UserService.createuser(body);
    if (data) {
      res.status(200).json({
        message: "User created Successfully",
        data,
      });
    }

    res.status(404).json({
      error: "Could not create user",
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserController -> createUser: ", e.message);
      res.status(404).json({
        error: e.message,
      });
    }
  }
}

export async function updateUser(
  req: Request<any, any, Partial<IUser>, Params>,
  res: Response,
) {
  const { id } = req.query;
  const { body } = req;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
  try {
    const service_response = await UserService.updateUser(id, body);
    if (service_response) {
      res.status(200).json(service_response);
    }

    res.status(404).json({
      error: "Could not update User",
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserController -> updateuser");
      res.status(404).json({ erroe: e.message });
    }
  }
}

export async function deleteUser(
  req: Request<any, any, any, Params>,
  res: Response,
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json({
      error: "No id provided",
    });
    return;
  }
  try {
    const service_response = await UserService.deleteUser(id);
    res.status(200).json(service_response);
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserController -> deleteUser: ");
      res.status(404).json({ erroe: e.message });
    }
  }
}
