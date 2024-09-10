exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
      table.string('id').primary().unique().notNullable();
      table.string('password').notNullable();
      table.string('product').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name');
      table.string('phone');
      table.string('birthday');
      table.string('occupation');
      table.string('company');
      table.string('email');
      table.string('country');
      table.string('city');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };