/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
        table.string('username').unique().notNullable();
        table.date("birth_date").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('username');
        table.dropColumn("birth_date"); 
    });
};
