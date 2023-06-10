const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const notesRoutes = require('./routes/notes');
const mapsRoutes = require('./routes/maps');
const weatherRoutes = require('./routes/weather');
const { refreshToken } = require('./controllers/refresh-token');

// Route untuk autentikasi
app.use('/auth', authRoutes);

// Route untuk pengelolaan pengguna
app.use('/user', userRoutes);

// Route untuk catatan pengguna
app.use('/user/notes', notesRoutes);

// Route untuk peta pengguna
app.use('/api/maps', mapsRoutes);

// Route untuk cuaca pengguna
app.use('/api/weather', weatherRoutes);

// Route untuk memperbarui token
app.get('/refresh-token', refreshToken);

// Mount Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
