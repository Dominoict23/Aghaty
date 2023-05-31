const admin = [
  {
    mobile: "097599111111",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
  },
];

const seller = [
  {
    mobile: "097597774041",
    firstName: "Muhammed",
    lastName: "Mahjoub",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
    avatar: "avatar.png",
    cover: "cover.jpg",
    role: "productSeller",
    serviceType: "",
    address: "Amman",
    CategoryId: 1,
    long: 34.347106,
    lat: 31.383446,
  },
  {
    mobile: "097592414965",
    firstName: "Muhammed",
    lastName: "Abu Shawqi",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
    avatar: "avatar.png",
    cover: "cover.jpg",
    role: "serviceSeller",
    serviceType: "Carpenter",
    address: "Amman",
    CategoryId: 3,
    long: 34.436067,
    lat: 31.446056,
    // verificationCode: ,
  },
];

const feedBacks = [{ SellerId: 1 }, { SellerId: 2 }];

const users = [
  {
    mobile: "097592185263",
    firstName: "Ibrahim",
    lastName: "Abu Nemer",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS",
    avatar: "avatar.png",
    cover: "cover.jpg",
  },
];

const category = [
  {
    nameEN: "Restaurants",
    nameAR: "مطاعم",
    nameKUR: "Restaurants",
    image: "productCategory1.png",
    role: "productSeller",
  },
  {
    nameEN: "grocery",
    nameAR: "بقالة",
    nameKUR: "grocery",
    image: "productCategory2.png",
    role: "productSeller",
  },
  {
    nameEN: "Carpenter",
    nameAR: "نجار",
    nameKUR: "Necar",
    image: "serviceCategory1.jpeg",
    role: "serviceSeller",
  },
  {
    nameEN: "tailor",
    nameAR: "خياط",
    nameKUR: "lebaskar",
    image: "serviceCategory2.jpg",
    role: "serviceSeller",
  },
];

const subCategory = [
  {
    nameEN: "desserts",
    nameAR: "الحلويات",
    nameKUR: "desserts",
    image: "subcategory1.png",
    CategoryId: 1,
  },
  {
    nameEN: "Cafes",
    nameAR: "كافيهات",
    nameKUR: "Cafes",
    image: "subcategory2.png",
    CategoryId: 1,
  },
  // {
  //   nameEN: "table",
  //   nameAR: "طاولة",
  //   nameKUR: "mêz",
  //   image: "subService1.jpg",
  //   CategoryId: 3,
  // },
  // {
  //   nameEN: "clothes",
  //   nameAR: "ملابس",
  //   nameKUR: "cilan",
  //   image: "subService2.png",
  //   CategoryId: 4,
  // },
];

// const products = [
//   {
//     nameAR: "كيك",
//     nameEN: "cake",
//     nameKUR: "paste",
//     description: "chocolate cake",
//     price: 25,
//     availableAmount: 3,
//     limitAmount: 1,
//     discountPrice: 25,
//     SubCategoryId: 1,
//     SellerId: 1,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjFE0FIQWgwxlEzd7Svn50tZk1J_ir7BPiHg&usqp=CAU",
//   },
//   {
//     nameAR: "بوظة",
//     nameEN: "ice cream",
//     nameKUR: "bestenî",
//     description: "ice cream",
//     price: 15,
//     availableAmount: 5,
//     limitAmount: 3,
//     discountPrice: 15,
//     SubCategoryId: 1,
//     SellerId: 1,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtjFAn-yztAERWBibFhC_koJVnNqXEAg190w&usqp=CAU",
//   },
// ];

// const posts = [
//   {
//     text: "blueberry dessert",
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB4Dl226wr5hcsRpeMCPBqARkk1z4B5vwzFQ&usqp=CAU",
//     SellerId: 1,
//   },
//   {
//     text: "furniture beds",
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
//     SellerId: 2,
//   },
// ];

// const stories = [
//   {
//     SellerId: 1,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT15viHhyfkmuldUg_JqRym9LiHvcwi2aCeYQ&usqp=CAU",
//   },
//   {
//     SellerId: 2,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
//   },
// ];

// const services = [
//   {
//     nameEN: "Furniture",
//     nameAR: "أثاث",
//     nameKUR: "Navmalî",
//     description: "Home furniture like beds",
//     priceFrom: 50,
//     priceTo: 70,
//     SellerId: 2,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
//   },
// ];

//TODO: add user id
const messages = [
  {
    name: "ibrahim",
    phone: "11111111",
    msgBody: "I want to contact you because etc....",
    UserId: 1,
  },
  {
    name: "ahmed",
    phone: "22222222",
    msgBody: "I want to contact you because etc....",
    UserId: 1,
  },
];

// const deliveries = [
//   {
//     mobile: "097592185233",
//     firstName: "Abood",
//     lastName: "Abood",
//     password: "$2b$12$yayNjXNIO8sQdF/aaNPLcuGhdU68AlH0JaCOeSiLLpg9XtvwmD.xy",
//     avatar:
//       "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
//     cover:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
//     // verificationCode: ,
//   },
// ];

const banners = [{ image: "banner1.jpg", AdminId: 1 }];

const locations = [
  {
    name: "Palestine",
    city: "Gaze",
    street: "Omar Almokhtar",
    buildNumber: "123456",
    image: "location1.jpg",
    long: 34.308826,
    lat: 31.354675,
  },
];

const userLocations = [
  {
    UserId: 1,
    LocationId: 1,
  },
];

module.exports = {
  seller,
  category,
  subCategory,
  // products,
  // posts,
  // stories,
  // services,
  admin,
  messages,
  // deliveries,
  users,
  banners,
  feedBacks,
  locations,
  userLocations,
};
