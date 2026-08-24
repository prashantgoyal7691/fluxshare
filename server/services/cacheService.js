const redis = require("../config/redis");

const getTransfer = async (key) => {
  return redis.get(`transfer:${key}`);
};

const setTransfer = async (key, data, expiresAt) => {
  const remainingSeconds = Math.max(
    1,
    Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / 1000,
    ),
  );

  return redis.set(`transfer:${key}`, data, {
    ex: remainingSeconds,
  });
};

const updateDownloadCount = async (
  key,
  downloadCount,
  expiresAt,
) => {
  const cached = await getTransfer(key);

  if (!cached) {
    return;
  }

  cached.downloadCount = downloadCount;

  await setTransfer(key, cached, expiresAt);
};

const deleteTransfer = async (key) => {
  return redis.del(`transfer:${key}`);
};

module.exports = {
  getTransfer,
  setTransfer,
  updateDownloadCount,
  deleteTransfer,
};