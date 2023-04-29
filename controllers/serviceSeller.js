const { serverErrs } = require("../middleware/customError");
const {
  Seller,
  Story,
  Post,
  Image,
  Like,
  Comment,
  Service,
} = require("../models");

const addService = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { name, description, priceFrom, priceTo, image } = req.body;

  if (!name || !description || !image)
    throw serverErrs.BAD_REQUEST("Please all service data");

  //TODO: should the name of service not unique??

  // const serviceWithName = await Service.findOne({ where: { name } });
  // if (serviceWithName)
  //   throw serverErrs.BAD_REQUEST("Service name should be unique");

  const newService = await Service.create(
    {
      name,
      description,
      priceFrom,
      priceTo,
      SellerId: serviceSeller.id,
    },
    {
      returning: true,
    }
  );

  await newService.save();

  const newImage = await Image.create(
    {
      image,
      ServiceId: newService.id,
    },
    {
      returning: true,
    }
  );

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

  const { image } = req.body;

  if (!image)
    throw serverErrs.BAD_REQUEST("Please provide image for the story");

  const newStory = await Story.create(
    {
      image,
      SellerId: serviceSeller.id,
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
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { text, image } = req.body;

  if (!image || !text)
    throw serverErrs.BAD_REQUEST("Please provide image and text for the post");

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
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { avatar } = req.body;

  if (!avatar?.length > 0)
    throw serverErrs.BAD_REQUEST("please provide avatar image");

  await serviceSeller.update({ avatar });

  res.send({
    status: 201,
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

  const { cover } = req.body;

  if (!cover?.length > 0)
    throw serverErrs.BAD_REQUEST("please provide cover image");

  await serviceSeller.update({ cover });

  res.send({
    status: 201,
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

  const { image, ServiceId, ...others } = req.body;

  if (!ServiceId) throw serverErrs.BAD_REQUEST("Please provide ServiceId");

  const service = await Service.findOne({ where: { id: ServiceId } });

  if (!service) throw serverErrs.BAD_REQUEST("Service not found!");

  if (Object.keys(req.body).length <= 1)
    throw serverErrs.BAD_REQUEST("body is empty nothing");

  await service.update({ ...others });

  if (image) {
    const imageFound = await Image.findOne({ where: { ServiceId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this product not found! ");

    await imageFound.update({ image });
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

  const { ServiceId } = req.body;

  if (!ServiceId) throw serverErrs.BAD_REQUEST("Please provide ServiceId");

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
};
