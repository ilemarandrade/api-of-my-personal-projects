const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { lang } = req.headers.lang;
  const user = req.body.user;
  const { statusCode, response } = await authServices.login({ user, lang });

  res.status(statusCode).send(response);
};

const user_Information = async (req, res) => {
  const { lang } = req.headers.lang;
  const { t } = handleTraductions(lang);

  try {
    const token = req.token;
    const verified = jwt.verify(token, process.env.SECRET_JWT);

    res.status(200).send(verified);
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .send({ message: t("message.user_information.invalid_token") });
  }
};

const createNewUser = async (req, res) => {
  const { lang } = req.headers.lang;
  const user = req.body.user;
  const { statusCode, message } = await authServices.createUser({ user, lang });

  res.status(statusCode).send(message);
};

const updateUser = async (req, res) => {
  const { lang } = req.headers.lang;
  const { user: prevUserData } = req.user; // data save from midleware that verify token
  const dataToUpdateUser = req.body.user;
  const { statusCode, response } = await authServices.updateUser({
    langCurrent: lang,
    prevUserData,
    dataToUpdateUser,
  });

  res.status(statusCode).send(response);
};

module.exports = {
  login,
  createNewUser,
  updateUser,
  user_Information,
};
