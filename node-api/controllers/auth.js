const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const firebase = require('../config/firebase');

let ml_id_now = 1;
const model_limit = 299;
// Pengguna daftar
exports.register = async (req, res) => {
  try {
    // Mengambil variabel dari request body
    const { name, email, password, confirmPassword } = req.body;

    // Cek apakah email valid
    if (!validator.validate(email)) {
      return res.status(400).json({ message: 'Alamat email tidak valid' });
    }

    // Cek apakah panjang password lebih dari 8 chars
    if (password.length < 8) {
      return res.status(400).json({ message: 'Panjang password harus lebih dari 8 karakter' });
    }

    // Cek apakah password dan confirmPassword sama
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password dan Confirm Password tidak cocok' });
    }

    // Cek apakah email terdaftar
    const querySnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();
    if (!querySnapshot.empty) {
      return res.status(400).json({ message: 'Email telah terdaftar. Silahkan gunakan email lain.' });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mengambil total pengguna terdaftar
    const totalUsersSnapshot = await firebase.firestore().collection('users').get();
    const totalUsersNow = totalUsersSnapshot.size;

    const ml_user_input = (totalUsersNow % model_limit) + 1;
    ml_id_now = ml_user_input + 1 > model_limit ? 1 : ml_user_input + 1;

    // Membuat object pengguna baru
    const newUser = {
      name,
      email,
      password: hashedPassword,
      profilePicture: 'https://storage.googleapis.com/user-image-bucket-c23-ps222/default.jpg', // Default URL
      ml_user_input,
      refreshToken: null,
    };

    // Simpan pengguna baru kedalam Firestore
    const userRef = await firebase.firestore().collection('users').add(newUser);
    const user = { id: userRef.id, ...newUser };

    // Berikan jawaban jika berhasil
    res.status(201).json({ message: 'Register berhasil', user });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

// Pengguna masuk
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah email valid
    if (!validator.validate(email)) {
      return res.status(400).json({ message: 'Alamat email tidak valid' });
    }

    // Cek apakah password ada
    if (!password) {
      return res.status(400).json({ message: 'Password harus diisi' });
    }

    // Cari pengguna berdasarkan email di Firestore
    const querySnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();

    // Cek apakah ada dokumen data pengguna yang ditemukan
    if (querySnapshot.empty) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Buat object userRed, user, dan id user
    const userRef = querySnapshot.docs[0];
    const user = userRef.data();
    const userId = userRef.id;

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Cek apakah passwordnya benar setelah di decrypt
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Generate access token
    const accessToken = jwt.sign({ uid: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });

    // Generate refresh token
    const refreshToken = jwt.sign({ uid: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    // Simpan refresh token ke Firestore
    await firebase.firestore().collection('users').doc(userId).update({ refreshToken });

    // Atur refresh token sebagai cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Login berhasil', accessToken });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Pengguna keluar
exports.logout = async (req, res) => {
  try {
    // Ambil Unique ID dari request user
    const uid = req.user.uid;

    // Cek apakah pengguna ada
    if (!uid) {
      return res.status(401).json({ message: 'Pengguna tidak terautentikasi' });
    }

    // Hapus refresh token di Firestore
    await firebase.firestore().collection('users').doc(uid).update({ refreshToken: null });

    // Hapus refresh token pada cookie
    res.clearCookie('refreshToken');

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Logout berhasil' });
  } catch (error) {
    // Berikan jawaban jika berhasil
    res.status(500).json({ error: error.message });
  }
};
