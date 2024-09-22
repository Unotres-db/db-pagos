exports.up = function(knex) {
    return knex.schema.alterTable('proyectos', function (table) {
      table.float('presupuesto_usd');
      table.float('presupuesto_gs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('proyectos', function (table) {
      table.dropColumn('presupuesto_usd');
      table.dropColumn('presupuesto_gs');
    });
  };