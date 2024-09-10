const connection = require ('../database/connection');
const fns = require('date-fns')

module.exports = {

  async index (req, res, next) {
    
    try {
      const idProyecto  = req.params.id;

      if ( idProyecto ){
        const cronograma = await connection ('cronogramas')
          .select(
            'id as idCronograma',
            'id_proyecto as idProyecto',
            'moneda as moneda',
            'mes as mes',
            'monto as monto',
            'creado as creado',
            'actualizado as actualizado'
          )
          .where('id_proyecto',idProyecto)
          .first();

        if (! idProyecto) {
          return res.status(404).json({ error: 'Cronograma del proyecto no fue encontrado'});
        }
        return res.status(200).json(cronograma);
      } 
      const cronogramas = await connection ('cronogramas')
        .select (
            'id as idCronograma',
            'id_proyecto as idProyecto',
            'moneda as moneda',
            'mes as mes',
            'monto as monto',
            'creado as creado',
            'actualizado as actualizado'
        ).orderBy('id_proyecto', 'mes');
        if (! cronogramas) {
          return res.status(404).json({ error: 'No fueron encontrados cronogramas'});
        }
      return res.status(200).json(cronogramas);
      
    } catch (error) {
        next (error);
    }
  },

  async create (req, res, next) {
    try {
      const {
        idRubro,
        nombre
      } = req.body;

      await connection ('cronogramas')
        .insert({
          id_rubro : idRubro,
          nombre : nombre
        });
      
      return res.status(200).json({nombre});
    } catch (error) {
        next (error);
    }
  },

  async update (req, res, next) {
    try {
      const {  
        idRubro,
        nombre
      } = req.body;

      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      await connection ('cronogramas')
        .update({
          nombre : nombre,
          actualizado: hoy
        })
        .where ('id_rubro',idRubro);
      return res.status(200).json({nombre});
    } catch (error) {
        next (error);
    }
},
}