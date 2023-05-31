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
const OrderFromTo = require("./OrderFromTo");
const FinancialRecord = require("./FinancialRecord");
const Message = require("./Message");
const SocialMedia = require("./SocialMedia");
const Rate = require("./Rate");

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

User.hasMany(Order);
Order.belongsTo(User);

Seller.hasMany(Order);
Order.belongsTo(Seller);

Location.hasOne(Order);
Order.belongsTo(Location);

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

User.hasMany(ServiceOrder);
ServiceOrder.belongsTo(User);

Seller.hasMany(ServiceOrder);
ServiceOrder.belongsTo(Seller);

Service.hasMany(ServiceOrder);
ServiceOrder.belongsTo(Service);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

Delivery.hasMany(OrderDelivery);
OrderDelivery.belongsTo(Delivery);

Order.hasMany(OrderDelivery);
OrderDelivery.belongsTo(Order);

Delivery.hasMany(OrderFromTo);
OrderFromTo.belongsTo(Delivery);

Seller.hasMany(FinancialRecord);
FinancialRecord.belongsTo(Seller);

Delivery.hasMany(FinancialRecord);
FinancialRecord.belongsTo(Delivery);

Order.hasOne(FinancialRecord);
FinancialRecord.belongsTo(Order);

User.hasMany(Message);
Message.belongsTo(User);

Category.hasMany(Seller);
Seller.belongsTo(Category);

Feedback.hasMany(Rate);
Rate.belongsTo(Feedback);

User.hasMany(Rate);
Rate.belongsTo(User);

Feedback.hasMany(Like);
Like.belongsTo(Feedback);

Feedback.hasMany(Comment);
Comment.belongsTo(Feedback);

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
  OrderFromTo,
  FinancialRecord,
  Message,
  SocialMedia,
  Rate,
};
