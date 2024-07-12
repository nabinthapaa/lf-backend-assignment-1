import { UUID } from "../types/types";

export function getUUID(): UUID {
  const uuid: UUID = `${getRandomString(8)}-${getRandomString(4)}-${getRandomString(4)}-${getRandomString(4)}-${getRandomString(12)}`;
  return uuid;
}

function getRandomString(count: number): string {
  return Math.floor(Math.random() * count * 10 ** count).toString(16);
}
