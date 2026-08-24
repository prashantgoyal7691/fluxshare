const multer = require("multer");

const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size cannot exceed 500 MB",
            });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "You can upload a maximum of 10 files",
            });
        }

        return res.status(400).json({
            success: false,
            message: "File upload error",
        });
    }

    next(err);
};

module.exports = uploadErrorHandler;