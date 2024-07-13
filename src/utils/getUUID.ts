import { UUID } from "../types/types";

/**
 * ### Generate a psuedo-random UUID V4
 *
 * UUID V4 format:
 * `xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx`
 * * `x` is a random hexadecimal number.
 * * `4` represent the uuid version.
 * * `y` value can only be `8`, `9`, `A`, `B`.
 *
 * @returns {UUID} - UUID V4 string
 */
export function getUUID(): UUID {
  const uuid: UUID = `${getRandomString(8)}-${getRandomString(4)}-4${getRandomString(3)}-${getVersionInfo()}${getRandomString(3)}-${getRandomString(12)}`;
  return uuid;
}

/**
 * Genreate a psuedo-random hex string of specified length
 *
 * @param {number} count - length of string to be generated
 * @returns {string} - psuedo-random hex string
 */
function getRandomString(count: number): string {
  let hex_string = "";
  for (let i = 0; i < count; i++) {
    hex_string += ((Math.random() * 16) | 0).toString(16);
  }
  return hex_string;
}

/**
 *  Generate the hex number from pool of `[8, 9, 10, 11]`
 *
 *  @returns {string} - hex string from pool
 */
function getVersionInfo(): string {
  const numberpool = [8, 9, 10, 11];
  return numberpool[(Math.random() * numberpool.length) | 0].toString(16);
}
