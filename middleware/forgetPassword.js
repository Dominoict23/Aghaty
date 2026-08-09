const { hash } = require("bcrypt");
const { Seller } = require("../models");
const { serverErrs } = require("./customError");
// const generateRandomCode = require("./generateCode");
// const sendEmail = require("./sendEmail");
const generateToken = require("./generateToken");

const forgetPasswordSeller = async (req, res) => {
  const { mobile } = req.body;
  const seller = await Seller.findOne({
    where: {
      mobile,
    },
  });
  if (!seller) throw serverErrs.BAD_REQUEST("Mobile not found");
  // Generate a random 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000);

  await seller.update({ verificationCode: code });

  res.send({ status: 201, msg: "successful send sms" });
};

const verifyCodeForgottenPasswordSeller = async (req, res) => {
  const { verificationCode, mobile } = req.body;

  const seller = await Seller.findOne({
    where: {
      mobile,
      verificationCode,
    },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("code is wrong");

  res.send({
    status: 201,
    msg: "Verified code successfully",
  });
};

const editForgottenPasswordSeller = async (req, res) => {
  const { mobile, password } = req.body;

  const seller = await Seller.findOne({
    where: {
      mobile,
    },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Mobile not found");

  const hashedPassword = await hash(password, 12);

  await seller.update({ password: hashedPassword });

  const token = await generateToken({
    userId: seller.id,
    name: seller.name,
    role: seller.role,
  });

  res.send({
    status: 201,
    seller,
    msg: "successful edit password",
    token: token,
    role: seller.role,
  });
};

module.exports = {
  forgetPasswordSeller,
  verifyCodeForgottenPasswordSeller,
  editForgottenPasswordSeller,
};
