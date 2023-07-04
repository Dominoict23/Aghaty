const { compare, hash } = require("bcrypt");
const {
  Admin,
  Seller,
  Category,
  SubCategory,
  DiscountCode,
  Message,
  Delivery,
  Image,
  User,
  SocialMedia,
  Feedback,
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
  validateEditBanner,
  validateDeleteBanner,
  validateCreateSocialMedia,
  validateEditSocialMedia,
  validateDeleteSocialMedia,
} = require("../validation");
const { deliveryRef } = require("../firebaseConfig");

// Auth requests
const login = async (req, res) => {
  const { mobile, password } = req.body;

  const admin = await Admin.findOne({ where: { mobile } });

  if (!admin) throw serverErrs.BAD_REQUEST("admin not found");

  const result = await compare(password, admin?.password);

  if (!result) throw serverErrs.BAD_REQUEST("Wrong mobile number Or Password");

  const token = await generateToken({ userId: admin.id, role: "admin" });

  const dataWithoutPassword = admin.toJSON();
  delete dataWithoutPassword["password"];
  delete dataWithoutPassword["verificationCode"];
  delete dataWithoutPassword["createdAt"];
  delete dataWithoutPassword["updatedAt"];

  res.send({
    status: 201,
    data: dataWithoutPassword,
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
    address,
    CategoryId,
  } = req.body;

  const userFound = await User.findOne({ where: { mobile } });
  const sellerFound = await Seller.findOne({ where: { mobile } });
  const deliveryFound = await Delivery.findOne({ where: { mobile } });

  if (sellerFound || userFound || deliveryFound)
    throw serverErrs.BAD_REQUEST("mobile is already used");

  const hashedPassword = await hash(password, 12);
  // TODO: generate random code and then send it sms message
  //   const code = generateRandomCode();

  const newSeller = await Seller.create({
    mobile,
    firstName,
    lastName,
    password: hashedPassword,
    role,
    avatar: "avatar.png",
    cover: "cover.jpg",
    serviceType,
    address,
    CategoryId,
    //TODO: verificationCode: code
  });

  await Feedback.create({ SellerId: newSeller.id });

  const dataWithoutPassword = newSeller.toJSON();
  delete dataWithoutPassword.password;
  delete dataWithoutPassword.verificationCode;
  delete dataWithoutPassword.createdAt;
  delete dataWithoutPassword.updatedAt;

  res.send({
    status: 201,
    dataWithoutPassword,
    msg: "seller added successfully",
  });
};
const editSeller = async (req, res) => {
  await validateEditSeller.validate(req.body);

  const { SellerId, password, ...others } = req.body;

  const sellerFound = await Seller.findOne({
    where: { id: SellerId },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
  });

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
  const { limit, offset } = req.query;
  const count = await Seller.count();
  const sellers = await Seller.findAll({
    include: { model: Category },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
    limit: +limit || count,
    offset: +offset || 0,
  });

  res.send({
    status: 200,
    sellers,
    count,
    msg: "get all sellers successfully",
  });
};

const addDelivery = async (req, res) => {
  await validateAddDelivery.validate(req.body);

  const { mobile, firstName, lastName, password, type } = req.body;

  const deliveryFound = await Delivery.findOne({ where: { mobile } });
  const userFound = await User.findOne({ where: { mobile } });
  const sellerFound = await Seller.findOne({ where: { mobile } });

  if (sellerFound || userFound || deliveryFound)
    throw serverErrs.BAD_REQUEST("mobile is already used");

  const hashedPassword = await hash(password, 12);

  // TODO: generate random code and then send it sms message
  //   const code = generateRandomCode();

  const newDelivery = await Delivery.create({
    mobile,
    firstName,
    lastName,
    password: hashedPassword,
    type, // taxi, fizba, and other types
    avatar: "avatar.png",
    cover: "cover.jpg",
  });

  await deliveryRef
    .child(newDelivery.id)
    .set({ long: "", lat: "", fcmToken: "" });

  const dataWithoutPassword = newDelivery.toJSON();
  delete dataWithoutPassword.password;
  delete dataWithoutPassword.verificationCode;
  delete dataWithoutPassword.createdAt;
  delete dataWithoutPassword.updatedAt;

  res.send({
    status: 201,
    data: dataWithoutPassword,
    msg: "delivery added successfully",
  });
};
const editDelivery = async (req, res) => {
  await validateEditDelivery.validate(req.body);

  const { DeliveryId, password, ...others } = req.body;

  const deliveryFound = await Delivery.findOne({
    where: { id: DeliveryId },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
  });

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
  const deliveries = await Delivery.findAll({
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
  });

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

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newCategory = await Category.create({
    nameEN,
    nameAR,
    nameKUR,
    image: req.files.image[0].filename,
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

  if (req.files.image !== undefined) {
    await category.update({ ...others, image: req.files.image[0].filename });
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

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newSubCategory = await SubCategory.create({
    nameEN,
    nameAR,
    nameKUR,
    image: req.files.image[0].filename,
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
    include: { model: Category },
  });

  if (!subCategory) throw serverErrs.BAD_REQUEST("subCategory not found");

  if (req.files.image !== undefined) {
    await subCategory.update({ ...others, image: req.files.image[0].filename });
  } else {
    await subCategory.update({ ...others });
  }

  res.send({
    status: 201,
    data: subCategory,
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
  const messages = await Message.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  res.send({
    status: 200,
    messages,
    msg: "get all messages successfully",
  });
};

// Banner requests
const addBanner = async (req, res) => {
  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newBanner = await Image.create(
    {
      image: req.files.image[0].filename,
      AdminId: req.user.userId,
    },
    {
      returning: true,
    }
  );

  await newBanner.save();

  res.send({
    status: 201,
    newBanner,
    msg: "Banner added successfully",
  });
};
const editBanner = async (req, res) => {
  await validateEditBanner.validate(req.body);

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const { BannerId } = req.body;

  const banner = await Image.findOne({
    where: { id: BannerId, AdminId: req.user.userId },
  });

  if (!banner) throw serverErrs.BAD_REQUEST("banner not found");

  await banner.update({ image: req.files.image[0].filename });

  res.send({
    status: 201,
    banner,
    msg: "Banner updated successfully",
  });
};
const deleteBanner = async (req, res) => {
  await validateDeleteBanner.validate(req.body);

  const { BannerId } = req.body;

  const banner = await Image.findOne({
    where: { id: BannerId, AdminId: req.user.userId },
  });

  if (!banner) throw serverErrs.BAD_REQUEST("banner not found");

  await banner.destroy();

  res.send({
    status: 201,
    msg: "banner deleted successfully",
  });
};
const getAllBanners = async (req, res) => {
  const banners = await Image.findAll({ where: { AdminId: req.user.userId } });

  res.send({
    status: 200,
    banners,
    msg: "get all banners successfully",
  });
};

// Social Media requests
const createSocialMedia = async (req, res) => {
  await validateCreateSocialMedia.validate(req.body);

  const { type, link } = req.body;

  if (Object.keys(req.files).length === 0)
    throw serverErrs.BAD_REQUEST("Icon not found");

  const newSocialMedia = await SocialMedia.create(
    {
      icon: req.files.image[0].filename,
      type,
      link,
    },
    {
      returning: true,
    }
  );

  res.send({
    status: 201,
    data: newSocialMedia,
    msg: "successful create new SocialMedia",
  });
};
const editSocialMedia = async (req, res) => {
  await validateEditSocialMedia.validate(req.body);

  const { SocialMediaId, ...others } = req.body;

  const socialMedia = await SocialMedia.findOne({
    where: { id: SocialMediaId },
  });

  if (!socialMedia) throw serverErrs.BAD_REQUEST("socialMedia not found");

  if (req.files.image !== undefined) {
    await socialMedia.update({ icon: req.files.image[0].filename, ...others });
  } else {
    await socialMedia.update({ ...others });
  }

  res.send({
    status: 201,
    data: socialMedia,
    msg: "successful update new SocialMedia",
  });
};
const deleteSocialMedia = async (req, res) => {
  await validateDeleteSocialMedia.validate(req.body);
  const { SocialMediaId } = req.body;
  const socialMedia = await SocialMedia.findOne({
    where: { id: SocialMediaId },
  });
  if (!socialMedia) throw serverErrs.BAD_REQUEST("socialMedia not found");

  await socialMedia.destroy();

  res.send({
    status: 201,
    msg: "successful delete SocialMedia",
  });
};
const getSocialMedia = async (req, res) => {
  const socialMedia = await SocialMedia.findAll();
  res.send({
    status: 200,
    data: socialMedia,
    msg: "successful get SocialMedia",
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
  addBanner,
  editBanner,
  deleteBanner,
  getAllBanners,
  createSocialMedia,
  editSocialMedia,
  deleteSocialMedia,
  getSocialMedia,
};
