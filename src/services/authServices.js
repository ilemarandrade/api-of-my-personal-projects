require("dotenv").config();

const jwt = require("jsonwebtoken");
const AccountModel = require("../models/Account");
const UserModel = require("../models/User");

const login = async (user) => {
  try {
    const existUser = await UserModel.findOne({ ...user });
    if (existUser) {
      const { _doc: dataToJwt } = existUser;
      let token = jwt.sign(
        { user: { ...dataToJwt, _id: dataToJwt._id.toString() } },
        process.env.SECRET_JWT
      );
      return {
        statusCode: 200,
        response: { jwt: token },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: "Email or password was not correct" },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: "An unexpected error has occurred" },
    };
  }
};

const createUser = async (user) => {
  try {
    const userExistWithThisEmail = await UserModel.find({ email: user.email });
    const userExistWithThisDocument = await UserModel.find({
      document: user.document,
    });
    if (userExistWithThisEmail.length || userExistWithThisDocument.length) {
      return { statusCode: 401, response: { message: "User exist" } };
    } else {
      const userToSend = new UserModel({
        ...user,
      });
      const createUserAccount = new AccountModel({
        available_balance: 0,
        user_id: userToSend._id,
        movements: [],
      });
      await userToSend.save();
      await createUserAccount.save();
      return { statusCode: 200, response: true };
    }
  } catch (error) {
    console.log("error:", error);
    return { statusCode: 400, message: "An error has occurred" };
  }
};

const updateUser = () => {
  return;
};

module.exports = {
  login,
  createUser,
  updateUser,
};
