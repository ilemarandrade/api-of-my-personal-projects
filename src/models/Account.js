const { Schema, model, default: mongoose } = require("mongoose");

const Account = new Schema({
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
        enum: ["credit", "debit"],
        message: "{VALUE} is not supported",
        type: String,
      },
      amount: Number,
      remaining_balance: Number,
      concept: String,
    },
  ],
});

module.exports = model("Account", Account);
