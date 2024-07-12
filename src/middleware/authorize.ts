import { NextFunction } from "express";
import { Request } from "../interface/auth";

export function authorize(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    if (permission === "id") {
      const id = user.id;
      const { id: requestId } = req.query;
      if (id === requestId) {
        next();
      }
      return;
    }

    if (!user.permissions.includes(permission)) {
      throw new Error("Forbidden");
    }
    next();
  };
}
