const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const verifyAuthorization = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decodes token to get User ID from the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedToken.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Authorization failure.");
    }
  } else {
    res.status(401);
    throw new Error("User is not authorized. Token not found.");
  }
});

module.exports = { verifyAuthorization };
