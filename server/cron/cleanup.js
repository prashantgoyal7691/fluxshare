const cron = require("node-cron");
const fs = require("fs");

const File = require("../models/File");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking expired files...");

    const expiredFiles = await File.find({
      expiresAt: { $lt: new Date() },
    });

    for (const file of expiredFiles) {
      try {
        if (file.files && file.files.length > 0) {
          for (const uploadedFile of file.files) {
            if (fs.existsSync(uploadedFile.filePath)) {
              fs.unlinkSync(uploadedFile.filePath);
            }
          }
        }

        await File.deleteOne({ _id: file._id });

        console.log(`Deleted expired transfer: ${file.key}`);
      } catch (error) {
        console.log("File deletion error:", error.message);
      }
    }
  } catch (error) {
    console.log("Cron job error:", error.message);
  }
});