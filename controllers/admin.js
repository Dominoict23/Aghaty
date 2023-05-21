const { compare, hash } = require("bcrypt");
const {
  Admin,
  Seller,
  Category,
  SubCategory,
  DiscountCode,
  Message,
  Delivery,
} = require("../models");
const { serverErrs } = require("../middleware/customError");
const generateToken = require("../middleware/generateToken");
const {
  validateAddSeller,
  validateAddCategory,
  validateAddSubCategory,
  validateEditSeller,
  validateDeleteSeller,
  validateEditCategory,
  validateDeleteCategory,
  validateEditSubCategory,
  validateDeleteSubCategory,
  validateAddDiscountCode,
  validateEditDiscountCode,
  validateDeleteDiscountCode,
  validateAddDelivery,
  validateEditDelivery,
  validateDeleteDelivery,
} = require("../validation");

// Auth requests
const login = async (req, res) => {
  const { mobile, password } = req.body;

  const admin = await Admin.findOne({ where: { mobile } });

  if (!admin) throw serverErrs.BAD_REQUEST("admin not found");

  const result = await compare(password, admin?.password);

  if (!result) throw serverErrs.BAD_REQUEST("Wrong mobile number Or Password");

  const token = await generateToken({ userId: admin.id, role: "admin" });

  res.send({
    status: 201,
    admin,
    msg: "successful log in as admin",
    token: token,
    role: "admin",
  });
};

// Sellers requests
const addSeller = async (req, res) => {
  await validateAddSeller.validate(req.body);

  const {
    mobile,
    firstName,
    lastName,
    password,
    role,
    serviceType,
    location,
    CategoryId,
  } = req.body;

  const sellerFound = await Seller.findOne({ where: { mobile } });

  if (sellerFound) throw serverErrs.BAD_REQUEST("mobile is already used");

  const hashedPassword = await hash(password, 12);
  // TODO: generate random code and then send it sms message
  //   const code = generateRandomCode();

  const newSeller = await Seller.create({
    mobile,
    firstName,
    lastName,
    password: hashedPassword,
    role,
    serviceType,
    location,
    avatar: "avatar.png",
    cover: "cover.jpg",
    CategoryId,
    //TODO: verificationCode: code
  });

  res.send({
    status: 201,
    newSeller,
    msg: "seller added successfully",
  });
};
const editSeller = async (req, res) => {
  await validateEditSeller.validate(req.body);

  const { SellerId, password, ...others } = req.body;

  const sellerFound = await Seller.findOne({ where: { id: SellerId } });

  if (!sellerFound) throw serverErrs.BAD_REQUEST("seller not found");

  if (password) {
    password = await hash(password, 12);
    await sellerFound.update({ password, ...others });
  } else {
    await sellerFound.update({ ...others });
  }

  res.send({
    status: 201,
    sellerFound,
    msg: "seller updated successfully",
  });
};
const deleteSeller = async (req, res) => {
  await validateDeleteSeller.validate(req.body);

  const { SellerId } = req.body;

  const sellerFound = await Seller.findOne({ where: { id: SellerId } });

  if (!sellerFound) throw serverErrs.BAD_REQUEST("seller not found");

  await sellerFound.destroy();

  res.send({
    status: 201,
    msg: "seller deleted successfully",
  });
};
const getAllSellers = async (req, res) => {
  const sellers = await Seller.findAll({ include: { model: Category } });

  res.send({
    status: 200,
    sellers,
    msg: "get all sellers successfully",
  });
};

// TODO: add delivery "taxi, fizba, and other types"
const addDelivery = async (req, res) => {
  await validateAddDelivery.validate(req.body);

  const { mobile, firstName, lastName, password } = req.body;

  const deliveryFound = await Delivery.findOne({ where: { mobile } });

  if (deliveryFound) throw serverErrs.BAD_REQUEST("mobile is already used");

  const hashedPassword = await hash(password, 12);

  // TODO: generate random code and then send it sms message
  //   const code = generateRandomCode();

  const newDelivery = await Delivery.create({
    mobile,
    firstName,
    lastName,
    password: hashedPassword,
  });

  res.send({
    status: 201,
    newDelivery,
    msg: "delivery added successfully",
  });
};
const editDelivery = async (req, res) => {
  await validateEditDelivery.validate(req.body);

  const { DeliveryId, password, ...others } = req.body;

  const deliveryFound = await Delivery.findOne({ where: { id: DeliveryId } });

  if (!deliveryFound) throw serverErrs.BAD_REQUEST("Delivery not found");

  if (password) {
    password = await hash(password, 12);
    await deliveryFound.update({ password, ...others });
  } else {
    await deliveryFound.update({ ...others });
  }

  res.send({
    status: 201,
    deliveryFound,
    msg: "Delivery updated successfully",
  });
};
const deleteDelivery = async (req, res) => {
  await validateDeleteDelivery.validate(req.body);

  const { DeliveryId } = req.body;

  const deliveryFound = await Delivery.findOne({ where: { id: DeliveryId } });

  if (!deliveryFound) throw serverErrs.BAD_REQUEST("Delivery not found");

  await deliveryFound.destroy();

  res.send({
    status: 201,
    msg: "Delivery deleted successfully",
  });
};
const getAllDeliveries = async (req, res) => {
  const deliveries = await Delivery.findAll({});

  res.send({
    status: 200,
    deliveries,
    msg: "get all deliveries successfully",
  });
};

// Category requests
const addCategory = async (req, res) => {
  await validateAddCategory.validate(req.body);

  const { nameEN, nameAR, nameKUR, role } = req.body;

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newCategory = await Category.create({
    nameEN,
    nameAR,
    nameKUR,
    image: req.file.filename,
    role,
  });

  res.send({
    status: 201,
    newCategory,
    msg: "Category added successfully",
  });
};
const editCategory = async (req, res) => {
  await validateEditCategory.validate(req.body);

  const { CategoryId, ...others } = req.body;

  const category = await Category.findOne({ where: { id: CategoryId } });

  if (!category) throw serverErrs.BAD_REQUEST("category not found");

  if (req.file) {
    await category.update({ ...others, image: req.file.filename });
  } else {
    await category.update({ ...others });
  }

  res.send({
    status: 201,
    category,
    msg: "Category updated successfully",
  });
};
const deleteCategory = async (req, res) => {
  await validateDeleteCategory.validate(req.body);

  const { CategoryId } = req.body;

  const category = await Category.findOne({ where: { id: CategoryId } });

  if (!category) throw serverErrs.BAD_REQUEST("category not found");

  await category.destroy();

  res.send({
    status: 201,
    msg: "category deleted successfully",
  });
};
const getAllCategory = async (req, res) => {
  const categories = await Category.findAll({});

  res.send({
    status: 200,
    categories,
    msg: "get all categories successfully",
  });
};

// SubCategory requests
const addSubCategory = async (req, res) => {
  await validateAddSubCategory.validate(req.body);

  const { nameEN, nameAR, nameKUR, CategoryId } = req.body;

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newSubCategory = await SubCategory.create({
    nameEN,
    nameAR,
    nameKUR,
    image: req.file.filename,
    CategoryId,
  });

  res.send({
    status: 201,
    newSubCategory,
    msg: "SubCategory added successfully",
  });
};
const editSubCategory = async (req, res) => {
  await validateEditSubCategory.validate(req.body);

  const { SubCategoryId, ...others } = req.body;

  const subCategory = await SubCategory.findOne({
    where: { id: SubCategoryId },
  });

  if (!subCategory) throw serverErrs.BAD_REQUEST("subCategory not found");

  if (req.file) {
    await subCategory.update({ ...others, image: req.file.filename });
  } else {
    await subCategory.update({ ...others });
  }

  res.send({
    status: 201,
    subCategory,
    msg: "SubCategory updated successfully",
  });
};
const deleteSubCategory = async (req, res) => {
  await validateDeleteSubCategory.validate(req.body);

  const { SubCategoryId } = req.body;

  const subcategory = await SubCategory.findOne({
    where: { id: SubCategoryId },
  });

  if (!subcategory) throw serverErrs.BAD_REQUEST("Subcategory not found");

  await subcategory.destroy();

  res.send({
    status: 201,
    msg: "Subcategory deleted successfully",
  });
};
const getAllSubCategory = async (req, res) => {
  const subCategories = await SubCategory.findAll({
    include: { model: Category },
  });

  res.send({
    status: 200,
    subCategories,
    msg: "get all subCategories successfully",
  });
};

// DiscountCode requests
const addDiscountCode = async (req, res) => {
  await validateAddDiscountCode.validate(req.body);

  let { code, discount, startDate, endDate } = req.body;
  //TODO: check what flutter send
  startDate = startDate.split("/");
  endDate = endDate.split("/");

  const newDiscountCode = await DiscountCode.create({
    code,
    discount,
    startDate: new Date(+startDate[2], +startDate[1] - 1, +startDate[0] + 1),
    endDate: new Date(+endDate[2], +endDate[1] - 1, +endDate[0] + 1),
  });

  res.send({
    status: 201,
    newDiscountCode,
    msg: "DiscountCode added successfully",
  });
};
const editDiscountCode = async (req, res) => {
  await validateEditDiscountCode.validate(req.body);

  const { DiscountCodeId, ...others } = req.body;

  const discountCode = await DiscountCode.findOne({
    where: { id: DiscountCodeId },
  });

  if (!discountCode) throw serverErrs.BAD_REQUEST("DiscountCode not found");

  await discountCode.update({ ...others });

  res.send({
    status: 201,
    discountCode,
    msg: "DiscountCode updated successfully",
  });
};
const deleteDiscountCode = async (req, res) => {
  await validateDeleteDiscountCode.validate(req.body);

  const { DiscountCodeId } = req.body;

  const discountCode = await DiscountCode.findOne({
    where: { id: DiscountCodeId },
  });

  if (!discountCode) throw serverErrs.BAD_REQUEST("DiscountCode not found");

  await discountCode.destroy();

  res.send({
    status: 201,
    msg: "DiscountCode deleted successfully",
  });
};
const getAllDiscountCode = async (req, res) => {
  const discountCodes = await DiscountCode.findAll({});

  res.send({
    status: 200,
    discountCodes,
    msg: "get all discountCodes successfully",
  });
};

// Messages requests
const getAllMessages = async (req, res) => {
  const messages = await Message.findAll({});

  res.send({
    status: 200,
    messages,
    msg: "get all messages successfully",
  });
};

module.exports = {
  login,
  addSeller,
  editSeller,
  deleteSeller,
  getAllSellers,
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategory,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  addDiscountCode,
  editDiscountCode,
  deleteDiscountCode,
  getAllDiscountCode,
  getAllMessages,
  addDelivery,
  editDelivery,
  deleteDelivery,
  getAllDeliveries,
};
