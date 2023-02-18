require("dotenv").config();
const AccountModel = require("../models/Account");
const moment = require("moment");
const { formatNumberDecimal } = require("../utils/formatNumberDecimal");

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
    const amountToSubtract = formatNumberDecimal(amount);
    const creditToRemainingBalance = formatNumberDecimal(
      Account.available_balance + amountToSubtract
    );
    Account.available_balance = creditToRemainingBalance;
    Account.movements.unshift({
      date: moment().unix(),
      type: "credit",
      amount: amountToSubtract,
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
    const amountToAdd = formatNumberDecimal(amount);
    const debitToRemainingBalance = formatNumberDecimal(
      Account.available_balance - amountToAdd
    );

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
        amount: -amountToAdd,
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

const delete_movement = async (user_id, payData) => {
  try {
    const { movement_id } = payData;
    const Account = await AccountModel.findOne({ user_id }); // find movement's user
    const movementToDelete = Account.movements.filter(
      ({ _id }) => _id.toString() == movement_id
    )[0]; // get movement to delete

    if (Account.available_balance > movementToDelete.amount) {
      Account.movements = Account.movements.filter(
        (movement) => movement._id.toString() !== movement_id
      ); // update movements
      const { type, amount, concept } = movementToDelete;
      const isCredit = type === "credit";
      const amountNew = isCredit ? -amount : amount * -1;
      Account.available_balance =
        Account.available_balance - Number(parseFloat(amount).toFixed(2));
      Account.movements.unshift({
        date: moment().unix(),
        type: isCredit ? "debit" : "credit",
        amount: amountNew,
        remaining_balance: Account.available_balance,
        concept: `Eliminaste el movimiento: ${concept}`,
        wasRemoved: true,
      });

      await Account.save();

      return {
        statusCode: 200,
        response: { message: true },
      };
    } else {
      return {
        statusCode: 400,
        response: {
          message:
            "No puedes eliminar este movimiento porque quedaria tu saldo negativo",
        },
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
  delete_movement,
};
