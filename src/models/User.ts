import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  lang: string | null;
  token_to_reset_password: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  document: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  lang: {
    type: String,
    default: null,
  },
  token_to_reset_password: { type: String, default: '' },
});

const User = model<IUser>('User', UserSchema);

export default User;
