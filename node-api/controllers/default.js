exports.defaultRoute = async (req, res) => {
  try {
    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Terhubung dengan API JelaJava' });
  } catch (error) {
    // Berikan jawaban jika berhasil
    res.status(500).json({ message: 'Gagal terhubung dengan API JelaJava', error: error.message });
  }
};
