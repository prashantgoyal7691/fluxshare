const express = require("express");
const archiver = require("archiver");
const router = express.Router();

const upload = require("../middleware/upload");
const File = require("../models/File");

const { v4: uuidv4 } = require("uuid");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

router.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const key = uuidv4().slice(0, 6);

    const uploadedFiles = req.files.map((file) => ({
      fileName: file.originalname,
      filePath: file.location,
      s3Key: file.key,
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
      totalFiles: uploadedFiles.length,
      maxDownloads,
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
        fileSize: file.fileSize || null,
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

    // ATOMIC DOWNLOAD COUNT UPDATE

    const updatedFile = await File.findOneAndUpdate(
      {
        key: req.params.key,

        downloadCount: {
          $lt: fileData.maxDownloads,
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
      return res.status(403).json({
        success: false,
        message: "Maximum download limit reached",
      });
    }

    // CHECK FILES

    if (!updatedFile.files || updatedFile.files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Files not found",
      });
    }

    if (updatedFile.files.length === 1) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,

        Key: updatedFile.files[0].s3Key,
        ResponseContentDisposition: `attachment; filename="${updatedFile.files[0].fileName}"`,
      });

      const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 120,
      });

      return res.redirect(signedUrl);
    }

    // Stream multiple S3 files into a ZIP
    res.attachment(`${updatedFile.key}.zip`);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (error) => {
      console.log(error.message);
      res.status(500).end();
    });

    archive.pipe(res);

    for (const file of updatedFile.files) {
      try {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: file.s3Key,
        });

        const response = await s3.send(command);

        archive.append(response.Body, {
          name: file.fileName,
        });
      } catch (error) {
        console.log(`Failed to stream file: ${file.fileName}`);
        console.log(error.message);
      }
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
