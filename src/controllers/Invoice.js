const connection = require ('../database/connection');

module.exports = {

  async index (req, res, next) {
    const { id_proveedor, numeroFactura } = req.query;

    try {
      const existingInvoice = await connection('transaciones')
        .where({ id_proveedor, numeroFactura })
        .count('id_transaccion as count')
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