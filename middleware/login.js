const { compare } = require("bcrypt");
const { User, Seller, Delivery } = require("../models");
const generateToken = require("./generateToken");
const { loginValidation } = require("../validation");
const { serverErrs } = require("./customError");

const login = async (req, res) => {
  const { mobile, password } = req.body;

  await loginValidation.validate({ mobile, password });

  const user = await User.findOne({ where: { mobile } });

  const seller = await Seller.findOne({ where: { mobile } });

  const delivery = await Delivery.findOne({ where: { mobile } });

  const found = user || seller || delivery;
  if (!found) throw serverErrs.BAD_REQUEST("mobile not found");
  const result = await compare(
    password,
    user?.password || seller?.password || delivery?.password
  );

  if (!result) throw serverErrs.BAD_REQUEST("Wrong mobile number Or Password");

  const role = user
    ? "user"
    : delivery
    ? "delivery"
    : seller.role === "productSeller"
    ? "productSeller"
    : "serviceSeller";

  const data = user ? user : delivery ? delivery : seller;

  const dataWithoutPassword = data.toJSON();
  delete dataWithoutPassword.password;
  delete dataWithoutPassword.verificationCode;
  delete dataWithoutPassword.createdAt;
  delete dataWithoutPassword.updatedAt;

  const token = await generateToken({ userId: data.id, name: data.name, role });

  res.send({
    status: 201,
    data: dataWithoutPassword,
    msg: "successful log in",
    token: token,
    role: role,
  });
};

module.exports = login;
