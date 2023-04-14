require("dotenv").config();
const AccountModel = require("../models/Account");
const moment = require("moment");
const { formatNumberDecimal } = require("../utils/formatNumberDecimal");
const handleTraductions = require("../utils/handleTraductions");

const check_balance = async ({ user_id, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const Account = await AccountModel.findOne({ user_id });

    if (Account) {
      return {
        statusCode: 200,
        response: { available_balance: Account.available_balance },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t("message.error_unexpected") },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

const movements = async ({ user_id, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const Account = await AccountModel.findOne({ user_id });

    if (Account) {
      return {
        statusCode: 200,
        response: { movements: Account.movements },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t("message.error_unexpected") },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

const recharge = async ({ user_id, payload, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const { amount, concept } = payload;
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
      response: { message: t("message.error_unexpected") },
    };
  }
};

const pay = async ({ user_id, payload, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const { amount, concept } = payload;
    const Account = await AccountModel.findOne({ user_id });
    const amountToAdd = formatNumberDecimal(amount);
    const debitToRemainingBalance = formatNumberDecimal(
      Account.available_balance - amountToAdd
    );

    if (debitToRemainingBalance < 0) {
      return {
        statusCode: 400,
        response: {
          message: t("message.pay.amount.is_too_much"),
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
      response: { message: t("message.error_unexpected") },
    };
  }
};

const delete_movement = async ({ user_id, payload, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const { movement_id } = payload;
    const Account = await AccountModel.findOne({ user_id }); // find movement's user

    const movementToDelete = Account.movements.filter(
      ({ _id }) => _id.toString() == movement_id
    )[0]; // get movement to delete

    if (Account.available_balance >= movementToDelete.amount) {
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
        concept,
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
          message: t("message.delete_movement.can_not_remove"),
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
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
