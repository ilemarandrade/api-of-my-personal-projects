require("dotenv").config();
const AcountModel = require("../models/Acount");
const moment = require("moment");

const check_balance = async (user_id) => {
  try {
    const acount = await AcountModel.findOne({ user_id });
    if (acount) {
      return {
        statusCode: 200,
        response: { available_balance: acount.available_balance },
      };
    } else {
      return {
        statusCode: 401,
        response: { message: "authorization incorrect" },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: "An unexpected error has occurred" },
    };
  }
};

const movements = async (user_id) => {
  try {
    const acount = await AcountModel.findOne({ user_id });
    if (acount) {
      return {
        statusCode: 200,
        response: { movements: acount.movements },
      };
    } else {
      return {
        statusCode: 401,
        response: { message: "authorization incorrect" },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: "An unexpected error has occurred" },
    };
  }
};

const recharge = async (user_id, data) => {
  try {
    const { amount, concept } = data;
    const acount = await AcountModel.findOne({ user_id });
    const creditToRemainingBalance =
      acount.available_balance + parseInt(amount);
    acount.available_balance = creditToRemainingBalance;
    acount.movements.unshift({
      date: moment().unix(),
      type: "credit",
      amount: parseInt(amount),
      remaining_balance: creditToRemainingBalance,
      concept,
    });
    await acount.save();
    return {
      statusCode: 200,
      response: { available_balance: acount.available_balance },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: "An unexpected error has occurred" },
    };
  }
};

const pay = async (user_id, payData) => {
  try {
    const { amount, concept } = payData;
    const acount = await AcountModel.findOne({ user_id });
    const debitToRemainingBalance = acount.available_balance - parseInt(amount);
    if (debitToRemainingBalance < 0) {
      return {
        statusCode: 400,
        response: {
          message: "The amount to pay exceeds your available balance",
        },
      };
    } else {
      acount.available_balance = debitToRemainingBalance;
      acount.movements.unshift({
        date: moment().unix(),
        type: "debit",
        amount: -parseInt(amount),
        remaining_balance: debitToRemainingBalance,
        concept,
      });
      await acount.save();
      return {
        statusCode: 200,
        response: { available_balance: acount.available_balance },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: "An unexpected error has occurred" },
    };
  }
};

module.exports = {
  check_balance,
  recharge,
  pay,
  movements,
};
