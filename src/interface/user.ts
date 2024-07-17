import { UUID } from "../types/types";

export interface IUser {
  id: UUID;
  name: string;
  email: string;
  password: string;
  permissions: string[];
}

export interface IQueryUser {
  id?: UUID;
}

export interface IPermission {
  id: number;
  permission: string;
}
