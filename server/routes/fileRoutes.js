const express = require("express");
const router = express.Router();
const archiver = require("archiver");

const upload = require("../middleware/upload");
const File = require("../models/File");

const { v4: uuidv4 } = require("uuid");

router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const key = uuidv4().slice(0, 6);

    const uploadedFiles = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
    }));

    const expiryMinutes = Number(req.body.expiry) || 5;
    const maxDownloads = Number(req.body.maxDownloads) || 10;

    const newFile = new File({
      key,
      files: uploadedFiles,
      maxDownloads,
      downloadCount: 0,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    });

    await newFile.save();

    res.status(200).json({
      success: true,
      key,
      expiresAt: newFile.expiresAt,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

router.get("/info/:key", async (req, res) => {
  try {
    const fileData = await File.findOne({
      key: req.params.key,
    });

    // FILE NOT FOUND

    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    // EXPIRED

    if (new Date() > fileData.expiresAt) {
      return res.status(403).json({
        success: false,
        message: "Transfer expired",
      });
    }

    // DOWNLOAD LIMIT

    if (fileData.downloadCount >= fileData.maxDownloads) {
      return res.status(403).json({
        success: false,
        message: "Maximum download limit reached",
      });
    }

    // SUCCESS

    res.status(200).json({
      success: true,

      key: fileData.key,

      files: fileData.files.map((file) => ({
        fileName: file.fileName,
      })),

      totalFiles: fileData.files.length,

      expiresAt: fileData.expiresAt,

      downloadCount: fileData.downloadCount,

      maxDownloads: fileData.maxDownloads,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transfer info",
    });
  }
});


router.get("/download/:key", async (req, res) => {
  try {

    // FIND FILE

    const fileData = await File.findOne({
      key: req.params.key,
    });

    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // CHECK EXPIRY

    if (new Date() > fileData.expiresAt) {
      return res.status(403).json({
        success: false,
        message: "Link expired",
      });
    }

    // CHECK DOWNLOAD LIMIT

    if (
      fileData.downloadCount >=
      fileData.maxDownloads
    ) {
      return res.status(403).json({
        success: false,
        message: "Maximum download limit reached",
      });
    }

    // INCREMENT DOWNLOAD COUNT

    fileData.downloadCount += 1;

    await fileData.save();

    // CHECK FILES

    if (
      !fileData.files ||
      fileData.files.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Files not found",
      });
    }

    // ZIP RESPONSE

    res.attachment(`${fileData.key}.zip`);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    // ADD FILES TO ZIP

    for (const file of fileData.files) {

      archive.file(file.filePath, {
        name: file.fileName,
      });
    }

    // ZIP ERROR

    archive.on("error", (error) => {

      console.log(error.message);

      res.status(500).end();
    });

    // FINALIZE ZIP

    await archive.finalize();

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
});

module.exports = router;
