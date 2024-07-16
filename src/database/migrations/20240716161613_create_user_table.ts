import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique().index();
    table.string("password").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.uuid("created_by").notNullable().references("id").inTable(TABLE_NAME);
    table.timestamp("updated_at").nullable();
    table
      .uuid("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
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
