const { Op } = require("sequelize");
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
  Video,
  User,
  Order,
  Live,
} = require("../models");
const {
  validateCreateService,
  validateCreateLike,
  validateCreateComment,
  validateEditService,
  validateDeleteService,
  validateEditStory,
  validateDeleteStory,
  validateEditPost,
  validateDeletePost,
  validateDeleteLike,
  validateEditComment,
  validateOrders,
  validateAcceptRejectOrder,
} = require("../validation");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
ffmpeg.setFfmpegPath(path.join(__dirname, "..", "ffmpeg", "bin", "ffmpeg.exe"));

// Service requests
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

  if (Object.keys(req.files).length === 0)
    throw serverErrs.BAD_REQUEST("Image not found");

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
      image: req.files.image[0].filename,
      ServiceId: newService.id,
    },
    {
      returning: true,
    }
  );

  await newService.save();

  await newImage.save();

  const result = await Service.findOne({
    where: { id: newService.id },
    include: [
      { model: Image },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 201,
    data: result,
    msg: "successful create new service",
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

  if (req.files.image !== undefined) {
    const imageFound = await Image.findOne({ where: { ServiceId } });

    if (!imageFound)
      throw serverErrs.BAD_REQUEST("image for this service not found! ");

    await imageFound.update({ image: req.files.image[0].filename });
  }

  const result = await Service.findOne({
    where: { id: service.id },
    include: [
      { model: Image },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 201,
    data: result,
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
    include: [
      { model: Image },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 200,
    services,
    msg: "successful get seller all products",
  });
};

// Story requests
const addStory = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  const storyFound = await Story.findOne({
    where: { SellerId: serviceSeller.id },
    include: {
      model: Seller,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  if (storyFound?.image) {
    clearImage(storyFound.image);
    await storyFound.update({ image: req.files.image[0].filename });
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
      image: req.files.image[0].filename,
      SellerId: serviceSeller.id,
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
      where: { SellerId: serviceSeller.id },
      include: {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    });
    return res.send({
      status: 201,
      data: result,
      msg: "successful create new Story",
    });
  }
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

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("Image not found");
  }

  await story.update({ image: req.files.image[0].filename });

  const deletionTime = new Date();
  deletionTime.setHours(deletionTime.getHours() + 24);

  // Schedule the story deletion
  setTimeout(async () => {
    await Story.destroy({ where: { id: story.id } });
  }, deletionTime - new Date());

  const result = await Story.findOne({
    where: { id: story.id },
    include: {
      model: Seller,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });
  res.send({
    status: 201,
    data: result,
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
const getAllStories = async (req, res) => {
  const stories = await Story.findAll({
    where: {
      SellerId: {
        [Op.not]: req.user.userId,
      },
    },
    include: {
      model: Seller,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  res.send({
    status: 200,
    stories,
    msg: "successful get all stories",
  });
};
const getSellerStories = async (req, res) => {
  const stories = await Story.findAll({
    where: { SellerId: req.user.userId },
    include: {
      model: Seller,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  res.send({
    status: 200,
    stories,
    msg: "successful get all stories for me",
  });
};

// Post requests
const addPost = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  const { text, roomID } = req.body;

  let newPost;
  if (text) {
    newPost = await Post.create(
      {
        text,
        SellerId: serviceSeller.id,
      },
      {
        returning: true,
      }
    );
  } else {
    newPost = await Post.create(
      {
        SellerId: serviceSeller.id,
      },
      {
        returning: true,
      }
    );
  }
  await newPost.save();

  if (roomID) {
    const newLive = await Live.create(
      {
        roomID,
        PostId: newPost.id,
      },
      {
        returning: true,
      }
    );
    await newLive.save();
  }

  if (Object.keys(req.files).length !== 0) {
    if (req.files.image !== undefined) {
      const newImage = await Image.create(
        {
          image: req.files.image[0].filename,
          PostId: newPost.id,
        },
        {
          returning: true,
        }
      );
      await newImage.save();
    }
    if (req.files.video !== undefined) {
      const newVideo = await Video.create({
        video: req.files.video[0].filename,
        PostId: newPost.id,
      });
      await newVideo.save();

      // take screenshot from the video
      const videoPath = `uploads/${req.files.video[0].filename}`;
      const timestamp = "00:00:05";
      const outputImagePath = `uploads`;
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          folder: outputImagePath,
          filename: `screenshot_${newVideo.id}.jpg`,
        })
        .on("end", async () => {
          await Image.create(
            {
              image: `screenshot_${newVideo.id}.jpg`,
              PostId: newPost.id,
            },
            {
              returning: true,
            }
          );
        })
        .on("error", (err) => {
          console.error("Error capturing screenshot:", err);
        });
    }
  }

  const result = await Post.findOne({
    where: { id: newPost.id },
    include: [
      { model: Image },
      { model: Video },
      { model: Like },
      { model: Live },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Seller,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const hasVideo = Object.values(await result?.getVideos()).length !== 0;
  const hasLive = Object.values(await result?.getLives()).length !== 0;
  await result.update({ hasVideo, hasLive });

  res.send({
    status: 201,
    data: result,
    msg: "successful create new Post",
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

  if (Object.keys(req.files).length !== 0) {
    if (req.files.image !== undefined) {
      const imageFound = await Image.findOne({ where: { PostId } });

      if (!imageFound)
        throw serverErrs.BAD_REQUEST("image for this post not found! ");

      await imageFound.update({ image: req.files.image[0].filename });
    } else if (req.files.video !== undefined) {
      const videoFound = await Video.findOne({ where: { PostId } });

      if (!videoFound)
        throw serverErrs.BAD_REQUEST("video for this post not found! ");

      await videoFound.update({ video: req.files.video[0].filename });

      const videoImageFound = await Image.findOne({ where: { PostId } });

      // take screenshot from the video
      const videoPath = `uploads/${videoFound.video}`;
      const timestamp = "00:00:05";
      const outputImagePath = `uploads`;
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          folder: outputImagePath,
          filename: `screenshot_${videoFound.id}.jpg`,
        })
        .on("end", async () => {
          await videoImageFound.update({
            image: `screenshot_${videoFound.id}.jpg`,
          });
        })
        .on("error", (err) => {
          console.error("Error capturing screenshot:", err);
        });
    }
  }
  const result = await Post.findOne({
    where: { id: post.id },
    include: [
      { model: Image },
      { model: Video },
      { model: Like },
      { model: Live },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Seller,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const hasVideo = Object.values(await result?.getVideos()).length !== 0;
  const hasLive = Object.values(await result?.getLives()).length !== 0;
  await result.update({ hasVideo, hasLive });

  res.send({
    status: 201,
    data: result,
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

  const videoFound = await Video.findOne({ where: { PostId } });

  const liveFound = await Live.findOne({ where: { PostId } });

  await post.destroy();

  if (imageFound) await imageFound.destroy();
  if (videoFound) await videoFound.destroy();
  if (liveFound) await liveFound.destroy();

  res.send({
    status: 201,
    msg: "successful delete post",
  });
};
const getAllPosts = async (req, res) => {
  const { SellerId } = req.params;
  const posts = await Post.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: Image },
      { model: Video },
      { model: Like },
      { model: Live },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Seller,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  await Promise.all(
    posts.map(async (post) => {
      const likes = await post?.getLikes();
      const hasVideo = Object.values(await post?.getVideos()).length !== 0;
      const hasLive = Object.values(await post?.getLives()).length !== 0;
      const hasLike = likes?.some((like) => like.SellerId === +SellerId);
      await post?.update({ isLike: hasLike, hasVideo, hasLive });
    })
  );

  res.send({
    status: 200,
    posts,
    msg: "successful get all posts",
  });
};
const getSinglePosts = async (req, res) => {
  const { PostId } = req.params;
  const post = await Post.findOne({
    where: { id: PostId },
    include: [
      { model: Image },
      { model: Video },
      { model: Like },
      { model: Live },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Seller,
            attributes: {
              exclude: [
                "verificationCode",
                "password",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const likes = await post?.getLikes();
  const hasVideo = Object.values(await post?.getVideos()).length !== 0;
  const hasLive = Object.values(await post?.getLives()).length !== 0;
  const hasLike = likes?.some((like) => like.SellerId == req.user.userId);
  await post?.update({ isLike: hasLike, hasVideo, hasLive });

  res.send({
    status: 200,
    post,
    msg: "successful get single posts",
  });
};

// Like requests
const addLike = async (req, res) => {
  await validateCreateLike.validate(req.body);

  const { PostId } = req.body;

  const seller = await Seller.findOne({
    where: { id: req.user.userId },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Seller not found");

  const post = await Post.findOne({
    where: { id: PostId },
  });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found");
  const like = await Like.findOne({ where: { PostId, SellerId: seller.id } });
  if (!like) {
    const newLike = await Like.create(
      {
        PostId,
        SellerId: req.user.userId,
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
  } else {
    res.send({
      status: 201,
      msg: "like is already exist for this Post",
    });
  }
};
const deleteLike = async (req, res) => {
  await validateDeleteLike.validate(req.body);

  const { PostId } = req.body;

  const seller = await Seller.findOne({
    where: { id: req.user.userId },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Seller not found");

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found! ");

  const like = await Like.findOne({ PostId, SellerId: req.user.userId });

  if (!like) throw serverErrs.BAD_REQUEST("like not found");

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

  const { PostId, text } = req.body;

  const seller = await Seller.findOne({
    where: { id: req.user.userId },
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
      SellerId: req.user.userId,
    },
    {
      returning: true,
    }
  );

  await newComment.save();

  const result = await Comment.findOne({
    where: { id: newComment.id },
    include: {
      model: User,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  res.send({
    status: 201,
    data: result,
    msg: "successful add comment to Post",
  });
};
const editComment = async (req, res) => {
  await validateEditComment.validate(req.body);

  const seller = await Seller.findOne({
    where: { id: req.user.userId },
  });

  if (!seller) throw serverErrs.BAD_REQUEST("Seller not found");

  const { CommentId, text } = req.body;

  const comment = await Comment.findOne({
    where: { id: CommentId },
    include: {
      model: User,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  if (comment.SellerId !== seller.id)
    throw serverErrs.BAD_REQUEST("This comment not yours");

  await comment.update({ text });

  res.send({
    status: 201,
    data: comment,
    msg: "successful edit comment",
  });
};

// Seller requests
const editAvatar = async (req, res) => {
  const { ServiceSellerId } = req.params;

  const serviceSeller = await Seller.findOne({
    where: { id: ServiceSellerId },
  });

  if (!serviceSeller) throw serverErrs.BAD_REQUEST("Invalid ServiceSellerId! ");

  if (serviceSeller.id != req.user.userId)
    //NOTE: The id of the seller provided not the one that has permission
    throw serverErrs.BAD_REQUEST("No Auth");

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("avatar not found");
  }

  await serviceSeller.update({ avatar: req.files.image[0].filename });

  res.send({
    status: 201,
    avatar: req.files.image[0].filename,
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

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("cover not found");
  }

  await serviceSeller.update({ cover: req.files.image[0].filename });

  res.send({
    status: 201,
    cover: req.files.image[0].filename,
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

const getServiceOrders = async (req, res) => {
  await validateOrders.validate(req.body);

  const { status } = req.body;

  let orders;

  if (status === "all") {
    orders = await Order.findAll({
      where: { SellerId: req.user.userId },
    });
  } else {
    orders = await Order.findAll({
      where: { SellerId: req.user.userId, status },
    });
  }

  res.send({
    status: 200,
    orders,
    msg: "successful get all Services orders",
  });
};

const acceptServiceOrder = async (req, res) => {
  await validateAcceptRejectOrder.validate(req.body);

  const { OrderId } = req.body;

  const orderFound = await Order.findOne({ where: { id: OrderId } });

  if (!orderFound) throw serverErrs.BAD_REQUEST("Order not found");

  await orderFound.update({ status: "ACCEPTED" });

  res.send({
    status: 201,
    msg: "successful accept service order",
  });
};

const rejectServiceOrder = async (req, res) => {
  await validateAcceptRejectOrder.validate(req.body);

  const { OrderId } = req.body;

  const orderFound = await Order.findOne({ where: { id: OrderId } });

  if (!orderFound) throw serverErrs.BAD_REQUEST("Order not found");

  await orderFound.update({ status: "REJECTED" });

  res.send({
    status: 201,
    msg: "successful reject service order",
  });
};

module.exports = {
  addService,
  editService,
  deleteService,
  getSellerServices,
  addStory,
  editStory,
  deleteStory,
  getAllStories,
  getSellerStories,
  addPost,
  editPost,
  deletePost,
  getSinglePosts,
  getAllPosts,
  addLike,
  deleteLike,
  addComment,
  editComment,
  editAvatar,
  editCover,
  getAllSubCategory,
  getServiceOrders,
  acceptServiceOrder,
  rejectServiceOrder,
};
