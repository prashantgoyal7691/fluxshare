const archiver = require("archiver");
const { getFileStream } = require("./storageService");

const createZip = async (res, files, zipName) => {
  res.attachment(zipName);

  const archive = archiver("zip", {
    zlib: {
      level: 9,
    },
  });

  archive.on("error", (error) => {
    console.log("ZIP error:", error.message);

    if (!res.headersSent) {
      res.status(500).end();
    }
  });

  archive.pipe(res);

  const usedNames = new Map();

  for (const file of files) {
    try {
      const stream = await getFileStream(file.s3Key);

      let fileName = file.fileName;

      if (usedNames.has(fileName)) {
        const count = usedNames.get(fileName) + 1;

        usedNames.set(fileName, count);

        const extensionIndex = fileName.lastIndexOf(".");

        if (extensionIndex === -1) {
          fileName = `${fileName} (${count})`;
        } else {
          const name = fileName.substring(0, extensionIndex);
          const extension = fileName.substring(extensionIndex);

          fileName = `${name} (${count})${extension}`;
        }
      } else {
        usedNames.set(fileName, 0);
      }

      archive.append(stream, {
        name: fileName,
      });
    } catch (error) {
      console.log(`Failed to stream file: ${file.fileName}`);
      console.log(error.message);
    }
  }

  await archive.finalize();
};

module.exports = {
  createZip,
};