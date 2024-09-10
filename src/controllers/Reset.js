const connection = require ('../database/connection');
var nodemailer = require('nodemailer');

module.exports = {

  async create (req, res, next) {
    try {
      const { userId, code } = req.body;
      console.log("reset controller:" + userId + " code: "+code)
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'valuationshub@gmail.com',
          pass: 'pknq ohvl qurg ejwl'
        }
      });
      
      var mailOptions = {
        from: 'valuationshub@gmail.com',
        to: "martincsl@hotmail.com",
        subject: 'Su codigo para resetear su contrasena de Unotres',
        text: code
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          // console.log(error);
          return res.status(400).json({userId});
        } else {
          // console.log('Email sent: ' + info.response);
          return res.status(200).json({code});
        }
      });
    } catch (error) {
        next (error);
      }
  },
}