require("dotenv").config();

const jwt = require("jsonwebtoken");
const AccountModel = require("../models/Account");
const UserModel = require("../models/User");
const handleTraductions = require("../utils/handleTraductions");
const { transporter } = require("../utils/sendEmail");
const recoveryPasswordMail = require("../constants/mails/recoveryPassword");
const { encrypt, compare } = require("../utils/encryptPassword");

const login = async ({ user, lang }) => {
  const { t } = handleTraductions(lang);

  try {
    const User = await UserModel.findOne({ email: user.email });
    const isCorrectPassword = await compare(user.password, User.password);

    if (isCorrectPassword) {
      const { _id, name, lastname, email, phone, document, lang } = User;

      let token = jwt.sign(
        {
          user: {
            name,
            lastname,
            email,
            phone,
            document,
            lang,
            _id: _id.toString(),
          },
        },
        process.env.SECRET_JWT
      );

      return {
        statusCode: 200,
        response: { jwt: token },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t("message.login.wrong_data") },
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
      const passwordEncrypt = await encrypt(user.password);

      const userToSend = new UserModel({
        ...user,
        password: passwordEncrypt,
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
    return {
      statusCode: 400,
      response: { message: t("message.error_unexpected") },
    };
  }
};

const forgotPassword = async ({ lang, email }) => {
  const { t } = handleTraductions(lang);

  try {
    const User = await UserModel.findOne({ email });

    if (User) {
      let token_to_reset_password = jwt.sign(
        { User: { _id: User._id.toString() } },
        process.env.SECRET_JWT
        // { expiresIn: "5m" }
      );

      await UserModel.updateOne({ email }, { token_to_reset_password });

      await transporter.sendMail({
        from: "Wallet Andrade", // sender address
        to: email, // list of receivers
        subject: t("message.forgot_password.title_email"), // Subject line is like main title
        text: t("message.forgot_password.title_email"), // plain text body
        html: recoveryPasswordMail[lang](token_to_reset_password), // html body
      });

      return {
        statusCode: 200,
        response: { message: t("message.forgot_password.check_your_email") },
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

const newPassword = async ({
  lang,
  password,
  confirmation_password,
  token,
}) => {
  const { t } = handleTraductions(lang);

  try {
    if (password !== confirmation_password) {
      return {
        statusCode: 400,
        response: {
          message: t("message.forgot_password.passwords_do_not_match"),
        },
      };
    }

    const {
      User: { _id },
    } = jwt.verify(token, process.env.SECRET_JWT);

    const { token_to_reset_password } = await UserModel.findById(_id);

    if (token_to_reset_password === token) {
      const newPasswordFormat = await encrypt(password);
      const User = await UserModel.findByIdAndUpdate(_id, {
        password: newPasswordFormat,
        token_to_reset_password: "",
      });

      if (User) {
        return {
          statusCode: 200,
          response: {
            message: t("message.forgot_password.success_update_password"),
          },
        };
      } else {
        return {
          statusCode: 400,
          response: { message: t("message.error_unexpected") },
        };
      }
    } else {
      throw "Expired token you must request again to recover password";
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      response: {
        message: t("message.forgot_password.expired_token"),
      },
    };
  }
};

module.exports = {
  login,
  createUser,
  updateUser,
  forgotPassword,
  newPassword,
};
