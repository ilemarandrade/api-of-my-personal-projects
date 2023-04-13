require("dotenv").config();

const jwt = require("jsonwebtoken");
const AccountModel = require("../models/Account");
const UserModel = require("../models/User");
const handleTraductions = require("../utils/handleTraductions");

const login = async ({ user, lang }) => {
  const { t } = handleTraductions(lang);

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
        response: { message: t("message.login.wrong.data") },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

const createUser = async ({ user, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const userExistWithThisEmail = await UserModel.find({ email: user.email });
    const userExistWithThisDocument = await UserModel.find({
      document: user.document,
    });

    if (userExistWithThisEmail.length || userExistWithThisDocument.length) {
      return {
        statusCode: 400,
        response: { message: t("message.sign_up.user_exist") },
      };
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

      return { statusCode: 200, response: t("message.create_user.success") };
    }
  } catch (error) {
    console.log("error:", error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

const updateUser = async ({ prevUserData, dataToUpdateUser, langCurrent }) => {
  const { _id } = prevUserData;
  const { t } = handleTraductions(dataToUpdateUser.lang || langCurrent);

  try {
    const User = await UserModel.updateOne({ _id }, { ...dataToUpdateUser });

    if (User.modifiedCount) {
      return {
        statusCode: 200,
        response: { message: t("message.success") },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t("message.error_unexpected") },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

module.exports = {
  login,
  createUser,
  updateUser,
};
