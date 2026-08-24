const cron = require("node-cron");

const File = require("../models/File");

const {
  deleteFile,
} = require("../services/storageService");

const {
  deleteTransfer,
} = require("../services/cacheService");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking expired transfers...");

    const expiredTransfers = await File.find({
      expiresAt: { $lt: new Date() },
    });

    for (const transfer of expiredTransfers) {
      try {
        let allS3Deleted = true;

        if (
          transfer.files &&
          transfer.files.length > 0
        ) {
          for (const file of transfer.files) {
            if (!file.s3Key) {
              console.log(
                `Missing s3Key for file: ${file.fileName}`,
              );

              allS3Deleted = false;
              continue;
            }

            try {
              await deleteFile(file.s3Key);

              console.log(
                `Deleted S3 file: ${file.s3Key}`,
              );
            } catch (error) {
              allS3Deleted = false;

              console.log(
                `Failed to delete S3 file: ${file.s3Key}`,
              );

              console.log(error.message);
            }
          }
        }

        if (!allS3Deleted) {
          console.log(
            `Skipping database deletion for transfer: ${transfer.key}`,
          );

          continue;
        }

        try {
          await deleteTransfer(transfer.key);

          console.log(
            `Deleted Redis cache for transfer: ${transfer.key}`,
          );
        } catch (error) {
          console.log(
            `Failed to delete Redis cache for transfer: ${transfer.key}`,
          );

          console.log(error.message);
        }

        await File.deleteOne({
          _id: transfer._id,
        });

        console.log(
          `Deleted expired transfer: ${transfer.key}`,
        );
      } catch (error) {
        console.log(
          `Transfer cleanup error (${transfer.key}):`,
          error.message,
        );
      }
    }
  } catch (error) {
    console.log(
      "Cleanup cron error:",
      error.message,
    );
  }
});