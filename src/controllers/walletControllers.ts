import { Response } from 'express';
import { IRequest } from '../models/Request.js';
import walletServices from '../services/walletServices.js';

const check_balance = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.check_balance({
    user_id: user._id,
    lang,
  });

  return res.status(statusCode).send(response);
};

const movements = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { user } = req.user;
  const { page, rowsPerPage, removedMoves } = req.query;

  const { statusCode, response } = await walletServices.movements({
    user_id: user._id,
    lang,
    page: Number(page) || 1,
    rowsPerPage: Number(rowsPerPage) || 10,
    removedMoves: removedMoves as string,
  });

  return res.status(statusCode).send(response);
};

const recharge = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const payload = req.body;
  const { user } = req.user;

  const { statusCode, response } = await walletServices.recharge({
    user_id: user._id,
    payload,
    lang,
  });

  return res.status(statusCode).send(response);
};

const pay = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const payload = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.pay({
    user_id: user._id,
    payload,
    lang,
  });

  return res.status(statusCode).send(response);
};

const delete_movement = async (req: IRequest, res: Response) => {
  const { lang = 'en' } = req.headers;
  const payload = req.body;
  const { user } = req.user;
  const { statusCode, response } = await walletServices.delete_movement({
    user_id: user._id,
    payload,
    lang,
  });

  return res.status(statusCode).send(response);
};

export default { recharge, check_balance, movements, pay, delete_movement };
