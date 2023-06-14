const firebase = require('../config/firebase');

// Mendapatkan profil pengguna
exports.showUserProfile = async (req, res) => {
  try {
    // Ambil Unique ID dari request user
    const { uid } = req.user;

    // Mendapatkan data pengguna dari Firestore
    const userSnapshot = await firebase.firestore().collection('users').doc(uid).get();
    const userData = userSnapshot.data();

    // Batasi informasi sensitif (password)
    const { password, ...profileData } = userData;

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Pengguna berhasil didapatkan', user: profileData });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

const { storage } = require('../config/storage');

// Memperbarui profil pengguna
exports.updateUser = async (req, res) => {
  try {
    // Ambil Unique ID dari request user dan name dari request body
    const { uid } = req.user;
    const { name } = req.body;

    // Hanya memperbolehkan update kolom tertentu (name)
    const updateData = {};

    if (name) {
      updateData.name = name;
      await firebase.firestore().collection('users').doc(uid).update(updateData);

      // Berikan jawaban jika berhasil
      res.status(200).json({ message: 'Pengguna berhasil diperbarui', update: updateData });
      blobStream.end(file.buffer);
    } else {
      // Jika tidak ada data lain yang berubah (jika ada), langsung perbarui data pengguna di Firestore
      await firebase.firestore().collection('users').doc(uid).update(updateData);

      // Berikan jawaban jika berhasil
      res.status(200).json({ message: 'Pengguna berhasil diperbarui', update: updateData });
    }
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};

// Menghapus akun pengguna
exports.deleteUser = async (req, res) => {
  try {
    // Ambil Unique ID dari request user
    const { uid } = req.user;

    // Hapus data pengguna dari Firestore
    await firebase.firestore().collection('users').doc(uid).delete();

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ error: error.message });
  }
};
