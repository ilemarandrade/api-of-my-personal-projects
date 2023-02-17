const express = require("express");
const walletController = require("../../controllers/walletControllers");

const validation_password = async (req, res, next) => {
  try {
    const { password } = req.user.user;
    const { password: passwordReceived } = req.body;
    if (password === passwordReceived) {
      next();
    } else {
      return res.status(405).send("Password incorrecta");
    }
  } catch (err) {}
};
const router = express.Router();

router.get("/check_balance", walletController.check_balance);

router.get("/movements", walletController.movements);

router.put("/recharge", validation_password, walletController.recharge);

router.put("/pay", validation_password, walletController.pay);

router.put("/delete_movement", walletController.delete_movement);

module.exports = router;
