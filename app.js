const express = require("express");
const compression = require("compression");
const router = require("./routes");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { clientError, serverError } = require("./middleware");

dotenv.config();
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".tif",
    ".tiff",
    ".webp",
    ".mp4",
    ".mov",
    ".avi",
    ".wmv",
    ".mkv",
    ".flv",
    ".webm",
    ".m4v",
    ".mpeg",
    ".3gp",
  ]; // Add more extensions if needed
  const fileExtension = path.extname(file.originalname).toLowerCase(); // Get the file extension

  // Check if the file extension is allowed
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed."));
  }
};

app.use(cors());
// save image
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ])
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("port", process.env.PORT || 3500);

app.use([
  express.json(),
  compression(),
  express.urlencoded({ extended: false }),
]);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  next();
});

app.use("/api/v1", router);

app.use(clientError);
app.use(serverError);

module.exports = app;
