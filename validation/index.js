const yup = require("yup");

const loginValidation = yup.object().shape({
  mobile: yup.string().required().min(12).max(15),
  password: yup.string().required().min(8).max(16),
});

const validateCreateProduct = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  availableAmount: yup.number().required(),
  limitAmount: yup.number().required(),
  discountPrice: yup.number().required(),
  image: yup.string().required(),
  SubCategoryId: yup.number().required(),
});

const validateEditProduct = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  description: yup.string().optional(),
  price: yup.number().optional(),
  availableAmount: yup.number().optional(),
  limitAmount: yup.number().optional(),
  discountPrice: yup.number().optional(),
  image: yup.string().optional(),
  SubCategoryId: yup.number().optional(),
  ProductId: yup.number().required(),
});

const validateDeleteProduct = yup.object().shape({
  ProductId: yup.number().required(),
});

const validateCreateStory = yup.object().shape({
  image: yup.string().required(),
});

const validateEditStory = yup.object().shape({
  image: yup.string().required(),
  StoryId: yup.number().required(),
});

const validateDeleteStory = yup.object().shape({
  StoryId: yup.number().required(),
});

const validateCreatePost = yup.object().shape({
  text: yup.string().required(),
  image: yup.string().required(),
});

const validateEditPost = yup.object().shape({
  text: yup.string().optional(),
  count: yup.number().optional(),
  image: yup.string().optional(),
  PostId: yup.number().required(),
});

const validateDeletePost = yup.object().shape({
  PostId: yup.number().required(),
});

const validateCreateLike = yup.object().shape({
  PostId: yup.number().required(),
  SellerId: yup.number().required(),
});

const validateDeleteLike = yup.object().shape({
  PostId: yup.number().required(),
  SellerId: yup.number().required(),
});

const validateCreateComment = yup.object().shape({
  text: yup.string().min(1).required(),
  PostId: yup.number().required(),
  SellerId: yup.number().required(),
});

const validateEditComment = yup.object().shape({
  text: yup.string().min(1).required(),
  CommentId: yup.number().required(),
});

const validateCreateService = yup.object().shape({
  nameAR: yup.string().required(),
  nameEN: yup.string().required(),
  nameKUR: yup.string().required(),
  description: yup.string().required(),
  priceFrom: yup.number().required(),
  priceTo: yup.number().required(),
  image: yup.string().required(),
});

const validateEditService = yup.object().shape({
  nameAR: yup.string().optional(),
  nameEN: yup.string().optional(),
  nameKUR: yup.string().optional(),
  description: yup.string().optional(),
  priceFrom: yup.number().optional(),
  priceTo: yup.number().optional(),
  image: yup.string().optional(),
  ServiceId: yup.number().required(),
});

const validateDeleteService = yup.object().shape({
  ServiceId: yup.number().required(),
});

module.exports = {
  loginValidation,
  validateCreateProduct,
  validateEditProduct,
  validateDeleteProduct,
  validateCreateStory,
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
};
