const connection = require ('../database/connection');
const fns = require('date-fns');
const bcrypt = require('bcrypt');

module.exports = {

  async create (req, res, next) {
    // console.log("Entrou em ChangePasswordController")
    try {
      const {
        id,
        password
      } = req.body;
      const updateDate = fns.format(new Date(),'yyyy-MM-dd HH:mm:ss')
      // console.log("ChangePasswordController: " + id + password)
      if ( id ) {
        const user = await connection ('users').select('*').where('id',id).first();
        if ( user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const result = await connection ('users')
          .update({ password:hashedPassword, updated_at:updateDate})
          .where ('id',id);
          //refactorar?
          if (result === 1) { 
            return res.status(200).json({id});
          } else {
            return res.status(404).json({ error: "Error in update" });
          }
        } else {
          return res.status(404).json({error:"User was not found"});
        }
      } 
    } catch (error) {
        next (error);
      }
  },
}