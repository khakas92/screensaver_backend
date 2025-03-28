/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.date("first_name").nullable().alter();
        table.date("first_name").nullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.date("first_name").notNullable().alter();
        table.date("last_name").notNullable().alter();
    });
};