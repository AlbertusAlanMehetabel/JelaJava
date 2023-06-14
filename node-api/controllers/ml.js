const axios = require('axios');
const firebase = require('../config/firebase');

exports.recommendation = async (req, res) => {
  try {
    // Ambil UID dari request user dan rec_n (optional) dari request body
    const { uid } = req.user;
    const { rec_n } = req.body;

    // Ambil dokumen pengguna dari Firestore berdasarkan `uid`
    const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();

    if (!userSnapshot.exists) {
      // Periksa apakah dokumen pengguna ada
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Dapatkan data pengguna
    const userData = userSnapshot.data();

    // Ambil nilai `ml_user_input` dari data pengguna
    const user_input = userData.ml_user_input;

    // Kirim permintaan POST ke Flask API dengan `user_input` dan `rec_n`
    const response = await axios.post('https://flask-api-froi2bfpmq-et.a.run.app/recommendation', {
      user_input,
      rec_n,
    });

    // Periksa apakah respons ditemukan
    if (!response) {
      return res.status(404).json({ message: 'Tidak ada jawaban dari API Machine Learning' }); // Mengembalikan respons dengan status 404 jika respons tidak ditemukan
    }

    // Dapatkan data rekomendasi dari respons
    const recommendationData = response.data;

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Rekomendasi telah ditemukan', data: recommendationData });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dari API Machine Learning', error: error.message });
  }
};

// Filter kota
exports.filter = async (req, res) => {
  try {
    // Ambil city dari request body
    const { city } = req.body;

    // Periksa apakah city ada
    if (!city) {
      return res.status(400).json({ message: 'Kota harus disediakan' });
    }

    // Buat permintaan ke Flask API
    const response = await axios.post('https://flask-api-froi2bfpmq-et.a.run.app/filter', {
      city: city,
    });

    // Periksa apakah response ditemukan
    if (!response) {
      return res.status(404).json({ message: 'Tidak ada jawaban dari Machine Learning API' });
    }

    // Ambil data
    const filterData = response.data;

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Kota telah di-filter', data: filterData });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dari Machine Learning API', error: error.message });
  }
};
