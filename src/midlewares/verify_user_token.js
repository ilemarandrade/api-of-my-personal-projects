const jwt = require("jsonwebtoken");

const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const verified = jwt.verify(token, process.env.SECRET_JWT);
    if (verified) {
      req.user = verified;
      req.token = token;
      next();
    } else {
      res.status(401).send({ message: "Invalid token !" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Invalid token !" });
  }
};

module.exports = {
  verifyUserToken,
};
