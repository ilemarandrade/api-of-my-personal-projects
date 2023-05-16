const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");
const handleTraductions = require("../utils/handleTraductions");

const login = async (req, res) => {
  const { lang } = req.headers;
  const user = req.body.user;
  const { statusCode, response } = await authServices.login({ user, lang });

  res.status(statusCode).send(response);
};

const user_Information = async (req, res) => {
  const { lang } = req.headers;
  const { t } = handleTraductions(lang);

  try {
    const token = req.token;
    const verified = jwt.verify(token, process.env.SECRET_JWT);

    res.status(200).send(verified);
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: t("message.authorization_incorrect") });
  }
};

const createNewUser = async (req, res) => {
  const { lang } = req.headers;
  const user = req.body.user;

  const { statusCode, response } = await authServices.createUser({
    user,
    lang,
  });

  res.status(statusCode).send(response);
};

const updateUser = async (req, res) => {
  const { lang } = req.headers;
  const { user: prevUserData } = req.user; // data save from midleware that verify token
  const dataToUpdateUser = req.body.user;

  const { statusCode, response } = await authServices.updateUser({
    langCurrent: lang,
    prevUserData,
    dataToUpdateUser,
  });

  res.status(statusCode).send(response);
};

const forgotPassword = async (req, res) => {
  const { lang } = req.headers;
  const { email } = req.body;
  const { statusCode, response } = await authServices.forgotPassword({
    lang,
    email,
  });

  res.status(statusCode).send(response);
};

const newPassword = async (req, res) => {
  const { lang } = req.headers;
  const { password, confirmation_password, token } = req.body;
  const { statusCode, response } = await authServices.newPassword({
    lang,
    password,
    confirmation_password,
    token,
  });

  res.status(statusCode).send(response);
};

module.exports = {
  login,
  createNewUser,
  updateUser,
  user_Information,
  forgotPassword,
  newPassword,
};
