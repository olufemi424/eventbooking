const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  //check for header
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  //Authorization:Bearer token
  const token = authHeader.split(" ")[1];
  //check for token
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  //veryfy token
  let decodedToekn;
  try {
    decodedToekn = jwt.verify(token, "somesupersecretkey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  //check for decoded token
  if (!decodedToekn) {
    req.isAuth = false;
    return next();
  }

  //forward the decoded information
  req.isAuth = true;
  req.userId = decodedToekn.userId;
  next();
};
