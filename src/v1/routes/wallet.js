const express = require("express");
const walletController = require("../../controllers/walletControllers");

const router = express.Router();

router.get("/check_balance", walletController.check_balance);

router.get("/movements", walletController.movements);

router.put("/recharge", walletController.recharge);

router.put("/pay", walletController.pay);

router.put("/delete_movement", walletController.delete_movement);

module.exports = router;
