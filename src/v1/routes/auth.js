const express = require("express");
const authController = require("../../controllers/authControllers");
const { verifyUserToken } = require("../../midlewares/verify_user_token");

const router = express.Router();

router.post("/login", authController.login);

router.get(
  "/user_information",
  verifyUserToken,
  authController.user_Information
);

router.post("/signup", authController.createNewUser);

router.put("/update_user", verifyUserToken, authController.updateUser);

module.exports = router;
