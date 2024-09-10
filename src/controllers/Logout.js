// const connection = require('../database/connection');
// const { format } = require('date-fns');
// const { createTokens, validateToken } = require("./../JWT");

module.exports = {

    async create(req, res) {
      try {
        // const { userId } = req.body;
    
        // Validate that the userId exists and matches the authenticated user
        // if (!userId || userId !== req.user.id) {
        //   return res.status(401).json({ error: 'Unauthorized' });
        // }
    
        // Clear the cookie on the client side
        // res.clearCookie('access-token');
        res.clearCookie('access-token', { sameSite: 'None', httpOnly: true, secure: true });
        // console.log("Token eliminado:")
        // Optionally, you can perform additional cleanup or logging out logic on the server side
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        // console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }