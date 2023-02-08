require("dotenv").config();
const AccountModel = require("../models/Account");
const moment = require("moment");

const check_balance = async (user_id) => {
  try {
    const Account = await AccountModel.findOne({ user_id });
    if (Account) {
      return {
        statusCode: 200,
        response: { available_balance: Account.available_balance },
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
    const Account = await AccountModel.findOne({ user_id });
    if (Account) {
      return {
        statusCode: 200,
        response: { movements: Account.movements },
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
    const Account = await AccountModel.findOne({ user_id });
    const creditToRemainingBalance =
      Account.available_balance + parseInt(amount);
    Account.available_balance = creditToRemainingBalance;
    Account.movements.unshift({
      date: moment().unix(),
      type: "credit",
      amount: parseInt(amount),
      remaining_balance: creditToRemainingBalance,
      concept,
    });
    await Account.save();
    return {
      statusCode: 200,
      response: { available_balance: Account.available_balance },
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
    const Account = await AccountModel.findOne({ user_id });
    const debitToRemainingBalance =
      Account.available_balance - parseInt(amount);
    if (debitToRemainingBalance < 0) {
      return {
        statusCode: 400,
        response: {
          message: "The amount to pay exceeds your available balance",
        },
      };
    } else {
      Account.available_balance = debitToRemainingBalance;
      Account.movements.unshift({
        date: moment().unix(),
        type: "debit",
        amount: -parseInt(amount),
        remaining_balance: debitToRemainingBalance,
        concept,
      });
      await Account.save();
      return {
        statusCode: 200,
        response: { available_balance: Account.available_balance },
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
