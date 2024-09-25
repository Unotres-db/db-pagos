const connection = require ('../database/connection');

module.exports = {

  async index (req, res, next) {
    const { id_proveedor, numero_factura } = req.query;
    console.log("id_proveedor: " + id_proveedor + " numero_factura " + numero_factura)

    try {
      const existingInvoice = await connection('transacciones')
        .where({ id_proveedor, numero_factura })
        .first();
      console.log(existingInvoice);
      if (! existingInvoice ) {
        console.log("No encontro la factura")
        res.status(200).json({existingInvoice});
      } else {
        console.log("Encontro la factura")

        res.status(404).json({existingInvoice});
        // res.status(200).json({ message: 'Factura ya fue cargada en la base de datos' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor.' });
    }
  }

}