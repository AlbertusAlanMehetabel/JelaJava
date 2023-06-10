const { storage } = require('../config/storage');

const upload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const file = storage.bucket(options.destination.bucket).file(options.destination.name);
    const stream = file.createWriteStream(options);

    stream.on('error', reject);
    stream.on('finish', resolve);

    stream.end(buffer);
  });
};

module.exports = upload;
