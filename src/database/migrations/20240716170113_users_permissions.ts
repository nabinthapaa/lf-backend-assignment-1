import { Knex } from "knex";

const TABLE_NAME = "user_permisions";

/**

 * Create table TABLE_NAME.

 *

 * @param   {Knex} knex

 * @returns {Promise}

 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .bigInteger("permissions")
      .references("id")
      .inTable("permissions")
      .notNullable();
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
