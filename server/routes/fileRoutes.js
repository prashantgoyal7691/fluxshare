const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const uploadErrorHandler = require("../middleware/uploadErrorHandler");

const {
    uploadRateLimiter,
    transferInfoRateLimiter,
    downloadRateLimiter,
} = require("../middleware/rateLimiter");

const {
  uploadFiles,
  getTransfer,
  downloadFiles,
} = require("../controllers/fileController");

const uploadMiddleware = upload.array("files");

router.post(
    "/upload",
    uploadRateLimiter,
    (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err) {
                return uploadErrorHandler(err, req, res, next);
            }

            next();
        });
    },
    uploadFiles,
);

router.get(
    "/info/:key",
    transferInfoRateLimiter,
    getTransfer,
);

router.post(
    "/download/:key",
    downloadRateLimiter,
    downloadFiles,
);

module.exports = router;