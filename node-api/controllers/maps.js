const axios = require('axios');

exports.getMaps = async (req, res) => {
  try {
    // Ambil address dari request query
    const { address } = req.query;

    // Periksa apakah address ada
    if (!address) {
      return res.status(400).json({ message: 'Alamat harus disediakan' });
    }

    // Buat permintaan ke API Google Maps Platform - GeoCoding
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        address: address,
      },
    });

    // Ambil hasil geocoding dari respons
    const mapsData = response.data.results;

    // Periksa apakah data maps ditemukan
    if (!mapsData) {
      return res.status(404).json({ message: 'Data geocoding tidak ditemukan' });
    }

    // Simpan data cuaca yang akan digunakan
    const results = mapsData.map(result => ({
      formatted_address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    }));

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Maps didapatkan', results });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data dari Google Maps API', error: error.message });
  }
};
