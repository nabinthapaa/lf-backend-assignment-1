import { Knex } from "knex";

const TABLE_NAME = "permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          id: 1,
          permission: "users.get",
        },
        {
          id: 2,
          permission: "users.create",
        },
        {
          id: 3,
          permission: "users.update",
        },
        {
          id: 4,
          permission: "users.delete",
        },
      ]);
    });
}
