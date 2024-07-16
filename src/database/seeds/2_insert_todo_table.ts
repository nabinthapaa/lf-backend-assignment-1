import { Knex } from "knex";

const TABLE_NAME = "todos";

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
          id: "748b65af-87fe-410d-8a36-e57b90069086",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
          task: "Get task done",
          is_completed: false,
          completed_at: null,
        },
        {
          id: "ea90ebef-b54a-4b74-a9d3-b8fabe01e377",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
          task: "Get task done",
          is_completed: false,
          completed_at: null,
        },
        {
          id: "eb86a4b3-a216-427a-aae2-43463c913285",
          created_by: "f482cc93-547b-4dc2-b1c0-83d18ee6b6e6",
          task: "Get task done",
          is_completed: false,
          completed_at: null,
        },
        {
          id: "48661c9c-436d-4e20-aad7-fbfeb9e0434e",
          created_by: "f482cc93-547b-4dc2-b1c0-83d18ee6b6e6",
          task: "Get task done",
          is_completed: false,
          completed_at: null,
        },
        {
          id: "2cf19b8e-9eac-4eee-b1ba-8d33303ab52a",
          created_by: "9a92e437-c86b-49f1-99d3-55c59331c61d",
          task: "Get task done",
          is_completed: false,
          completed_at: null,
        },
      ]);
    });
}
