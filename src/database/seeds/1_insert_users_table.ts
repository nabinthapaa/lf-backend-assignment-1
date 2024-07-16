import { Knex } from "knex";

const TABLE_NAME = "users";

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
          id: "9a92e437-c86b-49f1-99d3-55c59331c61d",
          name: "John Doe",
          email: "john@test.com",
          password:
            "$2a$10$1MPkH3VLBsCsS72hkcUH3u4tsJAjSxHbVjq420O/wJtPXXT5fj6by",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
        },
        {
          id: "c980b4dc-7f40-4569-85c8-794ee8c6626c",
          name: "Jane Doe",
          email: "jane@test.com",
          password:
            "$2a$10$1MPkH3VLBsCsS72hkcUH3u4tsJAjSxHbVjq420O/wJtPXXT5fj6by",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
        },
        {
          id: "f482cc93-547b-4dc2-b1c0-83d18ee6b6e6",
          name: "Jimmy Doe",
          email: "jimmy@test.com",
          password:
            "$2a$10$1MPkH3VLBsCsS72hkcUH3u4tsJAjSxHbVjq420O/wJtPXXT5fj6by",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
        },
      ]);
    });
}
