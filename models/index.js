const User = require("./User");
const Admin = require("./Admin");
const Seller = require("./Seller");
const Cart = require("./Cart");
const Product = require("./Product");
const Category = require("./Category");
const SubCategory = require("./SubCategory");
const Post = require("./Post");
const Comment = require("./Comment");
const Story = require("./Story");
const CartProduct = require("./CartProduct");
const Like = require("./Like");
const Image = require("./Image");
const Service = require("./Service");
const Video = require("./Video");
const Order = require("./Order");
const Location = require("./Location");
const Feedback = require("./Feedback");
const UserLocation = require("./UserLocation");
const DiscountCode = require("./DiscountCode");
const ServiceOrder = require("./ServiceOrder");
const OrderProduct = require("./OrderProduct");
const Delivery = require("./Delivery");
const OrderDelivery = require("./OrderDelivery");
const OrderPackage = require("./OrderPackage");
const FinancialRecord = require("./FinancialRecord");
const Message = require("./Message");
const SocialMedia = require("./SocialMedia");
const Rate = require("./Rate");
const Live = require("./Live");

User.hasOne(Cart);
Cart.belongsTo(User);

Seller.hasMany(Product);
Product.belongsTo(Seller);

SubCategory.hasOne(Product);
Product.belongsTo(SubCategory);

Category.hasMany(SubCategory);
SubCategory.belongsTo(Category);

Seller.hasMany(Post);
Post.belongsTo(Seller);

Post.hasMany(Comment);
Comment.belongsTo(Post);

Seller.hasMany(Comment);
Comment.belongsTo(Seller);

User.hasMany(Comment);
Comment.belongsTo(User);

Seller.hasMany(Story);
Story.belongsTo(Seller);

Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);

Product.hasMany(CartProduct);
CartProduct.belongsTo(Product);

Post.hasMany(Like);
Like.belongsTo(Post);

User.hasMany(Like);
Like.belongsTo(User);

Seller.hasMany(Like);
Like.belongsTo(Seller);

Post.hasMany(Image);
Image.belongsTo(Post);

Product.hasMany(Image);
Image.belongsTo(Product);

Service.hasMany(Image);
Image.belongsTo(Service);

Admin.hasMany(Image);
Image.belongsTo(Admin);

Seller.hasMany(Service);
Service.belongsTo(Seller);

Post.hasMany(Video);
Video.belongsTo(Post);

Post.hasMany(Live);
Live.belongsTo(Post);

User.hasMany(Order);
Order.belongsTo(User);

Seller.hasMany(Order);
Order.belongsTo(Seller);

Seller.hasMany(Feedback);
Feedback.belongsTo(Seller);

User.hasMany(UserLocation);
UserLocation.belongsTo(User);

Seller.hasMany(UserLocation);
UserLocation.belongsTo(Seller);

Delivery.hasMany(UserLocation);
UserLocation.belongsTo(Delivery);

Location.hasMany(UserLocation);
UserLocation.belongsTo(Location);

Order.hasOne(ServiceOrder);
ServiceOrder.belongsTo(Order);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

User.hasMany(OrderDelivery);
OrderDelivery.belongsTo(User);

User.hasMany(OrderPackage);
OrderPackage.belongsTo(User);

OrderPackage.hasOne(OrderDelivery);
OrderDelivery.belongsTo(OrderPackage);

Order.hasOne(OrderDelivery);
OrderDelivery.belongsTo(Order);

Seller.hasMany(FinancialRecord);
FinancialRecord.belongsTo(Seller);

Delivery.hasMany(FinancialRecord);
FinancialRecord.belongsTo(Delivery);

Order.hasOne(FinancialRecord);
FinancialRecord.belongsTo(Order);

OrderDelivery.hasOne(FinancialRecord);
FinancialRecord.belongsTo(OrderDelivery);

User.hasMany(Message);
Message.belongsTo(User);

Category.hasMany(Seller);
Seller.belongsTo(Category);

Category.hasMany(Delivery);
Delivery.belongsTo(Category);

Feedback.hasMany(Rate);
Rate.belongsTo(Feedback);

User.hasMany(Rate);
Rate.belongsTo(User);

Feedback.hasMany(Like);
Like.belongsTo(Feedback);

Feedback.hasMany(Comment);
Comment.belongsTo(Feedback);

Delivery.hasMany(OrderDelivery);
OrderDelivery.belongsTo(Delivery);

module.exports = {
  User,
  Admin,
  Cart,
  Seller,
  Product,
  SubCategory,
  Category,
  Post,
  Comment,
  Story,
  CartProduct,
  Like,
  Image,
  Service,
  Video,
  Order,
  Location,
  Feedback,
  UserLocation,
  DiscountCode,
  ServiceOrder,
  OrderProduct,
  Delivery,
  OrderDelivery,
  OrderPackage,
  FinancialRecord,
  Message,
  SocialMedia,
  Rate,
  Live,
};
