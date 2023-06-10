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

const { uploadPhoto } = require('../middleware/upload');
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
    }

    // Periksa apakah ada foto yang diupload
    if (req.file) {
      // Generate unique filename untuk foto
      const fileName = uuidv4();

      // Ambil file foto dari request body
      const file = req.file;

      const bucket = storage.bucket(storageConfig.bucketName);
      const gcsFileName = `profilePictures/${fileName}`;

      const blob = bucket.file(gcsFileName);

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', error => {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah foto' });
      });

      blobStream.on('finish', async () => {
        // Dapatkan URL foto dari Google Cloud Storage
        const photoURL = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;

        // Perbarui data pengguna di Firestore
        updateData.profilePicture = photoURL;
        await firebase.firestore().collection('users').doc(uid).update(updateData);

        // Berikan jawaban jika berhasil
        res.status(200).json({ message: 'Pengguna berhasil diperbarui', update: updateData });
      });

      blobStream.end(file.buffer);
    } else {
      // Jika tidak ada foto yang diupload, langsung perbarui data pengguna di Firestore
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
