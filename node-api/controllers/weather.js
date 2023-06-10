const axios = require('axios');

// Mendapatkan detail cuaca
exports.getWeather = async (req, res) => {
  try {
    // Ambil city dari request query
    const { city } = req.query;

    // Periksa apakah city ada
    if (!city) {
      return res.status(400).json({ message: 'Kota harus disediakan' });
    }

    // Buat permintaan ke api.weatherapi.com
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: city,
      },
    });

    // Periksa apakah data cuaca ditemukan
    const weatherData = response.data;
    if (!weatherData) {
      return res.status(404).json({ message: 'Data cuaca tidak ditemukan' });
    }

    // Simpan data cuaca yang akan digunakan
    const { location, current } = weatherData;
    const { name, region, country } = location;
    const { temp_c, condition } = current;
    const weather = {
      city: name,
      region: region,
      country: country,
      temperatureC: temp_c,
      condition: condition.text,
    };

    // Berikan jawaban jika berhasil
    res.status(200).json({ message: 'Cuaca didapatkan', weather });
  } catch (error) {
    // Berikan jawaban jika gagal
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data cuaca', error: error.message });
  }
};
