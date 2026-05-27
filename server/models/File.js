const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  files: [
    {
      fileName: {
        type: String,
        required: true,
      },

      filePath: {
        type: String,
        required: true,
      },
      s3Key: {
        type: String,
        required: true,
      },
    },
  ],
  
  maxDownloads: {
    type: Number,
    default: 10,
  },

  downloadCount: {
    type: Number,
    default: 0,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);
