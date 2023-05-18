const path = require("path");
const fs = require("fs");
const { serverErrs } = require("./customError");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", `images/${filePath}`);
  fs.unlink(filePath, (err) => {
    if (err) throw serverErrs.BAD_REQUEST("Image not found");
  });
};

module.exports = clearImage;
