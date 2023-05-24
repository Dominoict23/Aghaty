const { Op } = require("sequelize");
const { hash } = require("bcrypt");
const {
  User,
  Story,
  Seller,
  Image,
  Post,
  Like,
  Comment,
  Category,
  SubCategory,
} = require("../models");
const { serverErrs } = require("../middleware/customError");
const {
  validateEditComment,
  validateCreateLike,
  validateDeleteLike,
  validateCreateComment,
  validateNearestSellers,
} = require("../validation");

// Auth requests
const signup = async (req, res) => {
  const { mobile, password, firstName, lastName } = req.body;

  const user = await User.findOne({ where: { mobile } });

  if (user) throw serverErrs.BAD_REQUEST("user already exist");

  const hashedPassword = await hash(password, 12);

  const newUser = await User.create({
    mobile,
    password: hashedPassword,
    firstName,
    lastName,
    avatar: "avatar.png",
    cover: "cover.jpg",
    //TODO: generate random code and send it using twilio
    // verificationCode: code
  });

  const userWithoutPassword = newUser.toJSON();
  delete userWithoutPassword.password;
  delete userWithoutPassword.verificationCode;
  delete userWithoutPassword.createdAt;
  delete userWithoutPassword.updatedAt;

  res.send({
    status: 201,
    userWithoutPassword,
    msg: "successful signup user",
  });
};

// User requests
const editAvatar = async (req, res) => {
  const userFound = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!userFound) throw serverErrs.BAD_REQUEST("user not found! ");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("avatar not found");
  }

  await userFound.update({ avatar: req.file.filename });

  res.send({
    status: 201,
    avatar: req.file.filename,
    msg: "successful update avatar in user",
  });
};
const editCover = async (req, res) => {
  const userFound = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!userFound) throw serverErrs.BAD_REQUEST("user not found! ");

  if (!req.file) {
    throw serverErrs.BAD_REQUEST("cover not found");
  }

  await userFound.update({ cover: req.file.filename });

  res.send({
    status: 201,
    cover: req.file.filename,
    msg: "successful update cover in user",
  });
};

// Story
const getAllStories = async (req, res) => {
  const stories = await Story.findAll({
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

// Banners
const getAllBanners = async (req, res) => {
  const banners = await Image.findAll({
    where: {
      AdminId: {
        [Op.not]: null,
      },
    },
  });

  res.send({
    status: 200,
    banners,
    msg: "successful get all banners",
  });
};

// Posts
const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({
    include: [
      { model: Image },
      { model: Like },
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
      const likes = await post.getLikes();
      const hasLike = likes.some((like) => like.UserId == req.user.userId);
      await post.update({ isLike: hasLike });
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
      { model: Like },
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

  const likes = await post.getLikes();
  const hasLike = likes.some((like) => like.SellerId == req.user.userId);
  await post.update({ isLike: hasLike });

  res.send({
    status: 200,
    post,
    msg: "successful get single posts",
  });
};

// Like
const addLike = async (req, res) => {
  await validateCreateLike.validate(req.body);

  const { PostId } = req.body;

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

  const post = await Post.findOne({
    where: { id: PostId },
  });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found");

  const newLike = await Like.create(
    {
      PostId,
      UserId: req.user.userId,
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

  const { PostId } = req.body;

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found! ");

  const like = await Like.findOne({ PostId, UserId: req.user.userId });

  await like.destroy();

  await post.decrement("count", { by: 1 });

  res.send({
    status: 201,
    msg: "successful delete like from Post",
  });
};

// Comment
const addComment = async (req, res) => {
  await validateCreateComment.validate(req.body);

  const { PostId, text } = req.body;

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

  const post = await Post.findOne({
    where: { id: PostId },
  });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found");

  const newComment = await Comment.create(
    {
      text,
      PostId,
      UserId: req.user.userId,
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

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

  const { CommentId, text } = req.body;

  const comment = await Comment.findOne({
    where: { id: CommentId },
  });

  if (comment.UserId !== user.id)
    throw serverErrs.BAD_REQUEST("This comment not yours");

  await comment.update({ text });

  res.send({
    status: 201,
    msg: "successful edit comment",
  });
};

//Categories
const getAllCategory = async (req, res) => {
  const categories = await Category.findAll({
    where: { role: "productSeller" },
  });

  res.send({
    status: 200,
    categories,
    msg: "get all categories successfully",
  });
};

// SubCategories
const getAllSubCategories = async (req, res) => {
  const { CategoryId } = req.params;
  const subCategories = await SubCategory.findAll({
    where: { CategoryId },
    include: { model: Category },
  });

  res.send({
    status: 200,
    subCategories,
    msg: "get all subCategories successfully",
  });
};

// Seller
const getHighRateSellers = async (req, res) => {
  const { CategoryId } = req.params;
  const sellers = await Seller.findAll({
    where: { CategoryId },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
    order: [["rate", "DESC"]],
  });

  res.send({
    status: 200,
    sellers,
    msg: "get highest rate sellers successfully",
  });
};

const nearestSellers = async (req, res) => {
  const { CategoryId } = req.params;

  await validateNearestSellers.validate(req.body);

  const { long, lat } = req.body;
  // const { distance } = req.body;

  // const user = await User.findOne({
  //   where: {
  //     id: req.user.userId,
  //   },
  // });

  // if (!user) throw serverErrs.BAD_REQUEST("user not found");

  // if (!distance)
  //   throw serverErrs.BAD_REQUEST({
  //     arabic: "المسافة غير موجودة",
  //     english: "distance not found",
  //   });

  const sellers = await Seller.findAll({
    where: { CategoryId },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
  });

  const lon1 = long;
  const lat1 = lat;
  const result = [];
  sellers?.forEach((seller) => {
    const lon2 = seller.long;
    const lat2 = seller.lat;
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    if (d < 15 * 1000) {
      result.push(seller);
    }
    // if (d < distance * 1000) {
    //   result.push(seller);
    // }
  });

  res.send({
    status: 201,
    result,
    msg: "successful get sellers in 15 kilo meter",
  });
};

module.exports = {
  signup,
  editAvatar,
  editCover,
  getAllStories,
  getAllBanners,
  getSinglePosts,
  getAllPosts,
  addLike,
  deleteLike,
  addComment,
  editComment,
  getAllCategory,
  getAllSubCategories,
  getHighRateSellers,
  nearestSellers,
};
