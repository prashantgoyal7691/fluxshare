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
    },
  ],

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);