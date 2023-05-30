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
  Product,
  Cart,
  CartProduct,
  OrderProduct,
  Order,
  SocialMedia,
  UserLocation,
  Message,
  Location,
} = require("../models");
const { serverErrs } = require("../middleware/customError");
const {
  validateEditComment,
  validateCreateLike,
  validateDeleteLike,
  validateCreateComment,
  validateNearestSellers,
  validateCreateLocation,
  validateEditLocation,
  validateDeleteLocation,
  validateCreateMessage,
} = require("../validation");
const generateToken = require("../middleware/generateToken");

// Auth requests
const signup = async (req, res) => {
  const { mobile, password, firstName, lastName } = req.body;

  const user = await User.findOne({ where: { mobile } });

  if (user) throw serverErrs.BAD_REQUEST("user already exist");

  const hashedPassword = await hash(password, 12);

  const newUser = await User.create(
    {
      mobile,
      password: hashedPassword,
      firstName,
      lastName,
      avatar: "avatar.png",
      cover: "cover.jpg",
      //TODO: generate random code and send it using twilio
      // verificationCode: code
    },
    { returning: true }
  );

  const token = await generateToken({
    userId: newUser.id,
    name: newUser.name,
    role: "user",
  });

  const userWithoutPassword = newUser.toJSON();
  delete userWithoutPassword.password;
  delete userWithoutPassword.verificationCode;
  delete userWithoutPassword.createdAt;
  delete userWithoutPassword.updatedAt;

  res.send({
    status: 201,
    userWithoutPassword,
    token,
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
const getSellerSubCategories = async (req, res) => {
  const { SellerId } = req.params;
  const productSeller = await Seller.findOne({ where: { id: SellerId } });

  if (!productSeller) throw serverErrs.BAD_REQUEST("Seller not found");

  const subCategories = await SubCategory.findAll({
    where: {
      id: {
        [Op.in]: productSeller.subCategories,
      },
    },
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

// Products
const getProductsBySubId = async (req, res) => {
  const { SubCategoryId } = req.params;

  const products = await Product.findAll({
    where: { SubCategoryId, SellerId: req.user.userId },
    include: {
      model: Seller,
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
    },
  });

  res.send({
    status: 201,
    products,
    msg: "successful get products for this seller and subcategory",
  });
};

// Cart
const addToCart = async (req, res) => {
  let { products } = req.body;
  if (typeof products === "string") {
    products = JSON.parse(products);
  }

  let cart = await Cart.findOne({
    where: { UserId: req.user.userId },
  });

  if (cart) {
    await cart.update({ totalPrice: 0 });
    await CartProduct.destroy({ where: { CartId: cart.id } });
  } else {
    cart = await Cart.create({
      UserId: req.user.userId,
    });
    await cart.save();
  }

  products.map((product) => {
    product.CartId = cart.id;
  });
  await CartProduct.bulkCreate(products);

  const promises = products.map(async (product) => {
    const p = await Product.findOne({ where: { id: product.ProductId } });
    return product.quantity * p.price;
  });

  const totalPrice = (await Promise.all(promises)).reduce(
    (accumulator, price) => accumulator + price,
    0
  );
  await cart.update({ totalPrice });

  res.send({
    status: 201,
    msg: "successful add products to cart",
  });
};
const showCart = async (req, res) => {
  //TODO: locationId for user from body
  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("Cart for this user not exist");

  const products = await CartProduct.findAll({
    where: { CartId: cart.id },
    include: { model: Product },
  });

  //TODO: calculate delivery price from seller locationId and user locationId from body

  res.send({
    status: 200,
    products,
    totalPrice: cart.totalPrice,
    msg: "successful get products and total price for this user cart",
  });
};

// CartProduct
const decreaseQuantity = async (req, res) => {
  const { ProductId } = req.body;

  const cartProduct = await CartProduct.findOne({
    where: { ProductId },
    include: { model: Cart, where: { UserId: req.user.userId } },
  });

  if (!cartProduct) throw serverErrs.BAD_REQUEST("product not found on cart");

  await cartProduct.decrement("quantity", { by: 1 });

  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("Cart not found");

  const products = await CartProduct.findAll({ where: { CartId: cart.id } });

  const promises = products.map(async (product) => {
    const p = await Product.findOne({ where: { id: product.ProductId } });
    return product.quantity * p.price;
  });

  const totalPrice = (await Promise.all(promises)).reduce(
    (accumulator, price) => accumulator + price,
    0
  );
  await cart.update({ totalPrice });

  res.send({
    status: 201,
    totalPrice: cart.totalPrice,
    msg: "successful decrement quantity for this product",
  });
};
const increaseQuantity = async (req, res) => {
  const { ProductId } = req.body;

  const cartProduct = await CartProduct.findOne({
    where: { ProductId },
    include: { model: Cart, where: { UserId: req.user.userId } },
  });

  if (!cartProduct) throw serverErrs.BAD_REQUEST("product not found on cart");

  await cartProduct.increment("quantity", { by: 1 });

  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("Cart not found");

  const products = await CartProduct.findAll({ where: { CartId: cart.id } });

  const promises = products.map(async (product) => {
    const p = await Product.findOne({ where: { id: product.ProductId } });
    return product.quantity * p.price;
  });

  const totalPrice = (await Promise.all(promises)).reduce(
    (accumulator, price) => accumulator + price,
    0
  );
  await cart.update({ totalPrice });

  res.send({
    status: 201,
    totalPrice: cart.totalPrice,
    msg: "successful increment quantity for this product",
  });
};
const deleteCartProduct = async (req, res) => {
  const { ProductId } = req.body;

  const cartProduct = await CartProduct.findOne({
    where: { ProductId },
    include: { model: Cart, where: { UserId: req.user.userId } },
  });

  if (!cartProduct) throw serverErrs.BAD_REQUEST("product not found on cart");

  await cartProduct.destroy();

  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("Cart not found");

  const products = await CartProduct.findAll({});

  const promises = products.map(async (product) => {
    const p = await Product.findOne({ where: { id: product.ProductId } });
    return product.quantity * p.price;
  });

  const totalPrice = (await Promise.all(promises)).reduce(
    (accumulator, price) => accumulator + price,
    0
  );
  await cart.update({ totalPrice });

  res.send({
    status: 201,
    msg: "successful deleted product from cart",
  });
};

// Order
const addOrder = async (req, res) => {
  //TODO: locationId for user from body
  // TODO: handle discount code case
  // const {discountCode} = req.body;

  const count = await CartProduct.count({
    include: { model: Cart, where: { UserId: req.user.userId } },
  });

  if (count === 0)
    throw serverErrs.BAD_REQUEST(
      "there is no products in cart to order for this user"
    );

  // const newOrder = await Order.create({
  //   name,
  // })

  // const cartProducts = await CartProduct.findAll({
  //   include: { model: Cart, where: { UserId: req.user.userId } },
  // });

  // cartProducts.forEach(async (cartProduct) => {
  //   await OrderProduct.create({
  //     quantity: cartProduct.quantity,
  //     OrderId: ,
  //     ProductId: cartProduct.ProductId,
  //   });
  //   await cartProduct.destroy();
  // });
};

// Social Media
const getSocialMedia = async (req, res) => {
  const socialMedia = await SocialMedia.findAll();
  res.send({
    status: 200,
    data: socialMedia,
    msg: "successful get SocialMedia",
  });
};

// Message
const createMessage = async (req, res) => {
  await validateCreateMessage.validate(req.body);

  const { name, phone, msgBody } = req.body;

  await Message.create({
    name,
    phone,
    msgBody,
    UserId: req.user.userId,
  });

  res.send({
    status: 201,
    msg: "successful create new Message",
  });
};

// Location
const createLocation = async (req, res) => {
  await validateCreateLocation.validate(req.body);

  const { name, city, street, buildNumber, long, lat } = req.body;

  if (!req.file) throw serverErrs.BAD_REQUEST("image not found");

  const newLocation = await Location.create(
    {
      name,
      city,
      street,
      buildNumber,
      long,
      lat,
      image: req.file.filename,
    },
    {
      returning: true,
    }
  );

  await UserLocation.create({
    LocationId: newLocation.id,
    UserId: req.user.userId,
  });

  const userLocation = await UserLocation.findOne({
    where: {
      LocationId: newLocation.id,
      UserId: req.user.userId,
    },
    include: [
      { model: Location },
      {
        model: User,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 201,
    data: userLocation,
    msg: "successful create new Location",
  });
};
const editLocation = async (req, res) => {
  await validateEditLocation.validate(req.body);
  const { LocationId, ...others } = req.body;
  const location = await Location.findOne({
    where: { id: LocationId },
  });
  if (!Location) throw serverErrs.BAD_REQUEST("Location not found");

  if (req.file) {
    await location.update({ ...others, image: req.file.filename });
  } else {
    await location.update({ ...others });
  }

  const userLocation = await UserLocation.findOne({
    where: {
      LocationId: location.id,
      UserId: req.user.userId,
    },
    include: [
      { model: Location },
      {
        model: User,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 201,
    data: userLocation,
    msg: "successful update new Location",
  });
};
const deleteLocation = async (req, res) => {
  await validateDeleteLocation.validate(req.body);
  const { LocationId } = req.body;
  const location = await Location.findOne({
    where: { id: LocationId },
  });
  if (!location) throw serverErrs.BAD_REQUEST("Location not found");

  await UserLocation.destroy({
    where: { UserId: req.user.userId, LocationId: location.id },
  });

  await location.destroy();

  res.send({
    status: 201,
    msg: "successful delete Location",
  });
};
const getLocations = async (req, res) => {
  const locations = await UserLocation.findAll({
    where: { UserId: req.user.userId },
    include: [
      { model: Location },
      {
        model: User,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  res.send({
    status: 200,
    data: locations,
    msg: "successful get all locations for this user",
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
  getSellerSubCategories,
  getHighRateSellers,
  nearestSellers,
  getProductsBySubId,
  addToCart,
  showCart,
  decreaseQuantity,
  increaseQuantity,
  deleteCartProduct,
  getSocialMedia,
  createLocation,
  editLocation,
  deleteLocation,
  getLocations,
  createMessage,
};
