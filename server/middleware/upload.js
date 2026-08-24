const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 500,
    files: 10,
  },

  storage: multerS3({
    s3,

    bucket: process.env.AWS_BUCKET_NAME,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const safeName = file.originalname
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");

      cb(
        null,
        `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`,
      );
    },
  }),
});

module.exports = upload;
