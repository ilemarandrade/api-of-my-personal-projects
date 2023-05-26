import { Request } from 'express';

export type Lang = 'es' | 'en';

interface Header {
  lang?: Lang;
}

export interface IRequest extends Request {
  token?: string;
  user?: any;
  headers: Request['headers'] & Header;
}
