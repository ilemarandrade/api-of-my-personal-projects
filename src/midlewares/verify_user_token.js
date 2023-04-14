const jwt = require("jsonwebtoken");
const handleTraductions = require("../utils/handleTraductions");

const verifyUserToken = async (req, res, next) => {
  const { lang } = req.headers;
  const { t } = handleTraductions(lang);

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
      res.status(401).send({ message: t("message.authorization_incorrect") });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: t("message.error_unexpected") });
  }
};

module.exports = {
  verifyUserToken,
};
