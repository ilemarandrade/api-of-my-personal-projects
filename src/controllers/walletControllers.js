const walletServices = require("../services/walletServices");
const AccountModel = require("../models/Account");

const check_balance = async (req, res) => {
  const { user } = req.user;
  const { statusCode, response } = await walletServices.check_balance(user._id);
  return res.status(statusCode).send(response);
};

const movements = async (req, res) => {
  const { user } = req.user;
  const { statusCode, response } = await walletServices.movements(user._id);
  return res.status(statusCode).send(response);
};

const recharge = async (req, res) => {
  const data = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.recharge(
    user._id,
    data
  );
  return res.status(statusCode).send(response);
};

const pay = async (req, res) => {
  const payData = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.pay(user._id, payData);
  return res.status(statusCode).send(response);
};

const delete_movement = async (req, res) => {
  const deleteMovementData = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.delete_movement(
    user._id,
    deleteMovementData
  );
  return res.status(statusCode).send(response);
};

module.exports = {
  check_balance,
  recharge,
  pay,
  movements,
  delete_movement,
};
