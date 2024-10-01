const connection = require ('../database/connection');
const fns = require('date-fns');
const { format, parse } = require('date-fns');
const crypto = require ('crypto');

function convertToFormattedTimestamp(milliseconds) {
  if (milliseconds===""){
    return ""
  }
  const date = new Date(milliseconds);
  const formattedTimeStamp = format(date, 'yyyy-MM-dd HH:mm:ss');
  return formattedTimeStamp;
}

function convertToFormattedTime(dateString) {
  if (dateString===""){
    return null
  }
  const date = new Date(dateString);
  const formattedTime = format(date, 'yyyy-MM-dd HH:mm:ss');
  return formattedTime;
}

module.exports = {

  async index (req, res, next) {
    try {
      // console.log("entro en transacciones - index");
      const idProyecto = req.params.id;
      // const idTransaccion=req.params.id;
      // console.log("idProyecto: " + idProyecto);
    
      if (idProyecto) {
      // if (idTransaccion) {  
        const transaccionesProyecto = await connection("transacciones")
          .select(
            "transacciones.id_transaccion as idTransaccion",
            "transacciones.id_proyecto as idProyecto",
            // "transacciones.id_proveedor as idProveedor",
            // "transacciones.id_rubro as idRubro",
            "transacciones.id_tipo_transaccion as idTipoTransaccion",
            "transacciones.descripcion as descripcion",
            "transacciones.numero_factura as numeroFactura",
            // "transacciones.fecha_factura as fechaFactura",
           connection.raw(`to_char(transacciones.fecha_factura, 'DD/MM/YYYY') as fechaFactura`),
            "transacciones.timbrado_factura as timbradoFactura",
            "transacciones.monto_factura as montoFactura",
            "transacciones.comprobante_pago as comprobantePago",
            // "transacciones.fecha_pago as fechaPago",
           connection.raw(`to_char(transacciones.fecha_pago, 'DD/MM/YYYY') as fechaPago`),
            "transacciones.id_tipo_pago as idTipoPago",
            "transacciones.id_tipo_Flujo as idTipoFlujo",
            "transacciones.creado as creado",
            "transacciones.actualizado as actualizado",
            "rubros.id_rubro as idRubro",
            "rubros.nombre as rubro",
            "proveedores.id_proveedor as idProveedor",
            "proveedores.nombre as proveedor",
          )
          .where("id_proyecto", idProyecto)
          // .where("id_transaccion", idTransaccion)
          .orderBy("transacciones.fecha_factura", 'desc') // Specify transacciones.id_proveedor
          .join("rubros", "rubros.id_rubro", "=", "transacciones.id_rubro")
          .join("proveedores", "proveedores.id_proveedor", "=", "transacciones.id_proveedor");
    
        if (!transaccionesProyecto) {
          return res.status(404).json({ error: "Transacciones de este Proyecto no fueron encontradas" });
        }
        console.log("enviando os dados")
        // console.log(transaccionesProyecto)
        return res.status(200).json(transaccionesProyecto);
      }
    
      const todasTransacciones = await connection("transacciones")
        .select(
          "transacciones.id_transaccion as idTransaccion",
          "transacciones.id_proyecto as idProyecto",
          // "transacciones.id_proveedor as idProveedor",
          "transacciones.id_rubro as idRubro",
          // "transacciones.id_rubro as id",
          "transacciones.id_tipo_transaccion as idTipoTransaccion",
          "transacciones.descripcion as descripcion",
          "transacciones.numero_factura as numeroFactura",
          // "transacciones.fecha_factura as fechaFactura",
          connection.raw(`to_char(transacciones.fecha_factura, 'DD/MM/YYYY') as fechaFactura`),
          "transacciones.timbrado_factura as timbradoFactura",
          "transacciones.monto_factura as montoFactura",
          "transacciones.comprobante_pago as comprobantePago",
          // "transacciones.fecha_pago as fechaPago",
          connection.raw(`to_char(transacciones.fecha_pago, 'DD/MM/YYYY') as fechaPago`),
          "transacciones.id_tipo_pago as idTipoPago",
          "transacciones.id_tipo_Flujo as idTipoFlujo",
          "transacciones.creado as creado",
          "transacciones.actualizado as actualizado",
          "rubros.id_rubro as idRubro",
          "rubros.nombre as rubro",
          // "rubros.nombre as label",""
          "proveedores.id_proveedor as idProveedor",
          "proveedores.nombre as proveedor"
        )
        .orderBy("transacciones.fecha_factura", 'desc') // Specify transacciones.id_proyecto and transacciones.fecha_factura
        .join("rubros", "rubros.id_rubro", "=", "transacciones.id_rubro")
        .join("proveedores", "proveedores.id_proveedor", "=", "transacciones.id_proveedor");
    
      if (!todasTransacciones) {
        return res.status(404).json({ error: "No fueron encontrados transacciones" });
      }
      return res.status(200).json(todasTransacciones);
    } catch (error) {
      next(error);
    }
  },  

// "transacciones.id_proyecto", 

  async createBulk(req, res, next) {
    console.log("Entered createBulk Transacciones");
    try {

      // const { vdbData } = require('./vdb'); 
      const { tkdData } = require('./3kd'); // Assuming vdb.js is in the same directory

      // Check if vdbData is an array
      if (!Array.isArray(tkdData)) {
        return res.status(400).json({ error: "Data Invalida. Se espera un vector" });
      }
  
      const hoy = fns.format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const transaccionAInsertar = tkdData.map((data) => ({
        id_transaccion: crypto.randomBytes(4).toString('HEX'),
        id_proyecto: data.idProyecto,
        id_proveedor: data.idProveedor,
        id_rubro: data.idRubro,
        id_tipo_transaccion: data.idTipoTransaccion,
        descripcion: data.descripcion,
        numero_factura: data.numeroFactura,
        fecha_factura: data.fechaFactura? convertToFormattedTimestamp(data.fechaFactura):null,
        // fecha_factura: data.fechaFactura),
        // convertToFormattedTime
        timbrado_factura: data.timbradoFactura,
        monto_factura: data.montoFactura,
        comprobante_pago: data.comprobantePago,
        // fecha_pago: convertToFormattedTimestamp(data.fechaPago),
        fecha_pago: data.fechaPago? convertToFormattedTime(data.fechaPago): null,
        id_tipo_pago: data.idTipoPago,
        id_tipo_Flujo: data.idTipoFlujo,
        creado: hoy,
        actualizado: hoy
      }));
 
      await connection('transacciones')
        .insert(transaccionAInsertar);
  
      return res.status(201).json({ message: "Transacciones creadas con exito" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async create (req, res, next) {
    try {
      const idTransaccion = crypto.randomBytes(4).toString('HEX');
      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      const {
        idProyecto,
        idProveedor,
        idRubro,
        idTipoTransaccion,
        descripcion,
        numeroFactura,
        fechaFactura,
        timbradoFactura,
        montoFactura,
        comprobantePago,
        fechaPago,
        idTipoPago,
        idTipoFlujo,
      } = req.body;
      // console.log("fechaFactura: "+fechaFactura)
      // console.log("fechaPago: "+fechaPago)
      const parsedDateInvoice = fechaFactura? parse(fechaFactura, 'dd/MM/yyyy', new Date()):null;
      // const invoiceDateMilliseconds = parsedDateInvoice.getTime();
      const invoiceDateTimeStamp = fechaFactura? format(parsedDateInvoice, 'yyyy-MM-dd HH:mm:ss'):null;
      const parsedDatePayment = fechaPago? parse(fechaPago, 'dd/MM/yyyy', new Date()):null;
      // const paymentDateMilliseconds = parsedDatePayment.getTime();
      const paymentDateTimeStamp =  fechaPago? format(parsedDatePayment, 'yyyy-MM-dd HH:mm:ss'):null;
      // console.log("invoiceDateMilliseconds: " + invoiceDateMilliseconds)
      // console.log("paymentDateMilliseconds: " + paymentDateMilliseconds)

      await connection ('transacciones')
        .insert({
          id_transaccion : idTransaccion,
          id_proyecto : idProyecto,
          id_proveedor : idProveedor,
          id_rubro : idRubro,
          id_tipo_transaccion : idTipoTransaccion,
          descripcion : descripcion,
          numero_factura : numeroFactura,
          fecha_factura : invoiceDateTimeStamp,
          timbrado_factura : timbradoFactura,
          monto_factura : montoFactura,
          comprobante_pago : comprobantePago,
          fecha_pago : paymentDateTimeStamp,
          id_tipo_pago : idTipoPago,
          id_tipo_Flujo : idTipoFlujo,
          creado : hoy,
          actualizado : hoy
        });
      console.log(idTransaccion);
      return res.status(200).json({idTransaccion});
    } catch (error) {
      console.log(error)
        next (error);
    }
  },

  async update (req, res, next) {
    try {
      console.log("Entro en update")
      const {  
        idTransaccion,
        idProyecto,
        idProveedor,
        idRubro,
        idTipoTransaccion,
        descripcion,
        numeroFactura,
        fechaFactura,
        timbradoFactura,
        montoFactura,
        comprobantePago,
        fechaPago,
        idTipoPago,
        idTipoFlujo,

      } = req.body;
      console.log("req body: " + idTransaccion)
      const parsedDateInvoice = fechaFactura? parse(fechaFactura, 'dd/MM/yyyy', new Date()):null;
      const invoiceDateTimeStamp = fechaFactura? format(parsedDateInvoice, 'yyyy-MM-dd HH:mm:ss'):null;
      const parsedDatePayment = fechaPago? parse(fechaPago, 'dd/MM/yyyy', new Date()):null;
      const paymentDateTimeStamp =  fechaPago? format(parsedDatePayment, 'yyyy-MM-dd HH:mm:ss'):null;
      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      await connection ('transacciones')
        .update({
          id_proyecto : idProyecto,
          id_proveedor : idProveedor,
          id_rubro : idRubro,
          id_tipo_transaccion : idTipoTransaccion,
          descripcion : descripcion,
          numero_factura : numeroFactura,
          fecha_factura : invoiceDateTimeStamp,
          timbrado_factura : timbradoFactura,
          monto_factura : montoFactura,
          comprobante_pago : comprobantePago,
          fecha_pago : paymentDateTimeStamp,
          id_tipo_pago : idTipoPago,
          id_tipo_Flujo : idTipoFlujo,
          actualizado : hoy
        })
        .where ('id_transaccion',idTransaccion);//
      console.log(idTransaccion +"  fue alterado")  
      return res.status(200).json({idTransaccion});
    } catch (error) {
      console.log(error)
        next (error);
    }
},

async delete (req, res, next) {
  try {
    const idTransaccion  = req.params.id
    console.log("Deletion idTransaccion: "+ idTransaccion) 
    if ( idTransaccion ) {
      const deletion = await connection ('transacciones')
      .where('id_transaccion','=',idTransaccion)
      .del()
      if (deletion) {
        console.log("transaccion eliminada con exito")
        return res.status(200).json({idTransaccion});
      }
      console.log("Transaccion no encontrada")
      return res.status(404).json({error:"Transaccion no encontrada"});
    } 
  } catch (error) {
      console.log("error en eliminacion de transaccion: " + error)
      next (error);
    }
},

async deleteAllRecordsFromTransacciones(req, res, next) {
  try {
    await connection('transacciones').del();
    console.log('All records deleted from transacciones table.');
  } catch (error) {
    console.error('Error deleting records:', error);
  }
}

}