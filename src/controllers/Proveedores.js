const connection = require ('../database/connection');
const fns = require('date-fns')

module.exports = {

  async index (req, res, next) {
    try {

      const idProveedor  = req.params.id;

      if ( idProveedor ){
        const proveedor = await connection ('proveedores')
          .select(
            'id_proveedor as idProveedor',
            'nombre as nombre',
            'razon_social as razonSocial',
            'ruc as ruc',
            'direccion as direccion',
            'contacto as contacto',
            'telefono as telefono',
            'email as email',
            'web as web',
            'id_rubro as idRubro',
            'creado as creado',
            'actualizado as actualizado'
          )
          .where('id_proveedor',idProveedor)
          .first();

        if (! proveedor) {
          return res.status(404).json({ error: 'Proveedor no fue encontrado'});
        }
        return res.status(200).json(proveedor);
      } 
      const proveedores = await connection ('proveedores')
        .select (
          // 'id_proveedor as idProveedor',
          // 'nombre as nombre',
          'id_proveedor as id',
          'nombre as label',
          'razon_social as razonSocial',
          'ruc as ruc',
          'direccion as direccion',
          'contacto as contacto',
          'telefono as telefono',
          'email as email',
          'web as web',
          'id_rubro as idRubro',
          'creado as creado',
          'actualizado as actualizado'
        ).orderBy('nombre');
      if (! proveedores) {
        return res.status(404).json({ error: 'No fueron encontrados proveedores'});
      }
      return res.status(200).json(proveedores);
      
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
        id_proveedor: data.idProveedor,
        nombre: data.nombre,
        razon_social:data.razonSocial,
        ruc:data.ruc,
        direccion: data.direccion,
        contacto:data.contacto,
        telefono:data.telefono,
        email: data.email,
        web: data.web,
        id_rubro: data.idRubro
      }));
  
      // Insert all elements in bulk (assuming your database supports bulk inserts)
      await connection('proveedores')
        .insert(rubrosToInsert);
  
      // Respond with success message
      return res.status(201).json({ message: "Rubros created successfully." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async create (req, res, next) {
    try {
      console.log("entrou em create-proveedor")
      const {
        idProveedor,
        nombre,
        razonSocial,
        ruc,
        direccion,
        contacto,
        telefono,
        email,
        web,
        idRubro
      } = req.body;
      console.log(idProveedor,nombre)
      await connection ('proveedores')
        .insert({
          id_proveedor : idProveedor,
          nombre : nombre,
          razon_social : razonSocial,
          ruc : ruc,
          direccion : direccion,
          contacto : contacto,
          telefono : telefono,
          email : email,
          web : web,
          id_rubro : idRubro
        });
      console.log("incluiu proveedor")
      return res.status(200).json({nombre});
    } catch (error) {
      console.log(error)
        next (error);
    }
  },

  async update (req, res, next) {
    try {
      const { 
        nombre,
        razonSocial,
        ruc,
        direccion,
        contacto,
        telefono,
        email,
        web,
        idRubro
      } = req.body;

      const hoy = fns.format(new Date(),"yyyy-MM-dd HH:mm:ss");
      await connection ('proveedores')
        .update({
          nombre : nombre,
          razon_social : razonSocial,
          ruc : ruc,
          direccion : direccion,
          contacto : contacto,
          telefono : telefono,
          email : email,
          web : web,
          id_rubro : idRubro,
          actualizado: hoy
        })
        .where ('id_proveedor',idProveedor);
      return res.status(200).json({nombre});
    } catch (error) {
        next (error);
    }
},

async delete (req, res, next) {
  try {
    const idProveedor  = req.params.id
    console.log("Deletion Proveedor: "+ idProveedor) 
    if ( idProveedor ) {
      const deletion = await connection ('proveedores')
      .where('id_proveedor','=',idProveedor)
      .del()
      if (deletion) {
        console.log("Proveedor eliminado con exito")
        return res.status(200).json({idProveedor});
      }
      console.log("Proveedor no encontrado")
      return res.status(404).json({error:"Proveedor no encontrado"});
    } 
  } catch (error) {
      console.log("error en eliminacion de Proveedor: " + error)
      next (error);
    }
},

}

