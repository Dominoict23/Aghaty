const yup = require("yup");

const loginValidation = yup.object().shape({
  mobile: yup.string().required().min(12).max(15),
  password: yup.string().required().min(8).max(16),
});

// Product validation
const validateCreateProduct = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  descriptionEN: yup.string().required(),
  descriptionAR: yup.string().required(),
  descriptionKUR: yup.string().required(),
  price: yup.number().required(),
  availableAmount: yup.number().required(),
  limitAmount: yup.number().required(),
  discountPrice: yup.number().required(),
  SubCategoryId: yup.number().required(),
});
const validateEditProduct = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  descriptionEN: yup.string().optional(),
  descriptionAR: yup.string().optional(),
  descriptionKUR: yup.string().optional(),
  price: yup.number().optional(),
  availableAmount: yup.number().optional(),
  limitAmount: yup.number().optional(),
  discountPrice: yup.number().optional(),
  SubCategoryId: yup.number().optional(),
  ProductId: yup.number().required(),
});
const validateDeleteProduct = yup.object().shape({
  ProductId: yup.number().required(),
});

// Orders validation
const validateOrders = yup.object().shape({
  status: yup.string().required(),
});
const validateAddOrderPackage = yup.object().shape({
  senderName: yup.string().required(),
  senderAddress: yup.string().required(),
  senderMobile: yup.string().required(),
  receiverName: yup.string().required(),
  receiverAddress: yup.string().required(),
  receiverMobile: yup.string().required(),
  packageDescription: yup.string().required(),
  startLong: yup.number().required(),
  startLat: yup.number().required(),
  endLong: yup.number().required(),
  endLat: yup.number().required(),
});
const validateAddOrderDelivery = yup.object().shape({
  distance: yup.number().required(),
  price: yup.number().required(),
  startLong: yup.number().required(),
  startLat: yup.number().required(),
  endLong: yup.number().required(),
  endLat: yup.number().required(),
  type: yup.string().required(),
});
const validateAcceptRejectOrder = yup.object().shape({
  OrderId: yup.number().required(),
});

const validateEditStory = yup.object().shape({
  StoryId: yup.number().required(),
});
const validateDeleteStory = yup.object().shape({
  StoryId: yup.number().required(),
});

// Post validation
const validateCreatePost = yup.object().shape({
  text: yup.string().required(),
});
const validateEditPost = yup.object().shape({
  text: yup.string().optional(),
  count: yup.number().optional(),
  PostId: yup.number().required(),
});
const validateDeletePost = yup.object().shape({
  PostId: yup.number().required(),
});

// Like validation
const validateCreateLike = yup.object().shape({
  PostId: yup.number().required(),
});
const validateDeleteLike = yup.object().shape({
  PostId: yup.number().required(),
});
const validateFeedbackLike = yup.object().shape({
  FeedbackId: yup.number().required(),
});

// Comment validation
const validateCreateComment = yup.object().shape({
  text: yup.string().min(1).required(),
  PostId: yup.number().required(),
});
const validateCreateFeedbackComment = yup.object().shape({
  text: yup.string().min(1).required(),
  FeedbackId: yup.number().required(),
});
const validateEditComment = yup.object().shape({
  text: yup.string().min(1).required(),
  CommentId: yup.number().required(),
});
const validateDeleteFeedbackComment = yup.object().shape({
  CommentId: yup.number().required(),
});

// Service validation
const validateCreateService = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  descriptionEN: yup.string().required(),
  descriptionAR: yup.string().required(),
  descriptionKUR: yup.string().required(),
  priceFrom: yup.number().required(),
  priceTo: yup.number().required(),
});
const validateEditService = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  descriptionEN: yup.string().optional(),
  descriptionAR: yup.string().optional(),
  descriptionKUR: yup.string().optional(),
  priceFrom: yup.number().optional(),
  priceTo: yup.number().optional(),
  ServiceId: yup.number().required(),
});
const validateDeleteService = yup.object().shape({
  ServiceId: yup.number().required(),
});
const validateAddServiceOrder = yup.object().shape({
  username: yup.string().required(),
  location: yup.string().required(),
  mobile: yup.string().required(),
  serviceDescription: yup.string().required(),
  SellerId: yup.number().required(),
});

// Seller validation
const validateAddSeller = yup.object().shape({
  mobile: yup.string().required().min(12).max(15),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  password: yup.string().required().min(8).max(16),
  role: yup.string().required(),
  serviceType: yup.string().optional(),
  address: yup.string().required(),
  CategoryId: yup.number().required(),
});
const validateEditSeller = yup.object().shape({
  mobile: yup.string().optional().min(12).max(15),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  password: yup.string().optional().min(8).max(16),
  role: yup.string().optional(),
  serviceType: yup.string().optional(),
  address: yup.string().optional(),
  CategoryId: yup.number().optional(),
  SellerId: yup.number().required(),
});
const validateDeleteSeller = yup.object().shape({
  SellerId: yup.number().required(),
});
const validateNearestSellers = yup.object().shape({
  CategoryId: yup.number().required(),
  SubCategoryId: yup.number().required(),
});
const validateHighRateSellers = yup.object().shape({
  CategoryId: yup.number().required(),
  SubCategoryId: yup.number().required(),
});
const validateHighOrderSellers = yup.object().shape({
  CategoryId: yup.number().required(),
  SubCategoryId: yup.number().required(),
});
const validateAllServiceSellers = yup.object().shape({
  CategoryId: yup.number().required(),
});

// Category validation
const validateAddCategory = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  role: yup.string().required().oneOf(["productSeller", "serviceSeller"]),
});
const validateEditCategory = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  role: yup.string().optional().oneOf(["productSeller", "serviceSeller"]),
  CategoryId: yup.number().required(),
});
const validateDeleteCategory = yup.object().shape({
  CategoryId: yup.number().required(),
});
const validateAllCategory = yup.object().shape({
  role: yup.string().required(),
});

// SubCategory validation
const validateAddSubCategory = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  CategoryId: yup.number().required(),
});
const validateEditSubCategory = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  deliveryPrice: yup.number().optional(),
  CategoryId: yup.number().required(),
  SubCategoryId: yup.number().required(),
});
const validateDeleteSubCategory = yup.object().shape({
  SubCategoryId: yup.number().required(),
});

// DiscountCode
const validateAddDiscountCode = yup.object().shape({
  code: yup.string().required().length(4),
  discount: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
});
const validateEditDiscountCode = yup.object().shape({
  code: yup.string().optional(),
  discount: yup.string().optional(),
  startDate: yup.string().optional(),
  endDate: yup.string().optional(),
  isEnable: yup.boolean().optional(),
  DiscountCodeId: yup.number().required(),
});
const validateDeleteDiscountCode = yup.object().shape({
  DiscountCodeId: yup.number().required(),
});

// Delivery validation
const validateAddDelivery = yup.object().shape({
  mobile: yup.string().required().min(12).max(15),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  type: yup.string().required(),
  password: yup.string().required().min(8).max(16),
});

const validateEditDelivery = yup.object().shape({
  mobile: yup.string().optional().min(12).max(15),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  password: yup.string().optional().min(8).max(16),
  DeliveryId: yup.number().required(),
});
const validateDeleteDelivery = yup.object().shape({
  DeliveryId: yup.number().required(),
});

const validateDeliveriesBySubCategoryName = yup.object().shape({
  nameEN: yup.string().required(),
});

// Banner validations
const validateEditBanner = yup.object().shape({
  BannerId: yup.number().required(),
});
const validateDeleteBanner = yup.object().shape({
  BannerId: yup.number().required(),
});

// Location validations
const validateCreateLocation = yup.object().shape({
  name: yup.string().required(),
  city: yup.string().required(),
  street: yup.string().required(),
  buildNumber: yup.string().required(),
  long: yup.number().required(),
  lat: yup.number().required(),
});
const validateEditLocation = yup.object().shape({
  name: yup.string().optional(),
  city: yup.string().optional(),
  street: yup.string().optional(),
  buildNumber: yup.string().optional(),
  long: yup.number().optional(),
  lat: yup.number().optional(),
  isDefault: yup.number().optional(),
  LocationId: yup.number().required(),
});
const validateDeleteLocation = yup.object().shape({
  LocationId: yup.number().required(),
});

// SocialMedia validations
const validateCreateSocialMedia = yup.object().shape({
  type: yup.string().optional(),
  link: yup.string().required(),
});
const validateEditSocialMedia = yup.object().shape({
  type: yup.string().optional(),
  link: yup.string().optional(),
  SocialMediaId: yup.number().required(),
});
const validateDeleteSocialMedia = yup.object().shape({
  SocialMediaId: yup.number().required(),
});

// Message validations
const validateCreateMessage = yup.object().shape({
  name: yup.string().required(),
  phone: yup.string().required(),
  msgBody: yup.string().required(),
});

// Rate validation
const validateAddRate = yup.object().shape({
  rate: yup.number().required(),
  FeedbackId: yup.number().required(),
});

module.exports = {
  loginValidation,
  validateCreateProduct,
  validateEditProduct,
  validateDeleteProduct,
  validateEditStory,
  validateDeleteStory,
  validateCreatePost,
  validateEditPost,
  validateDeletePost,
  validateCreateLike,
  validateDeleteLike,
  validateCreateComment,
  validateEditComment,
  validateCreateService,
  validateEditService,
  validateDeleteService,
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
  validateNearestSellers,
  validateCreateLocation,
  validateEditLocation,
  validateDeleteLocation,
  validateCreateSocialMedia,
  validateEditSocialMedia,
  validateDeleteSocialMedia,
  validateCreateMessage,
  validateAddRate,
  validateFeedbackLike,
  validateCreateFeedbackComment,
  validateDeleteFeedbackComment,
  validateAllCategory,
  validateAddServiceOrder,
  validateOrders,
  validateHighRateSellers,
  validateDeliveriesBySubCategoryName,
  validateAddOrderPackage,
  validateAddOrderDelivery,
  validateAcceptRejectOrder,
  validateAllServiceSellers,
  validateHighOrderSellers,
};
