import { Schema, model } from 'mongoose';

export interface IMovements {
  date: number;
  type: 'credit' | 'debit';
  amount: number;
  remaining_balance: number;
  concept: string;
  wasRemoved: boolean;
  _id?: number;
}

interface IAccount {
  user_id: Schema.Types.ObjectId;
  available_balance: number;
  movements: IMovements[];
}

const SchemaAccount = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  available_balance: {
    type: Number,
    default: 0,
  },
  movements: [
    {
      date: String,
      type: {
        enum: ['credit', 'debit'],
        message: '{VALUE} is not supported',
        type: String,
      },
      amount: Number,
      remaining_balance: Number,
      concept: String,
      wasRemoved: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Account = model<IAccount>('Account', SchemaAccount);

export default Account;
