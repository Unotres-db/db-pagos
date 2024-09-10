const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const { id } = user;
  const accessToken = sign(
    { userId: id },
    "jwtsecretplschange"
  );
  // console.log("Nuevo Token generado: " +accessToken);
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  
  if (!accessToken) {
    // console.log("validateToken: token not found");
    return res.status(400).json({ error: "Usuario no autenticado" });
  } else {
    try {
      const validToken = verify(accessToken, "jwtsecretplschange");

      if (validToken) {
        const userId = validToken.userId;
        console.log("validateToken: user authenticated with userId", userId);
        // You can use the userId as needed, for example, store it in the request object
        req.id = userId;
        // console.log("req.id: ", req.id);
        req.authenticated = true;
        return next();
      } else {
        console.log("validateToken: incorrect token");
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
};

module.exports = { createTokens, validateToken };