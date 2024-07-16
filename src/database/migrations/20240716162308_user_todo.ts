import { Knex } from "knex";

const TABLE_NAME = "todos";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id").primary();
    table.string("task").notNullable();
    table.boolean("is_completed").notNullable();
    table.timestamp("completed_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.uuid("created_by").notNullable().references("id").inTable("users");
    table.timestamp("updated_at").nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
