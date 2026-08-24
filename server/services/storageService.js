const {
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");

const s3 = require("../config/s3");

const getDownloadUrl = async (s3Key, fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 120,
  });
};

const getFileStream = async (s3Key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  });

  const response = await s3.send(command);

  return response.Body;
};

const deleteFile = async (s3Key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  });

  await s3.send(command);
};

module.exports = {
  getDownloadUrl,
  getFileStream,
  deleteFile,
};