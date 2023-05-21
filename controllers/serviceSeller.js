const clearImage = require("../middleware/clearImage");
const { serverErrs } = require("../middleware/customError");
const {
  Seller,
  Story,
  Post,
  Image,
  Like,
  Comment,
  Service,
  SubCategory,
} = require("../models");
const {
  validateCreateService,
  validateCreateLike,
  validateCreatePost,
  validateCreateComment,
  validateEditService,
  validateDeleteService,
  validateEditStory,
  validateDeleteStory,
  validateEditPost,
  validateDeletePost,
  validateDeleteLike,
  validateEditComment,
} = require("../validation");

const addService = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const {
    nameAR,
    nameEN,
    nameKUR,
    descriptionEN,
    descriptionAR,
    descriptionKUR,
    priceFrom,
    priceTo,
  } = req.body;

  await validateCreateService.validate({
    nameAR,
    nameEN,
    nameKUR,
    descriptionEN,
    descriptionAR,
    descriptionKUR,
    priceFrom,
    priceTo,
  });

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newService = await Service.create(
    {
      nameAR,
      nameEN,
      nameKUR,
      descriptionEN,
      descriptionAR,
      descriptionKUR,
      priceFrom,
      priceTo,
      SellerId: serviceSeller.id,
    },
    {
      returning: true,
    }
  );

  const newImage = await Image.create(
    {
      image: req.file.filename,
      ServiceId: newService.id,
    },
    {
      returning: true,
    }
  );

  await newService.save();

  await newImage.save();

  res.send({
    status: 201,
    msg: "successful create new service",
  });
};

const addStory = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const storyFound = await Story.findOne({
    where: { SellerId: serviceSeller.id },
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
    const newStory = await Story.create(
      {
        image: req.file.filename,
        SellerId: serviceSeller.id,
      },
      {
        returning: true,
      }
    );
    await newStory.save();
    // Set the deletion time to 24 hours from now
    const deletionTime = new Date();
    deletionTime.setHours(deletionTime.getHours() + 24);

    // Schedule the story deletion
    setTimeout(async () => {
      await Story.destroy({ where: { id: newStory.id } });
    }, deletionTime - new Date());

    return res.send({
      status: 201,
      data: newStory,
      msg: "successful create new Story",
    });
  }
};

const addPost = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateCreatePost.validate(req.body);

  const { text } = req.body;

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const newPost = await Post.create(
    {
      text,
      SellerId: serviceSeller.id,
    },
    {
      returning: true,
    }
  );

  const newImage = await Image.create(
    {
      image: req.file.filename,
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

const editAvatar = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("avatar not found");
  }

  await serviceSeller.update({ avatar: req.file.filename });

  res.send({
    status: 201,
    avatar: req.file.filename,
    msg: "successful update avatar in seller",
  });
};

const editCover = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("cover not found");
  }

  await serviceSeller.update({ cover: req.file.filename });

  res.send({
    status: 201,
    cover: req.file.filename,
    msg: "successful update cover in seller",
  });
};

const editService = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateEditService.validate(req.body);

  const { ServiceId, ...others } = req.body;

  if (!ServiceId) throw serverErrs.BAD_REQUEST("Please provide ServiceId");

  const service = await Service.findOne({ where: { id: ServiceId } });

  if (!service) throw serverErrs.BAD_REQUEST("Service not found!");

  await service.update({ ...others });

  if (req.file) {
    const imageFound = await Image.findOne({ where: { ServiceId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this service not found! ");

    await imageFound.update({ image: req.file.filename });
  }

  res.send({
    status: 201,
    msg: "successful update service",
  });
};

const deleteService = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateDeleteService.validate(req.body);

  const { ServiceId } = req.body;

  const service = await Service.findOne({ where: { id: ServiceId } });

  if (!service) throw serverErrs.BAD_REQUEST("Service not found! ");

  const imageFound = await Image.findOne({ where: { ServiceId } });

  if (!imageFound)
    throw serverErrs.BAD_REQUEST("image for this service not found! ");

  await service.destroy();

  await imageFound.destroy();

  res.send({
    status: 201,
    msg: "successful delete service",
  });
};

const getSellerServices = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid serviceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const services = await Service.findAll({
    where: { SellerId: ServiceSellerId },
    include: { model: Image },
  });

  res.send({
    status: 200,
    services,
    msg: "successful get seller all products",
  });
};

const editStory = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid serviceSellerId! ");

  if (serviceSeller.id != req.user.userId)
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

  res.send({
    status: 201,
    data: story,
    msg: "successful edit Story",
  });
};

const deleteStory = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid serviceSellerId! ");

  if (serviceSeller.id != req.user.userId)
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

const editPost = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid serviceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  await validateEditPost.validate(req.body);

  const { PostId, ...others } = req.body;

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found!");

  await post.update({ ...others });

  if (req.file) {
    const imageFound = await Image.findOne({ where: { PostId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this post not found! ");

    await imageFound.update({ image: req.file.filename });
  }

  res.send({
    status: 201,
    data: post,
    msg: "successful edit post",
  });
};

const deletePost = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
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

const getAllStories = async (req, res) => {
  const stories = await Story.findAll({ include: { model: Seller } });

  res.send({
    status: 200,
    stories,
    msg: "successful get all stories",
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

module.exports = {
  addService,
  addStory,
  addPost,
  addLike,
  addComment,
  editAvatar,
  editCover,
  editService,
  deleteService,
  getSellerServices,
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
