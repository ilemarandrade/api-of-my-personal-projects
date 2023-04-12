const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const user = req.body.user;
  const { statusCode, response } = await authServices.login(user);

  res.status(statusCode).send(response);
};

const user_Information = async (req, res) => {
  try {
    const token = req.token;
    const verified = jwt.verify(token, process.env.SECRET_JWT);

    res.status(200).send(verified);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid token!" });
  }
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
  user_Information,
};
