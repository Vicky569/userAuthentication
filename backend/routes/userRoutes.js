const express = require("express");
const { registerUser, authUser } = require("../controller/userController");
const { resetPassword, sendOtp } = require("../controller/mailController");

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/sendOtp", sendOtp);
router.post("/reset", resetPassword);

module.exports = router;
