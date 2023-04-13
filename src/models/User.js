const { Schema, model, default: mongoose } = require("mongoose");

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    default: "",
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
    default: "",
  },
  lang: {
    type: String,
    default: null,
  },
});

module.exports = model("User", User);
