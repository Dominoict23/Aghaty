const admin = [
  {
    mobile: "097599111111",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
  },
];

const seller = [
  {
    mobile: "097597774041",
    firstName: "Ahmed",
    lastName: "Ezz",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
    avatar:
      "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
    role: "productSeller",
    serviceType: "",
    location: "Amman",
    CategoryId: 1,
    // verificationCode: ,
  },
  {
    mobile: "097599188104",
    firstName: "Ali",
    lastName: "Nemer",
    password: "$2a$12$dIuKAuDzD.KhJ0FRDhaOse8aOcDm3XY4IbKRrz6bFTGHHskPwojfS", // 12345678
    avatar:
      "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
    role: "serviceSeller",
    serviceType: "Smith",
    location: "Amman",
    // CategoryId: 2
    // verificationCode: ,
  },
];

const category = [
  {
    nameEN: "Restaurants",
    nameAR: "مطاعم",
    nameKUR: "Restaurants",
    image:
      "https://lh3.googleusercontent.com/x42jIxb5hfFysMJHMKwRg_HQaIM1NfOjrpsV51RqglOYlONJzCIq2bF7rDxI-wucZ_ln3wd4_2ZkK9AaBrCkjnUKTU2t3iIdZYFDhwWj",
    role: "productSeller",
  },
  {
    nameEN: "phones",
    nameAR: "جوالات",
    nameKUR: "Mobiles",
    image:
      "https://lh3.googleusercontent.com/NqdIqcWSg4sFwpw0Ss97hD7uRNk9uTO51V_qVjrWRgtYX8SNwmQrl6Ge4ejKy3sqBqn61qxQphDRANcYNUwrcdtsiE-UuqEZReOOYRYp",
    role: "productSeller",
  },
];

const subCategory = [
  {
    nameEN: "desserts",
    nameAR: "الحلويات",
    nameKUR: "desserts",
    image:
      "https://lh3.googleusercontent.com/vFRYJbm9A9XzLqW4y7R3dpQ5dldTFXN6Uv9YQJNqFzO7JknvguzaWghFKRIL4WJGPGen3HcVKiWgJ40DvRGMNl9Q1D6pw4AUR88oDIdW",
    CategoryId: 1,
  },
];

const products = [
  {
    nameAR: "كيك",
    nameEN: "cake",
    nameKUR: "paste",
    description: "chocolate cake",
    price: 25,
    availableAmount: 3,
    limitAmount: 1,
    discountPrice: 25,
    SubCategoryId: 1,
    SellerId: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjFE0FIQWgwxlEzd7Svn50tZk1J_ir7BPiHg&usqp=CAU",
  },
  {
    nameAR: "بوظة",
    nameEN: "ice cream",
    nameKUR: "bestenî",
    description: "ice cream",
    price: 15,
    availableAmount: 5,
    limitAmount: 3,
    discountPrice: 15,
    SubCategoryId: 1,
    SellerId: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtjFAn-yztAERWBibFhC_koJVnNqXEAg190w&usqp=CAU",
  },
];

const posts = [
  {
    text: "blueberry dessert",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB4Dl226wr5hcsRpeMCPBqARkk1z4B5vwzFQ&usqp=CAU",
    SellerId: 1,
  },
  {
    text: "furniture beds",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
    SellerId: 2,
  },
];

const stories = [
  {
    SellerId: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT15viHhyfkmuldUg_JqRym9LiHvcwi2aCeYQ&usqp=CAU",
  },
  {
    SellerId: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
  },
];

const services = [
  {
    nameEN: "Furniture",
    nameAR: "أثاث",
    nameKUR: "Navmalî",
    description: "Home furniture like beds",
    priceFrom: 50,
    priceTo: 70,
    SellerId: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
  },
];

//TODO: add user id
const messages = [
  {
    name: "ibrahim",
    phone: "11111111",
    msgBody: "I want to contact you because etc....",
    // UserId: 1,
  },
  {
    name: "ahmed",
    phone: "22222222",
    msgBody: "I want to contact you because etc....",
    // UserId: 1,
  },
];

const deliveries = [
  {
    mobile: "097592185233",
    firstName: "Abood",
    lastName: "Abood",
    password: "$2b$12$yayNjXNIO8sQdF/aaNPLcuGhdU68AlH0JaCOeSiLLpg9XtvwmD.xy",
    avatar:
      "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
    // verificationCode: ,
  },
];

module.exports = {
  seller,
  category,
  subCategory,
  products,
  posts,
  stories,
  services,
  admin,
  messages,
  deliveries,
};
