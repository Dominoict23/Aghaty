const clearImage = require("../middleware/clearImage");
const { serverErrs } = require("../middleware/customError");
const {
  Seller,
  Product,
  Story,
  Post,
  Image,
  Like,
  Comment,
  SubCategory,
  Video,
} = require("../models");
const {
  validateCreateProduct,
  validateEditProduct,
  validateDeleteProduct,
  validateEditStory,
  validateDeleteStory,
  validateEditPost,
  validateDeletePost,
  validateCreateLike,
  validateDeleteLike,
  validateCreateComment,
  validateEditComment,
} = require("../validation");

// TODO Later: get product orders (4 filters)??
// TODO Later: get product order specific??

// Story requests
const addStory = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const storyFound = await Story.findOne({
    where: { SellerId: productSeller.id },
    include: { model: Seller },
  });

  if (storyFound?.image) {
    clearImage(storyFound.image);
    await storyFound.update({ image: req.file.filename });
    // Set the deletion time to 24 hours from now
    const deletionTime = new Date();
    deletionTime.setHours(deletionTime.getHours() + 24);

    // Schedule the story deletion
    setTimeout(async () => {
      await Story.destroy({ where: { id: storyFound.id } });
    }, deletionTime - new Date());

    return res.send({
      status: 201,
      data: storyFound,
      msg: "successful create new Story",
    });
  } else {
    const newStory = await Story.create({
      image: req.file.filename,
      SellerId: productSeller.id,
    });
    await newStory.save();
    // Set the deletion time to 24 hours from now
    const deletionTime = new Date();
    deletionTime.setHours(deletionTime.getHours() + 24);

    // Schedule the story deletion
    setTimeout(async () => {
      await Story.destroy({ where: { id: newStory.id } });
    }, deletionTime - new Date());
    const result = await Story.findOne({
      where: { SellerId: productSeller.id },
      include: { model: Seller },
    });
    return res.send({
      status: 201,
      data: result,
      msg: "successful create new Story",
    });
  }
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

  const { StoryId } = req.body;

  const story = await Story.findOne({ where: { id: StoryId } });

  if (!story) throw serverErrs.BAD_REQUEST("Story not found!");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  await story.update({ image: req.file.filename });

  const deletionTime = new Date();
  deletionTime.setHours(deletionTime.getHours() + 24);

  // Schedule the story deletion
  setTimeout(async () => {
    await Story.destroy({ where: { id: story.id } });
  }, deletionTime - new Date());

  const result = await Story.findOne({
    where: { id: story.id },
    include: { model: Seller },
  });
  res.send({
    status: 201,
    data: result,
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
  const stories = await Story.findAll({ include: { model: Seller } });

  res.send({
    status: 200,
    stories,
    msg: "successful get all stories",
  });
};

// Post requests
const addPost = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { text } = req.body;
  //ASK: Can seller send post with text only
  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Please send image or video");
  }
  let newPost;
  if (text) {
    newPost = await Post.create(
      {
        text,
        SellerId: productSeller.id,
      },
      {
        returning: true,
      }
    );
  } else {
    newPost = await Post.create(
      {
        SellerId: productSeller.id,
      },
      {
        returning: true,
      }
    );
  }
  await newPost.save();
  if (req.file.destination === "images") {
    const newImage = await Image.create(
      {
        image: req.file.filename,
        PostId: newPost.id,
      },
      {
        returning: true,
      }
    );
    await newImage.save();
  } else {
    const newVideo = await Video.create({
      video: req.file.filename,
      PostId: newPost.id,
    });
    await newVideo.save();
  }

  const result = await Post.findOne({
    where: { id: newPost.id },
    include: [
      { model: Image },
      { model: Like },
      { model: Comment },
      { model: Seller },
    ],
  });
  res.send({
    status: 201,
    data: result,
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

  const { PostId, ...others } = req.body;

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found!");

  await post.update({ ...others });

  if (req.file) {
    if (req.file.destination === "images") {
      const imageFound = await Image.findOne({ where: { PostId } });

      if (!imageFound)
        throw serverErrs.BAD_REQUEST("image for this post not found! ");

      await imageFound.update({ image: req.file.filename });
    } else {
      const videoFound = await Video.findOne({ where: { PostId } });

      if (!videoFound)
        throw serverErrs.BAD_REQUEST("video for this post not found! ");

      await videoFound.update({ video: req.file.filename });
    }
  }
  const result = await Post.findOne({
    where: { id: post.id },
    include: [
      { model: Image },
      { model: Like },
      { model: Comment },
      { model: Seller },
    ],
  });

  res.send({
    status: 201,
    data: result,
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
  const { SellerId } = req.params;
  const posts = await Post.findAll({
    include: [
      { model: Image },
      { model: Like },
      { model: Comment },
      { model: Seller },
    ],
  });

  await Promise.all(
    posts.map(async (post) => {
      const likes = await post.getLikes();
      const hasLike = likes.some((like) => like.SellerId === +SellerId);
      console.log({ hasLike });
      await post.update({ isLike: hasLike });
    })
  );

  res.send({
    status: 200,
    posts,
    msg: "successful get all posts",
  });
};

// Like requests
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

// Comment requests
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

// Seller requests
const editAvatar = async (req, res) => {
  const { ProductSellerId } = req.params;

  const productSeller = await Seller.findOne({
    where: { id: ProductSellerId },
  });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Invalid ProductSellerId! ");

  if (productSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("avatar not found");
  }

  await productSeller.update({ avatar: req.file.filename });

  res.send({
    status: 201,
    avatar: req.file.filename,
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

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("cover not found");
  }

  await productSeller.update({ cover: req.file.filename });

  res.send({
    status: 201,
    cover: req.file.filename,
    msg: "successful update cover in seller",
  });
};
const getAllSubCategory = async (req, res) => {
  const subCategories = await SubCategory.findAll({
    attributes: ["id", "nameEN", "nameAR", "nameKUR"],
  });

  res.send({
    status: 200,
    subCategories,
    msg: "get all subCategories successfully",
  });
};

// Product requests
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
    descriptionEN,
    descriptionAR,
    descriptionKUR,
    price,
    availableAmount,
    limitAmount,
    discountPrice,
    SubCategoryId,
  } = req.body;

  await validateCreateProduct.validate({
    nameAR,
    nameEN,
    nameKUR,
    descriptionEN,
    descriptionAR,
    descriptionKUR,
    price,
    availableAmount,
    limitAmount,
    discountPrice,
    SubCategoryId,
  });

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newProduct = await Product.create(
    {
      nameAR,
      nameEN,
      nameKUR,
      descriptionEN,
      descriptionAR,
      descriptionKUR,
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
      image: req.file.filename,
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

  const { ProductId, ...others } = req.body;

  const product = await Product.findOne({ where: { id: ProductId } });

  if (!product) throw serverErrs.BAD_REQUEST("Product not found! ");

  await product.update({ ...others });

  if (req.file) {
    const imageFound = await Image.findOne({ where: { ProductId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this product not found! ");

    await imageFound.update({ image: req.file.filename });
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
  getAllSubCategory,
};
