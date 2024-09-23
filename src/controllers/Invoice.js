const connection = require ('../database/connection');

module.exports = {

  async index (req, res, next) {
    const { id_proveedor, numero_factura } = req.query;

    try {
      const existingInvoice = await connection('transacciones')
        .where({ id_proveedor, numero_factura })
        .first();

      if (existingInvoice.count > 0) {
        res.status(404).json({ message: 'Factura ya fue cargada en la base de datos' });
      } else {
        res.status(200).json({existingInvoice});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor.' });
    }
  }

}