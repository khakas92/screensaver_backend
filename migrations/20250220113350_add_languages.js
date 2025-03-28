/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('languages', (table) => {
      table.increments('id').primary();
      table.string('code', 5).unique().notNullable();
      table.string('name').notNullable();
    });
  
    await knex.schema.alterTable('users', (table) => {
      table.integer('language_id').unsigned().references('id').inTable('languages').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('languages');
};
