const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");

const {
    getTransfer,
    setTransfer,
    updateDownloadCount,
    deleteTransfer,
} = require("./cacheService");

const createTransfer = async (uploadedFiles, expiryMinutes, maxDownloads) => {
    const key = uuidv4().slice(0, 6);

    const expiresAt = new Date(
        Date.now() + expiryMinutes * 60 * 1000,
    );

    const newFile = new File({
        key,
        files: uploadedFiles,
        maxDownloads,
        downloadCount: 0,
        expiresAt,
    });

    await newFile.save();

    return {
        success: true,
        key,
        expiresAt: newFile.expiresAt,
        totalFiles: uploadedFiles.length,
        maxDownloads,
    };
};

const getTransferInfo = async (key) => {
    const cachedData = await getTransfer(key);

    if (cachedData) {
        if (new Date() >= new Date(cachedData.expiresAt)) {
            await deleteTransfer(key);

            const error = new Error("Transfer expired");
            error.statusCode = 403;
            throw error;
        }

        if (
            cachedData.downloadCount >=
            cachedData.maxDownloads
        ) {
            const error = new Error(
                "Maximum download limit reached",
            );
            error.statusCode = 403;
            throw error;
        }

        return cachedData;
    }

    const fileData = await File.findOne({
        key,
    });

    if (!fileData) {
        const error = new Error("Transfer not found");
        error.statusCode = 404;
        throw error;
    }

    if (new Date() >= fileData.expiresAt) {
        const error = new Error("Transfer expired");
        error.statusCode = 403;
        throw error;
    }

    if (
        fileData.downloadCount >=
        fileData.maxDownloads
    ) {
        const error = new Error(
            "Maximum download limit reached",
        );
        error.statusCode = 403;
        throw error;
    }

    const responseData = {
        success: true,
        key: fileData.key,

        files: fileData.files.map((file) => ({
            id: file._id.toString(),
            fileName: file.fileName,
            fileSize: file.fileSize || null,
        })),

        totalFiles: fileData.files.length,
        expiresAt: fileData.expiresAt,
        downloadCount: fileData.downloadCount,
        maxDownloads: fileData.maxDownloads,
    };

    await setTransfer(
        key,
        responseData,
        fileData.expiresAt,
    );

    return responseData;
};

const getSelectedFiles = async (key, fileIds) => {
    const now = new Date();

    const fileData = await File.findOne({
        key,
    });

    if (!fileData) {
        const error = new Error("Transfer not found");
        error.statusCode = 404;
        throw error;
    }

    if (now >= fileData.expiresAt) {
        const error = new Error("Link expired");
        error.statusCode = 403;
        throw error;
    }

    const selectedFiles = fileData.files.filter((file) =>
        fileIds.includes(file._id.toString()),
    );

    if (selectedFiles.length === 0) {
        const error = new Error("Selected files were not found");
        error.statusCode = 400;
        throw error;
    }

    const updatedFile = await File.findOneAndUpdate(
        {
            key,
            expiresAt: { $gt: now },
            $expr: {
                $lt: ["$downloadCount", "$maxDownloads"],
            },
        },
        {
            $inc: {
                downloadCount: 1,
            },
        },
        {
            new: true,
        },
    );

    if (!updatedFile) {
        const error = new Error(
            "Maximum download limit reached",
        );
        error.statusCode = 403;
        throw error;
    }

    await updateDownloadCount(
        key,
        updatedFile.downloadCount,
        updatedFile.expiresAt,
    );

    return {
        transfer: updatedFile,
        selectedFiles,
    };
};

module.exports = {
    createTransfer,
    getTransferInfo,
    getSelectedFiles,
};