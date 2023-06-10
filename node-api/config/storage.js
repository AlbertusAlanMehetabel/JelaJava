const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './config/cloud-bucketsdk.json' });

module.exports = storage;
