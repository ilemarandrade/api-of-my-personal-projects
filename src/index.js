require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const v1RouterAuth = require("./v1/routes/auth");
const v1RouterWallet = require("./v1/routes/wallet");
const { verifyUserToken } = require("./midlewares/verify_user_token");

const mongoString = process.env.MONGO_URL;
const app = express();
const PORT = process.env.PORT || 8080;

// connect to mongoose
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// *** call to version 1 routes ***
app.use("/api/v1/auth", v1RouterAuth);
app.use("/api/v1/wallet", verifyUserToken, v1RouterWallet);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
