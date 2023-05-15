const { serverErrs } = require("../middleware/customError");
const {
  Seller,
  Product,
  Story,
  Post,
  Image,
  Like,
  Comment,
} = require("../models");
const {
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
} = require("../validation");

// TODO Later: get product orders (4 filters)??
// TODO Later: get product order specific??

const addStory = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { image } = req.body;

  await validateCreateStory.validate(req.body);

  const newStory = await Story.create(
    {
      image,
      SellerId: productSeller.id,
    },
    {
      returning: true,
    }
  );

  await newStory.save();

  res.send({
    status: 201,
    data: newStory,
    msg: "successful create new Story",
  });
};

const editStory = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateEditStory.validate(req.body);
  // TODO: put strict in validate
  if (Object.keys(req.body).length <= 1)
    throw serverErrs.BAD_REQUEST("body is empty nothing to edit");

  const { image, StoryId } = req.body;

  const story = await Story.findOne({ where: { id: StoryId } });

  if (!story) throw serverErrs.BAD_REQUEST("Story not found!");

  await story.update({ image });

  res.send({
    status: 201,
    data: story,
    msg: "successful edit Story",
  });
};

const deleteStory = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateDeleteStory.validate(req.body);

  const { StoryId } = req.body;

  const story = await Story.findOne({ where: { id: StoryId } });

  if (!story) throw serverErrs.BAD_REQUEST("Story not found! ");

  await story.destroy();

  res.send({
    status: 201,
    msg: "successful delete story",
  });
};

const getAllStories = async (req, res) => {
  const stories = await Story.findAll();

  res.send({
    status: 200,
    stories,
    msg: "successful get all stories",
  });
};

const addPost = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateCreatePost.validate(req.body);

  const { text, image } = req.body;

  const newPost = await Post.create(
    {
      text,
      SellerId: productSeller.id,
    },
    {
      returning: true,
    }
  );

  const newImage = await Image.create(
    {
      image,
      PostId: newPost.id,
    },
    {
      returning: true,
    }
  );

  await newPost.save();

  await newImage.save();

  res.send({
    status: 201,
    msg: "successful create new Post",
  });
};

const editPost = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateEditPost.validate(req.body);
  // TODO: put strict in validate
  if (Object.keys(req.body).length <= 1)
    throw serverErrs.BAD_REQUEST("body is empty nothing to edit");

  const { image, PostId, ...others } = req.body;

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found!");

  await post.update({ ...others });

  if (image) {
    const imageFound = await Image.findOne({ where: { PostId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this post not found! ");

    await imageFound.update({ image });
  }

  res.send({
    status: 201,
    data: post,
    msg: "successful edit post",
  });
};

const deletePost = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateDeletePost.validate(req.body);

  const { PostId } = req.body;

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found! ");

  const imageFound = await Image.findOne({ where: { PostId } });

  if (!imageFound)
    throw serverErrs.BAD_REQUEST("image for this post not found! ");

  await post.destroy();

  await imageFound.destroy();

  res.send({
    status: 201,
    msg: "successful delete post",
  });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({
    include: [{ model: Image }, { model: Like }, { model: Comment }],
  });

  res.send({
    status: 200,
    posts,
    msg: "successful get all posts",
  });
};

const addLike = async (req, res) => {
  await validateCreateLike.validate(req.body);

  const { PostId, SellerId } = req.body;

  const seller = await Seller.findOne({
    where: { id: SellerId },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Seller not found");

  const post = await Post.findOne({
    where: { id: PostId },
  });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found");

  const newLike = await Like.create(
    {
      PostId,
      SellerId,
    },
    {
      returning: true,
    }
  );

  await newLike.save();

  await post.increment("count", { by: 1 });

  res.send({
    status: 201,
    msg: "successful add like to Post",
  });
};

const deleteLike = async (req, res) => {
  await validateDeleteLike.validate(req.body);

  const { PostId, SellerId } = req.body;

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found! ");

  const like = await Like.findOne({ PostId, SellerId });
  await like.destroy();

  await post.decrement("count", { by: 1 });

  res.send({
    status: 201,
    msg: "successful delete like from Post",
  });
};

const addComment = async (req, res) => {
  await validateCreateComment.validate(req.body);

  const { PostId, SellerId, text } = req.body;

  const seller = await Seller.findOne({
    where: { id: SellerId },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Seller not found");

  const post = await Post.findOne({
    where: { id: PostId },
  });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found");

  const newComment = await Comment.create(
    {
      text,
      PostId,
      SellerId,
    },
    {
      returning: true,
    }
  );

  await newComment.save();

  res.send({
    status: 201,
    msg: "successful add comment to Post",
  });
};

const editComment = async (req, res) => {
  await validateEditComment.validate(req.body);

  const { CommentId, text } = req.body;

  const comment = await Comment.findOne({
    where: { id: CommentId },
  });

  await comment.update({ text });

  res.send({
    status: 201,
    msg: "successful edit comment",
  });
};

const editAvatar = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { avatar } = req.body;

  if (!avatar?.length > 0)
    throw serverErrs.BAD_REQUEST("please provide avatar image");

  await productSeller.update({ avatar });

  res.send({
    status: 201,
    msg: "successful update avatar in seller",
  });
};

const editCover = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { cover } = req.body;

  if (!cover?.length > 0)
    throw serverErrs.BAD_REQUEST("please provide cover image");

  await productSeller.update({ cover });

  res.send({
    status: 201,
    msg: "successful update cover in seller",
  });
};

const addProduct = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const {
    nameAR,
    nameEN,
    nameKUR,
    description,
    price,
    availableAmount,
    limitAmount,
    discountPrice,
    image,
    SubCategoryId,
  } = req.body;

  await validateCreateProduct.validate({
    nameAR,
    nameEN,
    nameKUR,
    description,
    price,
    availableAmount,
    limitAmount,
    discountPrice,
    image,
    SubCategoryId,
  });

  const newProduct = await Product.create(
    {
      nameAR,
      nameEN,
      nameKUR,
      description,
      price,
      availableAmount,
      limitAmount,
      discountPrice,
      SubCategoryId,
      SellerId: productSeller.id,
    },
    {
      returning: true,
    }
  );

  const newImage = await Image.create(
    {
      image,
      ProductId: newProduct.id,
    },
    {
      returning: true,
    }
  );

  await newProduct.save();

  await newImage.save();

  res.send({
    status: 201,
    msg: "successful create new product",
  });
};

const editProduct = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateEditProduct.validate(req.body);
  // TODO: put strict in validate
  if (Object.keys(req.body).length <= 1)
    throw serverErrs.BAD_REQUEST("body is empty nothing to edit");

  const { image, ProductId, ...others } = req.body;

  const product = await Product.findOne({ where: { id: ProductId } });

  if (!product) throw serverErrs.BAD_REQUEST("Product not found! ");

  await product.update({ ...others });

  if (image) {
    const imageFound = await Image.findOne({ where: { ProductId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this product not found! ");

    await imageFound.update({ image });
  }

  res.send({
    status: 201,
    msg: "successful update product",
  });
};

const deleteProduct = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateDeleteProduct.validate(req.body);

  const { ProductId } = req.body;

  const product = await Product.findOne({ where: { id: ProductId } });

  if (!product) throw serverErrs.BAD_REQUEST("Product not found! ");

  const imageFound = await Image.findOne({ where: { ProductId } });

  if (!imageFound)
    throw serverErrs.BAD_REQUEST("image for this product not found! ");

  await product.destroy();

  await imageFound.destroy();

  res.send({
    status: 201,
    msg: "successful delete product",
  });
};

const getSellerProducts = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const products = await Product.findAll({
    where: { SellerId: ProductSellerId },
    include: { model: Image },
  });

  res.send({
    status: 200,
    products,
    msg: "successful get seller all products",
  });
};

module.exports = {
  addProduct,
  addStory,
  addPost,
  addLike,
  addComment,
  editAvatar,
  editCover,
  editProduct,
  deleteProduct,
  getSellerProducts,
  editStory,
  deleteStory,
  editPost,
  deletePost,
  getAllPosts,
  getAllStories,
  deleteLike,
  editComment,
};
