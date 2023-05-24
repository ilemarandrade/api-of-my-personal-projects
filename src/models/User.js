import { Schema, model } from 'mongoose';

const User = new Schema({
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

export default model('User', User);
