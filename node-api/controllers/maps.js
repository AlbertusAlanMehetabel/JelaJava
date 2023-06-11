const axios = require('axios');
const { mapsClient } = require('../config/mapsClient');

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

exports.getRoutes = async (req, res) => {
  const { from, to } = req.query;

  try {
    console.log(`Finding routes from ${from} to ${to}`);

    // Mengatur parameter permintaan arah
    const directionsParams = {
      key: process.env.GOOGLE_MAPS_API_KEY,
      origin: from,
      destination: to,
      mode: 'transit',
      alternatives: true
    };

    // Mengirim permintaan arah ke Google Maps API
    const directionsResponse = await mapsClient.directions({ params: directionsParams });

    // Mengambil rute dari respons API
    const routes = directionsResponse.data.routes;

    if (routes && routes.length > 0) {
      // Jika terdapat rute yang ditemukan
      res.status(200).json({ message: 'Rute didapatkan', routes });
    } else {
      // Jika tidak ditemukan rute
      res.status(404).json({ message: 'Tidak ditemukan rute untuk perjalanan yang diberikan.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data rute', error: error.message });
  }
};


