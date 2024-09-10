const connection = require('../database/connection');
const { format } = require('date-fns');
const bcrypt = require('bcrypt');
const { createTokens, validateToken } = require('./../JWT')
let passwordMatch=false

module.exports = {

  async index (req, res, next) {
    console.log("entro en index")
    try {
      const id  =  req.id //req.query;

      console.log("Session controller index, req.id: " + id)
      if (id) {
        const user = await connection('users')
        .where('users.id', id)
        .select([
          'users.id as id',
          'users.password as password',
          'users.product as product',
          'users.first_name as firstName',
          'users.last_name as lastName',
          'users.birthday as birthday',
          'users.description as description',
          'users.phone as phone',
        //   connection.raw('COALESCE(countries.id, NULL) AS country'),
        //   connection.raw('COALESCE(countries.name, \'not informed\') AS "countryName" ')

        ])
        // .leftJoin('countries', 'countries.id', '=', 'users.country')
        .first();
      console.log(user);
      return res.status(200).json(user);

      } else {
        console.log("erro em user")
        return res.status(400).json({error:"No fue proveidoun nombre de usuario"});
      }

    } catch (error) {

      // console.log("passou por catch");
      next(error);
    }
  },

  async create(req, res, next) {
    // console.log("entrou em create session- nova session")
    try {
      const { id, password } = req.body;
      console.log("create session: userId: " + id)
      const user = await connection('users')
        .where('users.id', id)
        .select([
          'users.id as id',
          'users.password as password',
          'users.product as product',
          'users.first_name as firstName',
          'users.last_name as lastName',
          'users.birthday',
          'users.phone',
        //   connection.raw('COALESCE(countries.id, \'\') AS country'),
        //   connection.raw('COALESCE(countries.name, \'not informed\') AS "countryName"'),
        ])
        // .leftJoin('countries', 'countries.id', '=', 'users.country')
        .first();

      if (!user) {
        return res.status(400).json({
          error:
            "Oops! No pudimos encontrar los detalles de tu cuenta. Por favor, verifica nuevamente el correo electrónico que proporcionaste e inténtalo de nuevo.",
        });
      }
      // si password tiene hash....
      if (user.password.startsWith('$2b$')) {
        passwordMatch = await bcrypt.compare(password, user.password);
        // console.log("a password esta hasheada con bcrypt");
        if ( ! passwordMatch) {
          // console.log("a password hasheada foi verificada e recusada");
          return res.status(400).json({
            error: "Parece que la contraseña que ingresaste no es válida. Asegúrate de estar usando la contraseña correcta e intenta de nuevo. Si tienes problemas, no te preocupes, ¡estamos aquí para ayudarte en cada paso del camino!"
          });
        }
      } else { // si password NO tiene hash....
        // console.log("a password NAO esta hasheada con bcrypt");
        if (user.password !== password) { 
          // console.log("a password sem hash foi verificada e recusada");
          return res.status(400).json({
            error: "Oops! Parece que la contraseña que ingresaste no es válida. Asegúrate de estar usando la contraseña correcta e intenta de nuevo. Si tienes problemas, no te preocupes, ¡estamos aquí para ayudarte en cada paso del camino!"
          });
          // passwordMatch = true
        }
      }
      try {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          secure: true, 
          sameSite: 'None',
        });
      } catch (error){
        console.log("trying to save cookie: "+ error)
      }
      console.log(user)
      return res.status(200).json(user);
    } catch (error) {
      console.log("passou por catch: " + error);
      next(error);
    }
  },
};