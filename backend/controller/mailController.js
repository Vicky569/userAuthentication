const asyncHandler = require("express-async-handler");
const User = require("../userModel");
const bcrypt = require("bcryptjs");
const http = require("http");
const nodemailer = require("nodemailer");
let otp;
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  otp = Math.floor(1000 + Math.random() * 9000);
  const userExists = await User.findOne({ email });
  if (!userExists) {
    res.status(400);
    throw new Error("User not exists");
  }
  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "otpgenerator077@gmail.com",
      pass: process.env.password,
    },
  });
  const receiver = {
    from: "otpgenerator077@gmail.com",
    to: email,
    subject: "OTP FOR RESET PASSWORD",
    html: `
      <p>
        OTP to reset your password is <b> ${otp} </b>
      </p>
      `,
  };

  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) {
      res.status(400);
      throw new Error("User not found");
    } else {
      res.status(201).json({
        email: req.email,
      });
      console.log("success");
    }
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // console.log(email);
  // console.log(password);
  // console.log(otp);
  const eotp = req.body.otp;

  if (eotp != otp) {
    res.status(400);
    throw new Error("Please Enter Valid Otp");
  }

  async function resetPass(email, newPassword) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
  }

  if (resetPass(email, password)) {
    res.status(201).json({
      email: email,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

module.exports = { sendOtp, resetPassword };
