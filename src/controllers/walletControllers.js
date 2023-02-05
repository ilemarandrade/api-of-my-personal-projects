const walletServices = require("../services/walletServices");
const AcountModel = require("../models/Acount");

const check_balance = async (req, res) => {
  const { user } = req.user;
  const { statusCode, response } = await walletServices.check_balance(user._id);
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

module.exports = {
  check_balance,
  recharge,
  pay,
};
