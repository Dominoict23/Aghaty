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
    // Specify the destination folder based on the file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, "images");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "videos");
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
app.use(cors());
// save image
app.use(
  multer({ storage: fileStorage }).single("media") // Use "media" as the field name for both image and video uploads
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

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
