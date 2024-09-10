exports.up = function(knex) {
    return knex.schema.createTable('proyectos', function (table) {
      table.string('id_proyecto').primary().unique().notNullable();
      table.string('nombre').notNullable();
      table.string('descripcion');
      table.bigint('metros_cuadrados');
      table.float('margen_estimado');
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('proyectos');
  };