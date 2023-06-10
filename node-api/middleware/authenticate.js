const jwt = require('jsonwebtoken');
const { refreshToken } = require('../controllers/refresh-token');
require('dotenv').config();

const authenticate = (req, res, next) => {
  try {
    // Dapatkan access token dari permintaan
    const accessToken = req.headers.authorization.split(' ')[1];

    // Verifikasi access token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Lakukan otorisasi sesuai kebutuhan
      req.user = decoded;

      // Panggil next() jika otorisasi berhasil
      next();
    });
  } catch (error) {
    // Berikan jawaban jika terjadi kesalahan
    res.status(401).json({ message: 'Token Tidak Valid!' });
  }
};

module.exports = authenticate;
