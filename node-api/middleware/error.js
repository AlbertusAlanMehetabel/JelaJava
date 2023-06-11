exports.errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Terjadi kesalahan server',
    },
  });
};

exports.notFoundHandler = (req, res, next) => {
  const error = new Error('404 - Rute tidak ditemukan');
  error.status = 404;
  next(error);
};
