exports.up = function(knex) {
    return knex.schema.createTable('proveedores', function (table) {
      table.string('id_proveedor').primary().unique().notNullable();
      table.string('nombre').notNullable();
      table.string('razon_social');
      table.string('ruc');
      table.string('direccion');
      table.string('contacto');
      table.string('telefono');
      table.string('email');
      table.string('web');
      table.string('id_rubro');
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('proveedores');
  };