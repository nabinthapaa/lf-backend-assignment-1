import { Response } from "express";
import { Request } from "../interface/auth";
import * as AdminService from "../services/admin.services";
import httpsStatusCode from "http-status-codes";

export async function getUsers(req: Request, res: Response) {
  const { id } = req.body;
  const data = await AdminService.getUser(id);
  return res.status(httpsStatusCode.OK).json(data);
}

export async function createUser(req: Request, res: Response) {
  const data = await AdminService.createUser(
    {
      ...req.body,
    },
    req.user.id,
  );
  return res.status(httpsStatusCode.OK).json(data);
}

export async function updateUser(req: Request, res: Response) {
  const data = await AdminService.updateUser({
    ...req.body,
  });
  return res.status(httpsStatusCode.OK).json(data);
}

export async function deleteUser(req: Request, res: Response) {
  const data = await AdminService.deleteUser(req.body!.id);
  return res.status(httpsStatusCode.OK).json(data);
}
