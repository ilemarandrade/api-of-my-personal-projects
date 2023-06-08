import AccountModel, { IMovements } from '../models/Account.js';
import moment from 'moment';
import formatNumberDecimal from '../utils/formatNumberDecimal.js';
import handleTraductions from '../utils/handleTraductions.js';
import { ICommonServices, IResponseServices } from '../models/Request.js';

interface IResponseCheckBalance {
  available_balance?: number;
  message?: string;
}

const check_balance = async ({
  user_id,
  lang,
}: ICommonServices): Promise<IResponseServices<IResponseCheckBalance>> => {
  const { t } = handleTraductions(lang);

  try {
    const Account = await AccountModel.findOne({ user_id });

    if (Account) {
      return {
        statusCode: 200,
        response: { available_balance: Account.available_balance },
      };
    } else {
      throw null;
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IMovementsServices extends ICommonServices {
  page: number;
  rowsPerPage: number;
  removedMoves?: string;
}

interface IResponseMovements {
  movements?: IMovements[];
  total?: number;
  message?: string;
}

const movements = async ({
  user_id,
  lang,
  page,
  rowsPerPage,
  removedMoves = 'false',
}: IMovementsServices): Promise<IResponseServices<IResponseMovements>> => {
  const { t } = handleTraductions(lang);
  const initList = page * rowsPerPage - rowsPerPage;
  const endList = page * rowsPerPage;
  const isRemovedMoves = removedMoves === 'true';

  try {
    const Account = await AccountModel.findOne({ user_id });

    if (Account?.movements) {
      const movements = isRemovedMoves
        ? Account.movements.filter(
            ({ wasRemoved }) => wasRemoved === isRemovedMoves
          )
        : Account.movements;

      return {
        statusCode: 200,
        response: {
          movements: movements.slice(initList, endList),
          total: movements.length,
        },
      };
    } else {
      throw null;
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IRecharge extends ICommonServices {
  payload: { amount: string; concept: string };
}

interface IBalanceModifiersResponse extends IResponseCheckBalance {}

const recharge = async ({
  user_id,
  payload,
  lang,
}: IRecharge): Promise<IResponseServices<IBalanceModifiersResponse>> => {
  const { t } = handleTraductions(lang);

  try {
    const { amount, concept } = payload;
    const amountToAdd = formatNumberDecimal(amount);

    const Account = await AccountModel.findOne({ user_id });

    if (Account) {
      const creditToRemainingBalance = formatNumberDecimal(
        `${Account.available_balance + amountToAdd}`
      );

      Account.available_balance = creditToRemainingBalance;
      Account.movements.unshift({
        date: moment().unix(),
        type: 'credit',
        amount: amountToAdd,
        remaining_balance: creditToRemainingBalance,
        concept,
        wasRemoved: false,
      });

      await Account.save();

      return {
        statusCode: 200,
        response: { available_balance: Account.available_balance },
      };
    } else {
      throw null;
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IPay extends IRecharge {}

const pay = async ({
  user_id,
  payload,
  lang,
}: IPay): Promise<IResponseServices<IBalanceModifiersResponse>> => {
  const { t } = handleTraductions(lang);

  try {
    const { amount, concept } = payload;
    const amountToSubtract = formatNumberDecimal(amount);

    const Account = await AccountModel.findOne({ user_id });

    if (Account) {
      const debitToRemainingBalance = formatNumberDecimal(
        `${Account.available_balance - amountToSubtract}`
      );

      if (debitToRemainingBalance < 0) {
        return {
          statusCode: 400,
          response: {
            message: t('message.pay.amount_is_too_much'),
          },
        };
      } else {
        Account.available_balance = debitToRemainingBalance;
        Account.movements.unshift({
          date: moment().unix(),
          type: 'debit',
          amount: -amountToSubtract,
          remaining_balance: debitToRemainingBalance,
          concept,
          wasRemoved: false,
        });

        await Account.save();

        return {
          statusCode: 200,
          response: { available_balance: Account.available_balance },
        };
      }
    } else {
      throw null;
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IDeleteMovement extends ICommonServices {
  payload: { movement_id: number };
}

const delete_movement = async ({
  user_id,
  payload,
  lang,
}: IDeleteMovement): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    const { movement_id } = payload;
    const Account = await AccountModel.findOne({ user_id }); // find movement's user

    if (Account) {
      const movementToDelete = Account.movements.filter(
        ({ _id }) =>
          Number((_id as number as unknown as string).toString()) ===
          movement_id
      )[0]; // get movement to delete

      if (Account.available_balance >= movementToDelete.amount) {
        Account.movements = Account.movements.filter(
          ({ _id }) =>
            Number((_id as number as unknown as string).toString()) !==
            movement_id
        ); // update movements

        const { type, amount, concept } = movementToDelete;

        const isCredit = type === 'credit';

        const amountNew = isCredit ? -amount : amount * -1;

        Account.available_balance = Account.available_balance - amount;
        Account.movements.unshift({
          date: moment().unix(),
          type: isCredit ? 'debit' : 'credit',
          amount: amountNew,
          remaining_balance: Account.available_balance,
          concept,
          wasRemoved: true,
        });

        await Account.save();

        return {
          statusCode: 200,
          response: { message: 'true' },
        };
      } else {
        return {
          statusCode: 400,
          response: {
            message: t('message.delete_movement.can_not_remove'),
          },
        };
      }
    } else {
      throw null;
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

export default { recharge, check_balance, movements, pay, delete_movement };
