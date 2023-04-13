const walletServices = require("../services/walletServices");

const check_balance = async (req, res) => {
  const { lang } = req.headers.lang;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.check_balance({
    user_id: user._id,
    lang,
  });

  return res.status(statusCode).send(response);
};

const movements = async (req, res) => {
  const { lang } = req.headers.lang;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.movements({
    user_id: user._id,
    lang,
  });

  return res.status(statusCode).send(response);
};

const recharge = async (req, res) => {
  const { lang } = req.headers.lang;
  const payload = req.body;
  const { user } = req.user;

  const { statusCode, response } = await walletServices.recharge({
    user_id: user._id,
    payload,
    lang,
  });

  return res.status(statusCode).send(response);
};

const pay = async (req, res) => {
  const { lang } = req.headers.lang;
  const payload = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.pay({
    user_id: user._id,
    payload,
    lang,
  });

  return res.status(statusCode).send(response);
};

const delete_movement = async (req, res) => {
  const { lang } = req.headers.lang;
  const deleteMovementData = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.delete_movement({
    user_id: user._id,
    deleteMovementData,
    lang,
  });

  return res.status(statusCode).send(response);
};

module.exports = {
  check_balance,
  recharge,
  pay,
  movements,
  delete_movement,
};
