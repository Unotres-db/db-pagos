exports.up = function(knex) {
    return knex.schema.createTable('transacciones', function (table) {
      table.string('id_transaccion').primary().unique().notNullable();
      table.string('id_proyecto').notNullable();
      table.string('id_proveedor').notNullable();
      table.string('id_rubro').notNullable();
      table.string('id_tipo_transaccion');
      table.string('descripcion');
      table.string('numero_factura');
      table.timestamp('fecha_factura');
      table.string('timbrado_factura');
      table.string('monto_factura');
      table.string('comprobante_pago');
      table.timestamp('fecha_pago');
      table.string('id_tipo_pago');  // transferencia, cheque, deposito o efectivo, 
      table.string('id_tipo_Flujo'); // ingreso=0 o egreso=1
      table.timestamp('creado').defaultTo(knex.fn.now());
      table.timestamp('actualizado').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('transacciones');
  };
