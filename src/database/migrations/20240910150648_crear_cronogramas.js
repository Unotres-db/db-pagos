exports.up = function(knex) {
    return knex.schema.createTable('cronogramas', function (table) {
      table.string('id').primary().unique().notNullable();
      table.string('id_proyecto').notNullable();
      table.string('moneda').notNullable();
      table.string('mes').notNullable();
      table.float('monto');
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('cronogramas');
  };
