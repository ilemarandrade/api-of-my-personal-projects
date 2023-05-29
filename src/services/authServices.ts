import jwt from 'jsonwebtoken';
import AccountModel from '../models/Account.js';
import UserModel, { IUser } from '../models/User.js';
import handleTraductions from '../utils/handleTraductions.js';
import { transporter } from '../utils/sendEmail.js';
import recoveryPasswordMail from '../constants/mails/recoveryPassword.js';
import { encrypt, compare } from '../utils/encryptPassword.js';
import { IResponseServices, Lang } from '../models/Request.js';

interface ILogin {
  user: {
    password: string;
    email: string;
  };
  lang: Lang;
}

interface IResponseLogin {
  jwt?: string;
  message?: string;
}

const login = async ({
  user,
  lang,
}: ILogin): Promise<IResponseServices<IResponseLogin>> => {
  const { t } = handleTraductions(lang);

  try {
    const User: IUser | null = await UserModel.findOne({ email: user.email });
    if (User) {
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
          process.env.SECRET_JWT as string
        );

        return {
          statusCode: 200,
          response: { jwt: token },
        };
      } else {
        return {
          statusCode: 400,
          response: { message: t('message.login.wrong_data') },
        };
      }
    } else {
      throw 'User not exist';
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface ICreateUser {
  user: IUser;
  lang: Lang;
}

const createUser = async ({
  user,
  lang,
}: ICreateUser): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    const userExistWithThisEmail = await UserModel.find({ email: user.email });
    const userExistWithThisDocument = await UserModel.find({
      document: user.document,
    });

    if (userExistWithThisEmail.length || userExistWithThisDocument.length) {
      return {
        statusCode: 400,
        response: { message: t('message.sign_up.user_exist') },
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

      return {
        statusCode: 200,
        response: { message: t('message.create_user.success') },
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IUpdateUser {
  prevUserData: IUser;
  dataToUpdateUser: {
    name?: string;
    lastname?: string;
    document?: string;
    phone?: string;
    lang?: Lang;
  };
  langCurrent: Lang;
}

const updateUser = async ({
  prevUserData,
  dataToUpdateUser,
  langCurrent,
}: IUpdateUser): Promise<IResponseServices> => {
  const { _id } = prevUserData;
  const { t } = handleTraductions(dataToUpdateUser.lang || langCurrent);

  try {
    const User = await UserModel.updateOne({ _id }, { ...dataToUpdateUser });

    if (User.modifiedCount) {
      return {
        statusCode: 200,
        response: { message: t('message.success') },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t('message.error_unexpected') },
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface IForgotPassword {
  lang: Lang;
  email: string;
}

const forgotPassword = async ({
  lang,
  email,
}: IForgotPassword): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    const User = await UserModel.findOne({ email });

    if (User) {
      let token_to_reset_password = jwt.sign(
        { User: { _id: User._id.toString() } },
        process.env.SECRET_JWT as string,
        { expiresIn: '10m' }
      );

      await UserModel.updateOne({ email }, { token_to_reset_password });

      await transporter.sendMail({
        from: 'Wallet Andrade', // sender address
        to: email, // list of receivers
        subject: t('message.forgot_password.title_email'), // Subject line is like main title
        text: t('message.forgot_password.title_email'), // plain text body
        html: recoveryPasswordMail[lang](token_to_reset_password), // html body
      });

      return {
        statusCode: 200,
        response: { message: t('message.forgot_password.check_your_email') },
      };
    } else {
      return {
        statusCode: 400,
        response: { message: t('message.login.wrong.data') },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      response: { message: t('message.error_unexpected') },
    };
  }
};

interface INewPassword {
  lang: Lang;
  password: string;
  confirmation_password: string;
  token: string;
}

interface JwtPayload {
  User: {
    _id: string;
  };
}

const newPassword = async ({
  lang,
  password,
  confirmation_password,
  token,
}: INewPassword): Promise<IResponseServices> => {
  const { t } = handleTraductions(lang);

  try {
    if (password !== confirmation_password) {
      return {
        statusCode: 400,
        response: {
          message: t('message.forgot_password.passwords_do_not_match'),
        },
      };
    }

    const {
      User: { _id },
    } = jwt.verify(token, process.env.SECRET_JWT as string) as JwtPayload;

    const User = await UserModel.findById(_id);

    if (User?.token_to_reset_password === token) {
      const newPasswordFormat = await encrypt(password);
      const User = await UserModel.findByIdAndUpdate(_id, {
        password: newPasswordFormat,
        token_to_reset_password: '',
      });

      if (User) {
        return {
          statusCode: 200,
          response: {
            message: t('message.forgot_password.success_update_password'),
          },
        };
      } else {
        return {
          statusCode: 400,
          response: { message: t('message.error_unexpected') },
        };
      }
    } else {
      throw 'Expired token you must request again to recover password';
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      response: {
        message: t('message.forgot_password.expired_token'),
      },
    };
  }
};

export default { login, createUser, updateUser, forgotPassword, newPassword };
