const UserModel = require("../models/User");
const login = async (user) => {
  try {
    const existUser = await UserModel.findOne({ ...user });
    if (existUser) {
      return { statusCode: 200, message: "success" };
    } else {
      return { statusCode: 401, message: "authorization incorrect" };
    }
  } catch (error) {}
  return;
};

const createUser = async (user) => {
  try {
    const userExist = await UserModel.find({ email: user.email });
    if (userExist.length) {
      return { statusCode: 401, message: "User exist" };
    } else {
      const userToSend = new UserModel({
        ...user,
      });
      await userToSend.save();
      return { statusCode: 200, message: "success" };
    }
  } catch (error) {
    console.log("error:", error);
    return { statusCode: 200, message: "An error has occurred" };
  }
  return;
};

const updateUser = () => {
  return;
};

module.exports = {
  login,
  createUser,
  updateUser,
};
