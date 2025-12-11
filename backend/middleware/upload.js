// // const multer = require("multer");
// // const path = require("path");

// // // Storage engine
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, "uploads/rooms/");
// //   },

// //   filename: function (req, file, cb) {
// //     cb(
// //       null,
// //       Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
// //     );
// //   },
// // });

// // // Only allow images
// // const fileFilter = (req, file, cb) => {
// //   const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
// //   if (allowed.includes(file.mimetype)) cb(null, true);
// //   else cb(new Error("Only images allowed"), false);
// // };

// // module.exports = multer({ storage, fileFilter });

// // backend/middleware/upload.js
// // const multer = require("multer");
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");
// // const cloudinary = require("cloudinary").v2;

// // // Configure Cloudinary with env variables
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // const storage = new CloudinaryStorage({
// //   cloudinary,
// //   params: async (req, file) => {
// //     return {
// //       folder: "roostr/rooms",                 // folder in Cloudinary
// //       allowed_formats: ["jpg", "jpeg", "png", "webp"],
// //       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
// //     };
// //   },
// // });

// // const upload = multer({ storage });

// // module.exports = upload;

// // backend/middleware/upload.js
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;

// // Configure Cloudinary with env variables
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "roostr/rooms",                 // folder in Cloudinary
//       allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//     };
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;


// // backend/middleware/upload.js
// const multer = require("multer");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
// });

// module.exports = upload;


// backend/middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

module.exports = upload;
