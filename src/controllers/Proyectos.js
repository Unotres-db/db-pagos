const connection = require ('../database/connection');
const fns = require('date-fns')

module.exports = {

  async index (req, res, next) {
    
    try {
      const idProyecto  = req.params.id;

      if ( idProyecto ){
        const proyecto = await connection ('proyectos')
          .select(
            'id_proyecto as idProyecto',
            'nombre as nombre',
            'descripcion as descripcion',
            'metros_cuadrados as metros_cuadrados',
            'margen_estimado as margen_estimado',
            'creado as creado',
            'actualizado as actualizado'
          )
          .where('id_proyecto',idProyecto)
          .first();

        if (! idProyecto) {
          return res.status(404).json({ error: 'Proyecto no fue encontrado'});
        }
        return res.status(200).json(proyecto);
      } 
      const proyectos = await connection ('proyectos')
        .select (
          'id_proyecto as idProyecto',
          'nombre as nombre',
          'descripcion as descripcion',
          'metros_cuadrados as metros_cuadrados',
          'margen_estimado as margen_estimado',
          'creado as creado',
          'actualizado as actualizado'

        ).orderBy('nombre');
        if (! proyectos) {
          return res.status(404).json({ error: 'No fueron encontrados proyectos'});
        }
      return res.status(200).json(proyectos);
      
    } catch (error) {
        next (error);
    }
  },

  async createBulk(req, res, next) {
    console.log("Entered createBulk Proyectos");
    try {
      // Check if req.body is an array
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Requisicion Invalida. Se espera un vector" });
      }
  
      // Extract elements from each object in the array
      const proyectoAInsertar = req.body.map((data) => ({
        id_proyecto: data.idProyecto,
        nombre: data.nombre,
        descripcion:data.descripcion,
        metros_cuadrados:data.metrosCuadrados,
        margen_estimado: data.margenEstimado,

      }));
  
      // Insert all elements in bulk (assuming your database supports bulk inserts)
      await connection('proyectos')
        .insert(proyectoAInsertar);
  
      // Respond with success message
      return res.status(201).json({ message: "Proyectos creados con exito" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async create (req, res, next) {
    try {
      const {
        idProyecto,
        nombre,
        descripcion,
        metros_cuadrados,
        margen_estimado,
      } = req.body;

      await connection ('proyectos')
        .insert({
          id_proyecto : idProyecto,
          nombre : nombre,
          descripcion : descripcion,
          metros_cuadrados : metros_cuadrados,
          margen_estimado : margen_estimado,
        });
      
      return res.status(200).json({nombre});
    } catch (error) {
        next (error);
    }
  },

  async update (req, res, next) {
    try {
      const { 
        nombre,
        descripcion,
        metros_cuadrados,
        margen_estimado,
      } = req.body;

      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      await connection ('proyectos')
        .update({
          nombre : nombre,
          descripcion : descripcion,
          metros_cuadrados : metros_cuadrados,
          margen_estimado : margen_estimado,
          actualizado: hoy
        })
        .where ('id_proyecto',idProyecto);
      return res.status(200).json({nombre});
    } catch (error) {
        next (error);
    }
},
}