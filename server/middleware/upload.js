const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const upload = multer({
  storage: multerS3({
    s3,

    bucket: process.env.AWS_BUCKET_NAME,
    
    limits: {
      fileSize: 1024 * 1024 * 500,
    },

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
    },
  }),
});

module.exports = upload;
