const cron = require("node-cron");

const File = require("../models/File");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

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
            if (!uploadedFile.s3Key) {
              console.log(`Missing s3Key for file: ${uploadedFile.fileName}`);

              continue;
            }

            try {
              await s3.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_BUCKET_NAME,

                  Key: uploadedFile.s3Key,
                }),
              );

              console.log(`Deleted S3 file: ${uploadedFile.s3Key}`);
            } catch (error) {
              console.log(`Failed to delete S3 file: ${uploadedFile.s3Key}`);

              console.log(error.message);
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
