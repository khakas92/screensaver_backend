/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("subscriptions", function(table) {
      table.increments('id').primary();;
      table.integer("subscriber_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.integer("target_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.unique(["subscriber_id", "target_id"]);
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("subscriptions");
};
