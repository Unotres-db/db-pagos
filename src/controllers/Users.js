const connection = require ('../database/connection');
const fns = require('date-fns');
const bcrypt = require('bcrypt');

const convertKeysToSnakeCase = (obj) => {
  const snakeCaseObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeCaseObj[snakeCaseKey] = obj[key] === '' ? null : obj[key];
    }
  }
  return snakeCaseObj;
}

module.exports = {

  async index (req, res, next) {
    try {
      const id  = req.params.id;
      if ( id ){
        const user = await connection ('users').select(
          'id as id',
          'product as product',
          'first_name as firstName',
          'last_name as lastName',
          'phone as phone',
          'birthday as birthday',
          'occupation as occupation',
          'company as  company',
          'email as email',
          'country as country',
          'city as city',
          'created_at as createdAt',
          'updated_at as updatedAt'
        ).where('id',id).first();
        if (! user) {
          return res.status(404).json({ error: 'User was not found'});
        }
        return res.status(200).json(user);
      } 
      
      const allUsers = await connection ('users')
        .select (
          'id as id',
          'product as product',
          'first_name as firstName',
          'last_name as lastName',
          'phone as phone',
          'birthday as birthday',
          'occupation as occupation',
          'company as  company',
          'email as email',
          'country as country',
          'city as city',
          'created_at as createdAt',
          'updated_at as updatedAt'
        )
        .orderBy('created_at', 'desc');
      if (! allUsers) {
        return res.status(404).json({ error: 'Users were not found'});
      }
      return res.status(200).json(allUsers);
      
    } catch (error) {
        next (error);
    }
  },

  async create (req, res, next) {
    console.log("entro en create user")
    try {
      const {
        id,
        password,
        product,
        firstName,
        lastName,
        phone,
        birthday,
        occupation,
        company,
        email,
        country,
        city,
      } = req.body;
      console.log(req.body)

      if ( id ){
        const user = await connection ('users').select('*').where('id',id).first();
        if ( user) {
          return res.status(409).json({ error: 'This user is already registered'});
        }
      } 
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      await connection ('users').insert({
        id: id,
        password: hashedPassword,
        product: product,
        first_name:firstName,
        last_name:lastName,
        phone:phone,
        birthday: birthday,
        occupation: occupation,
        company: company,
        email:email,
        country:country,
        city:city,
      });
      return res.json({id});
    } catch (error) {
        next (error);
      }
  },

  // rever como fazer com snake_case x camel_case, somente os campos que foram mofificados
  async update (req, res, next) {
    // console.log("entrou em update user");
    const updateDate = fns.format(new Date(),'yyyy-MM-dd HH:mm:ss')
    try {
      console.log(req.body);
      const { id,...updatedFields } = req.body;
      const snakeCaseData =convertKeysToSnakeCase( updatedFields);
      const updatedData = {...snakeCaseData, updated_at:updateDate};
      console.log(updatedData)
      const result = await connection ('users')
        .update(updatedData)
        .where ('id',id);
      if (result === 1) {
        console.log("success")
        // Successfully updated one record
        return res.status(200).json(updatedData);
      } else {
        // console.log("some error")
        // No record was updated, handle this scenario as needed
        console.log("Error in update")
        return res.status(404).json({ error: "Error in update" });
      }
    } catch (error) {
        console.log("catch error: " + error)
        next (error);
      }
  },

  async delete (req, res, next) {
    try {
      const id = req.params.id;
      console.log("deleting user: " + id)
      // const userId = request.headers.authorization;
      if ( id ) {
        const deletion = await connection ('users')
        .where('users.id','=',id)
        .del()
        if (deletion) {
          console.log("Usuario borrado con exito de la base de datos")
          return res.status(200).json({id});
        }
        console.log("user not deleted")
        return res.status(404).json({error:"Usuario no encontrado"});
      } 
    } catch (error) {
        next (error);
      }
  }
}