const express = require("express");
const router = express.Router();
const archiver = require("archiver");
console.log(archiver);

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

    const newFile = new File({
      key,
      files: uploadedFiles,
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

router.get("/download/:key", async (req, res) => {
  try {
    const fileData = await File.findOne({
      key: req.params.key,
    });

    if (!fileData) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (new Date() > fileData.expiresAt) {
      return res.status(403).json({
        success: false,
        message: "Link expired",
      });
    }

    if (!fileData.files || fileData.files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Files not found",
      });
    }

    res.attachment(`${fileData.key}.zip`);

    const archive = new archiver.ZipArchive({
      zlib: { level: 9 },
    });

    archive.pipe(res);

    for (const file of fileData.files) {
      archive.file(file.filePath, {
        name: file.fileName,
      });
    }

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
