const seller = [
  {
    mobile: "097592185263",
    firstName: "Ahmed",
    lastName: "Ezz",
    password: "$2a$10$OKs2RNqMLeyh7dMc7JkGhOmyuiY5nA/mkgEr1HqM/7DBQdB/73sv6", // 1234
    avatar:
      "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
    role: "productSeller",
    serviceType: "",
    location: "Amman",
    // verificationCode: ,
  },
  {
    mobile: "097599188104",
    firstName: "Ali",
    lastName: "Nemer",
    password: "$2a$10$OKs2RNqMLeyh7dMc7JkGhOmyuiY5nA/mkgEr1HqM/7DBQdB/73sv6", // 1234
    avatar:
      "https://www.cdtfa.ca.gov/images/industry/guy_with_open_sign_172870112.png",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2urnpJtbyzVbDQb4hbogaPhtLvtea_nQ8lA&usqp=CAU",
    role: "serviceSeller",
    serviceType: "Smith",
    location: "Amman",
    // verificationCode: ,
  },
];

const category = [
  {
    name: "restaurants",
    image:
      "https://media.cnn.com/api/v1/images/stellar/prod/190710135245-12-waterfront-restaurants.jpg?q=w_3498,h_2296,x_0,y_0,c_fill/w_1280",
  },
];

const subCategory = [
  {
    name: "desserts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp3FNB_XkhndbsUqq9fkxmYKota5sD2pkokA&usqp=CAU",
    CategoryId: 1,
  },
];

const products = [
  {
    name: "cake",
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
    name: "ice cream",
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
    name: "Furniture",
    description: "Home furniture like beds",
    priceFrom: 50,
    priceTo: 70,
    SellerId: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIRFXWKWkBzeCrTCVcvy3h8vLRJ0PYdjNeA&usqp=CAU",
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
};
