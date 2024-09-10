const connection = require ('../database/connection');
const fns = require('date-fns');
const { format, parse } = require('date-fns');
const crypto = require ('crypto');

module.exports = {

  async index (req, res, next) {
    
    try {
      console.log("entro en TestDates - index");
      const idTransaccion = req.params.id;
      console.log("idTransaccion: " + idTransaccion);
    
      if (idTransaccion) {
        const transaccion = await connection("test_dates")
          .select(
            "test_dates.id_transaccion as idTransaccion",
            "test_dates.fecha_string as FechaString",
            "test_dates.fecha_milliseconds as fechaMilliseconds",
            "test_dates.fecha_timestamp as fechaTimestamp"
          )
          .where("id_transaccion", idTransaccion);
    
        if (!transaccion) {
          return res.status(404).json({ error: "Transaccion no encontrada" });
        }
        return res.status(200).json(transaccion);
      }
    
      const todasTransacciones = await connection("test_dates")
        .select(
          "test_dates.id_transaccion as idTransaccion",
          "test_dates.fecha_string as FechaString",
          "test_dates.fecha_milliseconds as fechaMilliseconds",
          "test_dates.fecha_timestamp as fechaTimestamp"
        );
      if (!todasTransacciones) {
        return res.status(404).json({ error: "No fueron encontradas transacciones" });
      }
      return res.status(200).json(todasTransacciones);
    } catch (error) {
      next(error);
    }
  },  

  async create (req, res, next) {
    try {
      const idTransaccion = crypto.randomBytes(4).toString('HEX');
      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      const {
        fecha,
      } = req.body;
      const parsedDate = parse(fecha, 'dd/MM/yyyy', new Date());
      const formattedTimeStamp = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
      const formattedMilliseconds = parsedDate.getTime();
      console.log("fecha: "+ fecha+" formattedTimeStamp: "+formattedTimeStamp+" formattedMilliseconds: "+formattedMilliseconds)
      // const fechaString=format(parsedDate, 'dd/MM/yyyy');
      await connection ('test_dates')
        .insert({
          id_transaccion : idTransaccion,
          fecha_string: fecha,
          fecha_milliseconds:formattedMilliseconds,
          fecha_timestamp:formattedTimeStamp,
          creado : hoy,
          actualizado : hoy
        });
      
      return res.status(200).json({idTransaccion});
    } catch (error) {
        next (error);
    }
  },
 
  async delete (req, res, next) {
    try {
      const idTransaccion  = req.params.id
      console.log("Delete idTransaccion: "+ idTransaccion) 
      if ( idTransaccion ) {
        const deletion = await connection ('test_dates')
        .where('id_transaccion','=',idTransaccion)
        .del()
        if (deletion) {
          return res.status(200).json({idTransaccion});
        }
        return res.status(404).json({error:"Transaccion no encontrada"});
      } 
    } catch (error) {
        console.log(error)
        next (error);
      }
  },

}