const jwt = require('jsonwebtoken');
const firebase = require('../config/firebase');

// Fungsi untuk memperbarui token
exports.refreshToken = async (req, res) => {
  try {
    // Dapatkan refresh token dari cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    // Verifikasi refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Dapatkan user ID dari token yang terdekripsi
      const userId = decoded.uid;

      // Cari pengguna berdasarkan ID di Firestore
      const userSnapshot = await firebase.firestore().collection('users').doc(userId).get();
      const user = userSnapshot.data();

      // Periksa keberadaan pengguna
      if (!user) {
        return res.sendStatus(401);
      }

      // Buat access token baru
      const accessToken = jwt.sign({ uid: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Berikan jawaban jika berhasil
      res.status(200).json({ message: 'Akses token baru berhasil dibuat', accessToken });
    });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};
