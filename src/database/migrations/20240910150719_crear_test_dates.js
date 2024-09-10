exports.up = function(knex) {
    return knex.schema.createTable('test_dates', function (table) {
      table.string('id_transaccion').primary().unique().notNullable();
      table.string('fecha_string');
      table.string('fecha_milliseconds');
      table.timestamp('fecha_timestamp');
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('test_dates');
  };