const {
    createTransfer,
    getTransferInfo,
    getSelectedFiles,
} = require("../services/fileService");

const {
    getDownloadUrl,
    deleteFile,
} = require("../services/storageService");

const {
    createZip,
} = require("../services/zipService");

const MAX_TRANSFER_SIZE = 2 * 1024 * 1024 * 1024;

const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        const totalSize = req.files.reduce(
            (total, file) => total + file.size,
            0,
        );

        if (totalSize > MAX_TRANSFER_SIZE) {
            for (const file of req.files) {
                if (!file.key) {
                    continue;
                }

                try {
                    await deleteFile(file.key);
                } catch (error) {
                    console.log(
                        `Failed to clean up rejected upload: ${file.key}`,
                    );

                    console.log(error.message);
                }
            }

            return res.status(400).json({
                success: false,
                message: "Total transfer size cannot exceed 2 GB",
            });
        }

        const uploadedFiles = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.location,
            s3Key: file.key,
            fileSize: file.size,
        }));

        const expiryMinutes = Number(req.body.expiry);
        const maxDownloads = Number(req.body.maxDownloads);

        const allowedExpiry = [1, 5, 15, 60, 1440];
        const allowedDownloads = [1, 5, 10, 25];

        if (!allowedExpiry.includes(expiryMinutes)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expiry value",
            });
        }

        if (!allowedDownloads.includes(maxDownloads)) {
            return res.status(400).json({
                success: false,
                message: "Invalid download limit",
            });
        }

        const result = await createTransfer(
            uploadedFiles,
            expiryMinutes,
            maxDownloads,
        );

        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};

const getTransfer = async (req, res) => {
    try {
        const result = await getTransferInfo(req.params.key);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Failed to fetch transfer info",
        });
    }
};

const downloadFiles = async (req, res) => {
    try {
        const { fileIds } = req.body;

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one file",
            });
        }

        const {
            transfer,
            selectedFiles,
        } = await getSelectedFiles(
            req.params.key,
            fileIds,
        );

        if (selectedFiles.length === 1) {
            const file = selectedFiles[0];

            const downloadUrl = await getDownloadUrl(
                file.s3Key,
                file.fileName,
            );

            return res.status(200).json({
                success: true,
                type: "file",
                fileName: file.fileName,
                downloadUrl,
            });
        }

        await createZip(
            res,
            selectedFiles,
            `${transfer.key}-selected.zip`,
        );
    } catch (error) {
        console.log(error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Selected download failed",
        });
    }
};

module.exports = {
    uploadFiles,
    getTransfer,
    downloadFiles,
};