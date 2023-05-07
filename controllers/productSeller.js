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

// TODO: edit and delete posts, stories, likes, comments??
//TODO:  name of product not unique

// TODO Later: get product orders (4 filters)??
// TODO Later: get product order specific??

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
    name,
    description,
    price,
    availableAmount,
    limitAmount,
    discountPrice,
    image,
    SubCategoryId,
  } = req.body;

  if (!name || !description || !image || !SubCategoryId)
    throw serverErrs.BAD_REQUEST("Please all product data");

  const productWithName = await Product.findOne({ where: { name } });

  if (productWithName)
    throw serverErrs.BAD_REQUEST("Product name should be unique");

  const newProduct = await Product.create(
    {
      name,
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

  if (!image)
    throw serverErrs.BAD_REQUEST("Please provide image for the story");

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

const addPost = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { text, image } = req.body;

  if (!image || !text)
    throw serverErrs.BAD_REQUEST("Please provide image and text for the post");

  const newPost = await Post.create(
    {
      text,
      SellerId: productSeller.id,
    },
    {
      returning: true,
    }
  );

  await newPost.save();

  const newImage = await Image.create(
    {
      image,
      PostId: newPost.id,
    },
    {
      returning: true,
    }
  );

  await newImage.save();

  res.send({
    status: 201,
    msg: "successful create new Post",
  });
};

const addLike = async (req, res) => {
  const { PostId, SellerId } = req.body;

  if (!PostId || !SellerId)
    throw serverErrs.BAD_REQUEST("Please provide post and seller Ids");

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

const addComment = async (req, res) => {
  const { PostId, SellerId, text } = req.body;

  if (!text?.length > 0 || !PostId || !SellerId)
    throw serverErrs.BAD_REQUEST(
      "Please enter comment text and seller, post Ids"
    );

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

const editProduct = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { image, ProductId, name, ...others } = req.body;

  if (!ProductId) throw serverErrs.BAD_REQUEST("Please provide ProductId");

  if (Object.keys(req.body).length <= 1)
    throw serverErrs.BAD_REQUEST("body is empty nothing to edit");

  const product = await Product.findOne({ where: { id: ProductId } });

  if (!product) throw serverErrs.BAD_REQUEST("Product not found! ");

  if (name) {
    const productWithName = await Product.findOne({ where: { name } });

    if (productWithName)
      throw serverErrs.BAD_REQUEST("Product name should be unique");

    await product.update({ ...others, name });
  } else {
    await product.update({ ...others });
  }

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

  const { ProductId } = req.body;

  if (!ProductId) throw serverErrs.BAD_REQUEST("Please provide ProductId");

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
};
