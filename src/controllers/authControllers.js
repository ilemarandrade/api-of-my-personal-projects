const authServices = require("../services/authServices");

const login = async (req, res) => {
  const user = req.body.user;
  const { statusCode, message } = await authServices.login(user);
  res.status(statusCode).send(message);
};

const createNewUser = async (req, res) => {
  const user = req.body.user;
  const { statusCode, message } = await authServices.createUser(user);
  res.status(statusCode).send(message);
};

const updateUser = (req, res) => {
  const updatedUser = authServices.updateUser();
  res.send("");
};

module.exports = {
  login,
  createNewUser,
  updateUser,
};
