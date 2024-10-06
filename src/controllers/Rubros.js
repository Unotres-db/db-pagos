const connection = require ('../database/connection');
const fns = require('date-fns')

module.exports = {

  async index (req, res, next) {
    
    try {
      console.log("entrou em index")
      const idRubro  = req.params.id;

      if ( idRubro ){
        const rubro = await connection ('rubros')
          .select(
            'id_rubro as idRubro',
            'nombre as nombreRubro',
            // 'creado as creado',
            // 'actualizado as actualizado'
          )
          .where('id_rubro',idRubro)
          .first();

        if (! idRubro) {
          return res.status(404).json({ error: 'Proyecto no fue encontrado'});
        }
        return res.status(200).json(rubro);
      } 
      const rubros = await connection ('rubros')
        .select (
          // 'id_rubro as idRubro',
          'id_rubro as id',
          // 'nombre as nombreRubro',
          'nombre as label',
          // 'creado as creado',
          // 'actualizado as actualizado'
        ).orderBy('label');
        if (! rubros) {
          return res.status(404).json({ error: 'No fueron encontrados rubros'});
        }
      return res.status(200).json(rubros);
      
    } catch (error) {
        next (error);
    }
  },


  async createBulk(req, res, next) {
    console.log("Entered createBulk");
    try {
      // Check if req.body is an array
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Invalid request body. Expected an array." });
      }
  
      // Extract elements from each object in the array
      const rubrosToInsert = req.body.map((data) => ({
        id_rubro: data.idRubro,
        nombre: data.nombre,
      }));
  
      // Insert all elements in bulk (assuming your database supports bulk inserts)
      await connection('rubros')
        .insert(rubrosToInsert);
  
      // Respond with success message
      return res.status(201).json({ message: "Rubros created successfully." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  


  async create (req, res, next) {
    console.log("entrou em create")
    try {
      const {
        idRubro,
        nombre
      } = req.body;
      console.log(idRubro)
      await connection ('rubros')
        .insert({
          id_rubro : idRubro,
          nombre : nombre
        });
      
      return res.status(200).json({nombre});
    } catch (error) {
        console.log(error)
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
      await connection ('rubros')
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

async deleteAllRecordsFromRubros(req, res, next) {
  try {
    await connection('rubros').del();
    console.log('All records deleted from rubros table');
    return res.status(200).json({message:"Rubros eliminados con exito"});
  } catch (error) {
    console.error('Error deleting records:', error);
  }
}

}
