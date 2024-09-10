exports.up = function(knex) {
    return knex.schema.createTable('rubros', function (table) {
      table.string('id_rubro').primary().unique().notNullable();
      table.string('nombre').notNullable();
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('rubros');
  };