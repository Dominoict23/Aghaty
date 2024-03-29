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
  Feedback,
  Rate,
  DiscountCode,
  Service,
  ServiceOrder,
  Video,
  Delivery,
  OrderPackage,
  OrderDelivery,
  Live,
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
  validateAddRate,
  validateFeedbackLike,
  validateCreateFeedbackComment,
  validateDeleteFeedbackComment,
  validateAllCategory,
  validateAddServiceOrder,
  validateHighRateSellers,
  validateDeliveriesBySubCategoryName,
  validateAddOrderPackage,
  validateAddOrderDelivery,
  validateAllServiceSellers,
} = require("../validation");
const generateToken = require("../middleware/generateToken");
const { calculateDistance } = require("../utils/calculateDistance");
const sequelize = require("../db/config/connection");

// Auth requests
const signup = async (req, res) => {
  const { mobile, password, firstName, lastName } = req.body;

  const user = await User.findOne({ where: { mobile } });
  const seller = await Seller.findOne({ where: { mobile } });
  const delivery = await Delivery.findOne({ where: { mobile } });

  if (user || seller || delivery)
    throw serverErrs.BAD_REQUEST("mobile already used");

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

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("avatar not found");
  }

  await userFound.update({ avatar: req.files.image[0].filename });

  res.send({
    status: 201,
    avatar: req.files.image[0].filename,
    msg: "successful update avatar in user",
  });
};
const editCover = async (req, res) => {
  const userFound = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!userFound) throw serverErrs.BAD_REQUEST("user not found! ");

  if (Object.keys(req.files).length === 0) {
    throw serverErrs.BAD_REQUEST("cover not found");
  }

  await userFound.update({ cover: req.files.image[0].filename });

  res.send({
    status: 201,
    cover: req.files.image[0].filename,
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
      const hasLike = likes?.some((like) => like.UserId == req.user.userId);
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

// Post Likes
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

  const like = await Like.findOne({ where: { PostId, UserId: user.id } });
  if (!like) {
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

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

  const post = await Post.findOne({ where: { id: PostId } });

  if (!post) throw serverErrs.BAD_REQUEST("Post not found! ");

  const like = await Like.findOne({ PostId, UserId: req.user.userId });

  if (!like) throw serverErrs.BAD_REQUEST("like not found");

  await like.destroy();

  await post.decrement("count", { by: 1 });

  res.send({
    status: 201,
    msg: "successful delete like from Post",
  });
};

// Post Comments
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

  const user = await User.findOne({
    where: { id: req.user.userId },
  });

  if (!user) throw serverErrs.BAD_REQUEST("User not found");

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

  if (comment.UserId !== user.id)
    throw serverErrs.BAD_REQUEST("This comment not yours");

  await comment.update({ text });

  res.send({
    status: 201,
    data: comment,
    msg: "successful edit comment",
  });
};

//Categories
const getAllCategory = async (req, res) => {
  await validateAllCategory.validate(req.body);
  const { role } = req.body;
  const categories = await Category.findAll({
    where: { role },
  });

  res.send({
    status: 201,
    categories,
    msg: "get all categories successfully",
  });
};

// SubCategories
const getAllSubCategories = async (req, res) => {
  const { CategoryId } = req.params;
  let subCategories;
  if (CategoryId != 1) {
    subCategories = await SubCategory.findAll({
      where: { CategoryId },
      include: { model: Category },
      attributes: {
        exclude: ["deliveryPrice"],
      },
    });
  } else {
    subCategories = await SubCategory.findAll({
      where: {
        CategoryId,
        nameEN: {
          [Op.not]: "Delivery Man",
        },
      },
      include: { model: Category },
    });
  }

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
    attributes: {
      exclude: ["deliveryPrice"],
    },
  });

  res.send({
    status: 200,
    subCategories,
    msg: "get all subCategories successfully",
  });
};

// Seller
const getHighOrderSellers = async (req, res) => {
  await validateHighRateSellers.validate(req.body);

  const { CategoryId, SubCategoryId } = req.body;

  let sellers;

  if (SubCategoryId == 0) {
    sellers = await Seller.findAll({
      where: { CategoryId },
      attributes: {
        include: [
          "id",
          "mobile",
          "firstName",
          "lastName",
          "avatar",
          "cover",
          "status",
          "role",
          "serviceType",
          "address",
          "rate",
          "subCategories",
          "fcmToken",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM `Orders` WHERE `Orders`.`SellerId` = `Seller`.`id`)"
            ),
            "orderCount",
          ],
        ],
      },
      order: [[sequelize.literal("orderCount"), "DESC"]],
    });
  } else {
    sellers = await Seller.findAll({
      where: sequelize.literal(
        `FIND_IN_SET('${SubCategoryId}', subCategories)`
      ),
      attributes: {
        include: [
          "id",
          "mobile",
          "firstName",
          "lastName",
          "avatar",
          "cover",
          "status",
          "role",
          "serviceType",
          "address",
          "rate",
          "subCategories",
          "fcmToken",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM `Orders` WHERE `Orders`.`SellerId` = `Seller`.`id`)"
            ),
            "orderCount",
          ],
        ],
      },
      order: [[sequelize.literal("orderCount"), "DESC"]],
    });
  }

  res.send({
    status: 200,
    sellers,
    msg: "get highest order sellers successfully",
  });
};

const getHighRateSellers = async (req, res) => {
  await validateHighRateSellers.validate(req.body);

  const { CategoryId, SubCategoryId } = req.body;

  let sellers;

  if (SubCategoryId == 0) {
    sellers = await Seller.findAll({
      where: { CategoryId },
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
      order: [["rate", "DESC"]],
    });
  } else {
    sellers = await Seller.findAll({
      where: sequelize.literal(
        `FIND_IN_SET('${SubCategoryId}', subCategories)`
      ),
      order: [["rate", "DESC"]],
    });
  }

  res.send({
    status: 200,
    sellers,
    msg: "get highest rate sellers successfully",
  });
};

const nearestSellers = async (req, res) => {
  await validateNearestSellers.validate(req.body);

  const { CategoryId, SubCategoryId } = req.body;

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

  const userLocation = await UserLocation.findOne({
    where: { isDefault: true, UserId: req.user.userId },
    include: { model: Location },
  });

  const userCoordinates = {
    lat: userLocation.Location.lat,
    long: userLocation.Location.long,
  };
  let sellers;
  if (SubCategoryId == 0) {
    sellers = await Seller.findAll({
      where: { CategoryId },
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: UserLocation,
          include: { model: Location },
        },
      ],
    });
  } else {
    sellers = await Seller.findAll({
      where: {
        [Op.and]: [
          sequelize.literal(`FIND_IN_SET('${SubCategoryId}', subCategories)`),
          { CategoryId },
        ],
      },
      attributes: {
        exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: UserLocation,
          include: { model: Location },
        },
      ],
    });
  }

  const result = [];

  await Promise.all(
    sellers.map(async (seller) => {
      const sellerCoordinates = {
        lat: seller.UserLocations[0]?.Location?.lat,
        long: seller.UserLocations[0]?.Location?.long,
      };

      const distance = calculateDistance(
        userCoordinates.lat,
        userCoordinates.long,
        sellerCoordinates.lat,
        sellerCoordinates.long
      );

      // TODO: change the number of kilometers
      if (distance < 10) {
        result.push(seller);
      }
    })
  );

  res.send({
    status: 201,
    result,
    msg: "Successfully retrieved sellers within 15 kilometers.",
  });
};
const getServiceSellers = async (req, res) => {
  await validateAllServiceSellers.validate(req.body);

  const { CategoryId } = req.body;

  const sellers = await Seller.findAll({
    where: { role: "serviceSeller", CategoryId },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
    include: { model: Service, include: { model: Image } },
  });

  res.send({
    status: 200,
    sellers,
    msg: "get all service sellers successfully",
  });
};
const getSingleServiceSeller = async (req, res) => {
  const { SellerId } = req.params;

  const seller = await Seller.findOne({
    where: { id: SellerId, role: "serviceSeller" },
    attributes: {
      exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
    },
    include: { model: Service, include: { model: Image } },
  });

  res.send({
    status: 200,
    seller,
    msg: "get single service seller successfully",
  });
};

// Deliveries
const deliveriesBySubCategoryName = async (req, res) => {
  await validateDeliveriesBySubCategoryName.validate(req.body);

  const { nameEN } = req.body;

  const deliveries = await Delivery.findAll({ where: { type: nameEN } });

  res.send({
    status: 200,
    deliveries,
    msg: "get all deliveries of this sub category successfully",
  });
};

// Products
const getProductsBySubId = async (req, res) => {
  const { SubCategoryId } = req.params;
  let products;
  if (SubCategoryId == 0) {
    products = await Product.findAll({
      where: { SellerId: req.user.userId },
      include: [
        {
          model: Seller,
          attributes: {
            exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
          },
        },
        { model: Image },
      ],
    });
  } else {
    products = await Product.findAll({
      where: { SubCategoryId, SellerId: req.user.userId },
      include: [
        {
          model: Seller,
          attributes: {
            exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
          },
        },
        { model: Image },
      ],
    });
  }

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
    await cart.update({ totalProductsPrice: 0 });
    await CartProduct.destroy({ where: { CartId: cart.id } });
  } else {
    cart = await Cart.create({
      UserId: req.user.userId,
    });
    await cart.save();
  }

  const promises = products.map(async (product) => {
    const p = await Product.findOne({ where: { id: product.ProductId } });
    if (!p) throw serverErrs.BAD_REQUEST("Product not exist please add it");
    return product.quantity * p.price;
  });

  const totalPrice = (await Promise.all(promises)).reduce(
    (accumulator, price) => accumulator + price,
    0
  );

  products.map((product) => {
    product.CartId = cart.id;
  });

  await CartProduct.bulkCreate(products);

  await cart.update({ totalProductsPrice: totalPrice });

  res.send({
    status: 201,
    msg: "successful add products to cart",
  });
};
const showCart = async (req, res) => {
  // const { LocationId } = req.body;

  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("Cart for this user not exist");

  const subCategory = await SubCategory.findOne({
    where: { nameEN: "Delivery Man" },
  });

  if (!subCategory)
    throw serverErrs.BAD_REQUEST("Sub Category for Delivery man not found");

  const products = await CartProduct.findAll({
    where: { CartId: cart.id },
    include: {
      model: Product,
      include: { model: Image },
    },
  });

  if (products.length < 1)
    throw serverErrs.BAD_REQUEST("There are no products in cart to show");

  const userLocation = await UserLocation.findOne({
    where: { isDefault: true, UserId: req.user.userId },
    include: { model: Location },
  });
  // const userLocation = await UserLocation.findOne({
  //   where: { LocationId, UserId: req.user.userId },
  //   include: { model: Location },
  // });
  const userCoordinates = {
    lat: userLocation.Location.lat,
    long: userLocation.Location.long,
  };

  const sellerLocation = await UserLocation.findOne({
    where: { SellerId: products[0].Product.SellerId },
    include: { model: Location },
  });
  const sellerCoordinates = {
    lat: sellerLocation.Location.lat,
    long: sellerLocation.Location.long,
  };

  const distance = calculateDistance(
    userCoordinates.lat,
    userCoordinates.long,
    sellerCoordinates.lat,
    sellerCoordinates.long
  );

  const deliveryPrice = distance * subCategory.deliveryPrice;

  await cart.update({ deliveryPrice });

  res.send({
    status: 200,
    products,
    totalProductsPrice: cart.totalProductsPrice,
    deliveryPrice,
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
  await cart.update({ totalProductsPrice: totalPrice });

  res.send({
    status: 201,
    totalProductsPrice: cart.totalProductsPrice,
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
  await cart.update({ totalProductsPrice: totalPrice });

  res.send({
    status: 201,
    totalProductsPrice: cart.totalProductsPrice,
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
  await cart.update({ totalProductsPrice: totalPrice });

  res.send({
    status: 201,
    msg: "successful deleted product from cart",
  });
};

// Order
//// Product orders
const addProductsOrder = async (req, res) => {
  // TODO: handle discount code case
  const { discountCode } = req.body;

  const cart = await Cart.findOne({ where: { UserId: req.user.userId } });

  if (!cart) throw serverErrs.BAD_REQUEST("cart not found");

  const count = await CartProduct.count({ where: { CartId: cart.id } });

  if (count === 0)
    throw serverErrs.BAD_REQUEST(
      "there is no products in cart to order for this user"
    );

  const cartProducts = await CartProduct.findAll({
    where: { CartId: cart.id },
    include: { model: Product },
  });

  const discountCodeFound = await DiscountCode.findOne({
    where: { code: discountCode, isEnable: true },
  });

  let priceAfterDiscount = cart.totalProductsPrice;

  if (discountCodeFound) {
    priceAfterDiscount =
      priceAfterDiscount -
      (priceAfterDiscount * discountCodeFound.discount) / 100;
  }

  let totalPrice = priceAfterDiscount + cart.deliveryPrice;

  const orderNum = await Order.count({
    where: { SellerId: cartProducts[0].Product.SellerId },
  });

  const newOrder = await Order.create(
    {
      name: `Order no #${orderNum + 1}`,
      totalPrice,
      orderPrice: priceAfterDiscount,
      deliveryPrice: cart.deliveryPrice,
      UserId: req.user.userId,
      SellerId: cartProducts[0].Product.SellerId,
    },
    { returning: true }
  );

  const currentDate = new Date(newOrder.createdAt);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const date = `${day}/${month}/${year}`;

  await newOrder.update({ day: dayOfWeek, date });

  await cart.update({ totalProductsPrice: 0, deliveryPrice: 0 });

  cartProducts.forEach(async (cartProduct) => {
    await OrderProduct.create({
      quantity: cartProduct.quantity,
      OrderId: newOrder.id,
      ProductId: cartProduct.ProductId,
    });

    await cartProduct.destroy();
  });

  res.send({
    status: 201,
    msg: "successful create new products order",
  });
};
const getProductsOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { UserId: req.user.userId },
    attributes: { exclude: ["deliveryPrice", "orderPrice"] },
    include: [
      { model: OrderProduct, required: true },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const formattedOrders = orders.map((order, index) => ({
    ...order.toJSON(),
    name: `Order no #${index + 1}`,
  }));

  res.send({
    status: 200,
    orders: formattedOrders,
    msg: "successful get all products orders",
  });
};
const getSingleProductsOrder = async (req, res) => {
  const { OrderId } = req.params;

  const orders = await OrderProduct.findAll({
    where: { OrderId },
    include: [{ model: Product, include: { model: Image } }],
  });

  res.send({
    status: 200,
    orders,
    msg: "successful get single products order",
  });
};
//// Service orders
const addServiceOrder = async (req, res) => {
  await validateAddServiceOrder.validate(req.body);

  const { username, location, mobile, serviceDescription, SellerId } = req.body;

  const orderNum = await Order.count({ where: { SellerId } });

  const newOrder = await Order.create(
    {
      name: `Order no #${orderNum + 1}`,
      totalPrice: 0,
      UserId: req.user.userId,
      SellerId,
    },
    { returning: true }
  );

  const currentDate = new Date(newOrder.createdAt);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const date = `${day}/${month}/${year}`;

  await newOrder.update({ day: dayOfWeek, date });

  await ServiceOrder.create({
    username,
    location,
    mobile,
    serviceDescription,
    OrderId: newOrder.id,
  });

  res.send({
    status: 201,
    msg: "successful create new service order",
  });
};
const getServicesOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: {
      UserId: req.user.userId,
    },
    include: [
      { model: ServiceOrder, required: true },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const formattedOrders = orders.map((order, index) => ({
    ...order.toJSON(),
    name: `Order no #${index + 1}`,
  }));

  res.send({
    status: 200,
    orders: formattedOrders,
    msg: "successful get all Service orders",
  });
};
//// Package Orders
const addOrderPackage = async (req, res) => {
  await validateAddOrderPackage.validate(req.body);

  const subCategory = await SubCategory.findOne({
    where: { nameEN: "Freight" },
  });

  if (!subCategory)
    throw serverErrs.BAD_REQUEST("Sub Category for Freight not found");

  const {
    senderName,
    senderAddress,
    senderMobile,
    receiverName,
    receiverAddress,
    receiverMobile,
    packageDescription,
    startLong,
    startLat,
    endLong,
    endLat,
  } = req.body;

  const newPackageOrder = await OrderPackage.create({
    senderName,
    senderAddress,
    senderMobile,
    receiverName,
    receiverAddress,
    receiverMobile,
    packageDescription,
    UserId: req.user.userId,
  });

  const distance = calculateDistance(startLat, startLong, endLat, endLong);

  await OrderDelivery.create({
    type: "Freight",
    distance,
    price: distance * subCategory.deliveryPrice,
    startLong,
    startLat,
    endLong,
    endLat,
    OrderPackageId: newPackageOrder.id,
    UserId: req.user.userId,
  });

  res.send({
    status: 201,
    msg: "successful create new package order",
  });
};
//// Delivery Orders
const addOrderDelivery = async (req, res) => {
  await validateAddOrderDelivery.validate(req.body);

  const { distance, price, startLong, startLat, endLong, endLat, type } =
    req.body;

  await OrderDelivery.create({
    type,
    distance,
    price,
    startLong,
    startLat,
    endLong,
    endLat,
    UserId: req.user.userId,
  });

  res.send({
    status: 201,
    msg: "successful create new delivery order",
  });
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

  if (Object.keys(req.files).length === 0)
    throw serverErrs.BAD_REQUEST("image not found");

  const newLocation = await Location.create(
    {
      name,
      city,
      street,
      buildNumber,
      long,
      lat,
      image: req.files.image[0].filename,
    },
    {
      returning: true,
    }
  );

  const newUserLocation = await UserLocation.create({
    LocationId: newLocation.id,
    UserId: req.user.userId,
  });

  const count = await UserLocation.count({
    where: { UserId: req.user.userId },
  });

  if (count === 1) await newUserLocation.update({ isDefault: true });

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
  const { LocationId, isDefault, ...others } = req.body;
  const location = await Location.findOne({
    where: { id: LocationId },
  });
  if (!Location) throw serverErrs.BAD_REQUEST("Location not found");

  if (req.files?.image !== undefined) {
    await location.update({ ...others, image: req.files.image[0].filename });
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

  if (isDefault == true) {
    const userLocationDefault = await UserLocation.findOne({
      LocationId,
      UserId: req.user.userId,
      isDefault: true,
    });

    await userLocationDefault.update({ isDefault: false });

    await userLocation.update({ isDefault: true });
  }

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

// FeedBack
const getSellerFeedBack = async (req, res) => {
  const { SellerId } = req.params;
  const feedBack = await Feedback.findOne({
    where: { SellerId },
    include: [
      { model: Like },
      {
        model: Comment,
        include: {
          model: User,
          attributes: {
            exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
          },
        },
      },
      {
        model: Seller,
        attributes: {
          exclude: ["verificationCode", "password", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  const likes = await feedBack?.getLikes();
  const hasLike = likes?.some((like) => like.UserId == req.user.userId);
  await feedBack?.update({ isLike: hasLike });

  const commentCounts = await Comment.count({
    where: { FeedbackId: feedBack.id },
  });

  res.send({
    status: 200,
    feedBack,
    commentCounts,
    msg: "successful get seller feedBack",
  });
};
const addRate = async (req, res) => {
  await validateAddRate.validate(req.body);
  const { FeedbackId, rate } = req.body;
  const rateFound = await Rate.findOne({
    where: { FeedbackId, UserId: req.user.userId },
  });

  if (rateFound) {
    await rateFound.update({ rate });
  } else {
    await Rate.create({ rate, FeedbackId, UserId: req.user.userId });
  }
  const rates = await Rate.findAll({
    where: { FeedbackId },
  });
  const sellerRate =
    rates.reduce((accumulator, rate) => accumulator + rate.rate, 0) /
    rates.length;

  const feedBack = await Feedback.findOne({ FeedbackId });
  await feedBack.update({
    rate: sellerRate,
  });

  (await Seller.findOne({ id: feedBack.SellerId })).update({
    rate: sellerRate,
  });

  res.send({
    status: 201,
    msg: "successful add rate",
  });
};
const addFeedbackLike = async (req, res) => {
  await validateFeedbackLike.validate(req.body);

  const { FeedbackId } = req.body;

  const feedBack = await Feedback.findOne({
    where: { id: FeedbackId },
  });

  if (!feedBack) throw serverErrs.BAD_REQUEST("FeedBack not found");
  const like = await Like.findOne({
    where: { FeedbackId, UserId: req.user.userId },
  });
  if (!like) {
    const newLike = await Like.create(
      {
        FeedbackId,
        UserId: req.user.userId,
      },
      {
        returning: true,
      }
    );

    await newLike.save();

    res.send({
      status: 201,
      msg: "successful add like to Feedback",
    });
  } else {
    res.send({
      status: 201,
      msg: "like is already exist for this Feedback",
    });
  }
};
const deleteFeedbackLike = async (req, res) => {
  await validateFeedbackLike.validate(req.body);

  const { FeedbackId } = req.body;

  const feedBack = await Feedback.findOne({
    where: { id: FeedbackId },
  });

  if (!feedBack) throw serverErrs.BAD_REQUEST("FeedBack not found");

  const like = await Like.findOne({ FeedbackId, UserId: req.user.userId });

  if (!like) throw serverErrs.BAD_REQUEST("like not found");

  await like.destroy();

  res.send({
    status: 201,
    msg: "successful delete like from Feedback",
  });
};
const addFeedbackComment = async (req, res) => {
  await validateCreateFeedbackComment.validate(req.body);

  const { FeedbackId, text } = req.body;

  const feedBack = await Feedback.findOne({
    where: { id: FeedbackId },
  });

  if (!feedBack) throw serverErrs.BAD_REQUEST("FeedBack not found");

  const newComment = await Comment.create(
    {
      text,
      FeedbackId,
      UserId: req.user.userId,
    },
    {
      returning: true,
    }
  );

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
    msg: "successful add comment to Feedback",
  });
};
const deleteFeedbackComment = async (req, res) => {
  await validateDeleteFeedbackComment.validate(req.body);

  const { CommentId } = req.body;

  const comment = await Comment.findOne({
    where: { id: CommentId },
  });

  if (comment.UserId !== req.user.userId)
    throw serverErrs.BAD_REQUEST("This comment not yours");

  await comment.destroy();

  res.send({
    status: 201,
    msg: "successful delete comment from Feedback",
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
  getHighOrderSellers,
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
  getSellerFeedBack,
  addRate,
  addFeedbackLike,
  deleteFeedbackLike,
  addFeedbackComment,
  deleteFeedbackComment,
  addProductsOrder,
  getProductsOrders,
  getSingleProductsOrder,
  getServiceSellers,
  getSingleServiceSeller,
  addServiceOrder,
  getServicesOrders,
  deliveriesBySubCategoryName,
  addOrderPackage,
  addOrderDelivery,
};
